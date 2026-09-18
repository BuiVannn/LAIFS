import numpy as np

P = np.array([0.5, 0.3, 0.2])
Q = np.array([0.7, 0.2, 0.1])


def _ngau_nhien(rng, n, k):
    x = rng.uniform(0.05, 1.0, size=(n, k))
    return x / x.sum(axis=1, keepdims=True)


def test_ba_gia_tri_tinh_tay():
    assert np.isclose(entropy(P), 1.0296530140645737), f"entropy cần ≈ 1.029653, nhận {entropy(P)}"
    assert np.isclose(cross_entropy(P, Q), 1.1216858642984056), (
        f"cross_entropy cần ≈ 1.121688, nhận {cross_entropy(P, Q)}. Nhớ: trọng số là p, logarit lấy của q."
    )
    assert np.isclose(kl(P, Q), 0.0920328502338319), f"kl cần ≈ 0.092033, nhận {kl(P, Q)}"


def test_entropy_deu_va_chac_chan():
    for k in (2, 3, 8):
        deu = np.full(k, 1 / k)
        assert np.isclose(entropy(deu), np.log(k)), f"phân phối đều {k} lớp có entropy = ln {k}"
    chac_chan = np.zeros(5)
    chac_chan[2] = 1.0
    assert np.isclose(entropy(chac_chan), 0.0), (
        f"phân phối chắc chắn có entropy 0, nhận {entropy(chac_chan)} — nếu là nan thì bạn chưa xử lý 0·ln0."
    )


def test_khong_sinh_nan_voi_nhan_one_hot():
    oh = np.array([1.0, 0.0, 0.0])
    for ten, v in (("entropy", entropy(oh)), ("cross_entropy", cross_entropy(oh, Q)), ("kl", kl(oh, Q))):
        assert np.isfinite(v), f"{ten} trả về {v} với nhãn one-hot — quy ước 0·ln0 = 0 chưa được cài"
    assert np.isclose(cross_entropy(oh, Q), 0.35667494393873245), "one-hot: CE phải bằng −ln q của lớp đúng"
    assert np.isclose(kl(oh, Q), cross_entropy(oh, Q)), "one-hot: H(p) = 0 nên KL phải trùng CE"


def test_dang_thuc_ce_bang_h_cong_kl():
    rng = np.random.default_rng(11)
    for p, q in zip(_ngau_nhien(rng, 25, 6), _ngau_nhien(rng, 25, 6)):
        assert np.isclose(cross_entropy(p, q), entropy(p) + kl(p, q)), (
            f"CE = H(p) + KL(p‖q) sai:\n  p = {np.round(p, 4)}\n  q = {np.round(q, 4)}\n"
            f"  CE = {cross_entropy(p, q)}, H + KL = {entropy(p) + kl(p, q)}"
        )


def test_kl_khong_am_va_bang_0_khi_trung_nhau():
    rng = np.random.default_rng(12)
    for p, q in zip(_ngau_nhien(rng, 25, 4), _ngau_nhien(rng, 25, 4)):
        assert kl(p, q) >= -1e-12, f"KL không bao giờ âm, nhận {kl(p, q)}"
        assert np.isclose(kl(p, p), 0.0), f"KL(p‖p) phải bằng 0, nhận {kl(p, p)}"
        assert np.isclose(cross_entropy(p, p), entropy(p)), "CE(p, p) phải bằng H(p)"


def test_kl_khong_doi_xung():
    assert np.isclose(kl(Q, P), 0.08512282595722176), f"KL(q‖p) cần ≈ 0.085123, nhận {kl(Q, P)}"
    assert not np.isclose(kl(P, Q), kl(Q, P)), "KL không đối xứng, hai chiều phải khác nhau"


def test_cross_entropy_batch():
    Pb = np.array([[1.0, 0, 0], [0, 1, 0], [0, 0, 1], [0.5, 0.5, 0]])
    Qb = np.array([[0.7, 0.2, 0.1], [0.2, 0.5, 0.3], [0.1, 0.1, 0.8], [0.4, 0.4, 0.2]])
    v = cross_entropy_batch(Pb, Qb)
    assert np.isclose(v, 0.5473141019217607), (
        f"cần ≈ 0.547314, nhận {v}. Cộng theo LỚP (axis=1), rồi mới lấy trung bình theo HÀNG."
    )
    # số hàng khác số lớp: cộng nhầm trục sẽ lộ ra ngay
    rng = np.random.default_rng(13)
    Pr, Qr = _ngau_nhien(rng, 7, 3), _ngau_nhien(rng, 7, 3)
    tay = np.mean([cross_entropy(a, b) for a, b in zip(Pr, Qr)])
    assert np.isclose(cross_entropy_batch(Pr, Qr), tay), (
        f"batch cho {cross_entropy_batch(Pr, Qr)}, cộng tay từng hàng cho {tay}"
    )


def test_cross_entropy_batch_nho_nhat_khi_q_bang_p():
    rng = np.random.default_rng(14)
    Pr = _ngau_nhien(rng, 20, 5)
    tot_nhat = cross_entropy_batch(Pr, Pr)
    for _ in range(5):
        khac = _ngau_nhien(rng, 20, 5)
        assert tot_nhat < cross_entropy_batch(Pr, khac), "đoán đúng phân phối p phải cho cross-entropy thấp nhất"
