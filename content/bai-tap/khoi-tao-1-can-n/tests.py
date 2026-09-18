import numpy as np


def test_shape_tung_lop():
    Ws = khoi_tao([8, 5, 3, 2], np.random.default_rng(0))
    assert len(Ws) == 3, f"[8, 5, 3, 2] có 3 lớp, nhận {len(Ws)}"
    for W, mong in zip(Ws, [(5, 8), (3, 5), (2, 3)]):
        assert np.shape(W) == mong, f"cần shape (d_ra, d_vao) = {mong}, nhận {np.shape(W)}"


def test_sigma_mac_dinh_la_1_can_d_vao():
    Ws = khoi_tao([400, 400, 100], np.random.default_rng(1))
    assert np.isclose(np.std(Ws[0]), 1 / np.sqrt(400), rtol=0.06), \
        f"lớp d_vao = 400 cần sigma ≈ {1 / np.sqrt(400):.4f}, nhận {np.std(Ws[0]):.4f}"
    assert np.isclose(np.std(Ws[1]), 1 / np.sqrt(400), rtol=0.06), \
        f"sigma phải theo d_vao của CHÍNH lớp đó (400), nhận {np.std(Ws[1]):.4f}"


def test_sigma_chi_dinh_ro():
    Ws = khoi_tao([200, 300], np.random.default_rng(2), sigma_w=0.25)
    assert np.isclose(np.std(Ws[0]), 0.25, rtol=0.06), \
        f"khi truyền sigma_w = 0.25 thì phải dùng đúng số đó, nhận {np.std(Ws[0]):.4f}"


def test_std_qua_lop_do_dai_va_gia_tri():
    rng = np.random.default_rng(3)
    X = rng.normal(size=(500, 6))
    Ws = [rng.normal(size=(4, 6)), rng.normal(size=(3, 4))]
    kq = std_qua_lop(X, Ws)
    assert len(kq) == 3, f"cần len(Ws) + 1 = 3 phần tử, nhận {len(kq)}"
    H = X
    mong = [float(X.std())]
    for W in Ws:
        H = H @ W.T
        mong.append(float(H.std()))
    assert np.allclose(kq, mong), f"lệch với tham chiếu:\n  của bạn: {np.round(kq, 5)}\n  đúng:    {np.round(mong, 5)}"


def test_khoi_tao_chuan_giu_std_qua_8_lop():
    rng = np.random.default_rng(4)
    kich_thuoc = [64, 100, 80, 120, 64, 100, 80, 120, 64]
    Ws = khoi_tao(kich_thuoc, rng)
    kq = std_qua_lop(rng.normal(size=(2000, 64)), Ws)
    assert len(kq) == 9, f"8 lớp thì phải có 9 số, nhận {len(kq)}"
    assert all(0.75 < v < 1.35 for v in kq), \
        f"với sigma = 1/sqrt(d_vao), std phải giữ quanh 1 qua cả 8 lớp, nhận {np.round(kq, 4)}"


def test_sigma_qua_lon_thi_no_theo_luy_thua():
    rng = np.random.default_rng(5)
    Ws = khoi_tao([100] * 9, rng, sigma_w=0.2)      # he so moi lop = sqrt(100) * 0.2 = 2
    kq = std_qua_lop(rng.normal(size=(2000, 100)), Ws)
    assert np.isclose(kq[-1] / kq[0], 2 ** 8, rtol=0.15), \
        f"hệ số mỗi lớp là 2 nên sau 8 lớp std phải nhân {2 ** 8} lần, nhận {kq[-1] / kq[0]:.1f}"


def test_sigma_qua_nho_thi_tat_dan():
    rng = np.random.default_rng(6)
    Ws = khoi_tao([100] * 9, rng, sigma_w=0.05)     # he so moi lop = 0.5
    kq = std_qua_lop(rng.normal(size=(2000, 100)), Ws)
    assert np.isclose(kq[-1] / kq[0], 0.5 ** 8, rtol=0.15), \
        f"hệ số 0.5 nên sau 8 lớp std phải còn {0.5 ** 8:.5f} lần, nhận {kq[-1] / kq[0]:.6f}"
