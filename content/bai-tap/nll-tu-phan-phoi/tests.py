import numpy as np

DU_LIEU = np.array([2.0, 4, 4, 4, 5, 5, 7, 9])


def test_nll_bernoulli_tinh_tay():
    v = nll_bernoulli(np.array([1.0, 0, 1]), np.array([0.9, 0.2, 0.4]))
    assert np.isclose(v, 0.414931599615397), (
        f"cần ≈ 0.414932, nhận {v}. Ba số hạng là −ln0.9, −ln0.8, −ln0.4 rồi lấy TRUNG BÌNH."
    )


def test_nll_bernoulli_dung_la_cross_entropy_hai_lop():
    # Viết lại bài toán 2 lớp dưới dạng categorical: p = [1−q, q], nhãn one-hot
    rng = np.random.default_rng(0)
    y = rng.integers(0, 2, size=12).astype(float)
    q = rng.uniform(0.05, 0.95, size=12)
    P = np.stack([1 - y, y], axis=1)
    Q = np.stack([1 - q, q], axis=1)
    ce = -np.mean(np.sum(P * np.log(Q), axis=1))
    v = nll_bernoulli(y, q)
    assert np.isclose(v, ce), f"NLL Bernoulli phải trùng cross-entropy 2 lớp: nhận {v}, cần {ce}"


def test_nll_gauss_tinh_tay():
    v = nll_gauss(DU_LIEU, 5.0, 2.0)
    assert np.isclose(v, 2.112085713764618), (
        f"cần ≈ 2.112086, nhận {v}. Hằng số 0.5·ln(2π·4) ≈ 1.612086, phần MSE là 4/(2·4) = 0.5."
    )
    v1 = nll_gauss(DU_LIEU, 5.0, 1.0)
    assert np.isclose(v1, 2.9189385332046722), f"với sigma = 1 cần ≈ 2.918939, nhận {v1}"


def test_nll_gauss_nhan_mu_la_mang():
    mu = np.array([2.0, 3, 4, 5, 6, 7, 8, 9])
    v = nll_gauss(DU_LIEU, mu, 2.0)
    assert np.isclose(v, 1.737085713764618), f"mu khác nhau từng điểm: cần ≈ 1.737086, nhận {v}"


def test_hieu_nll_gauss_dung_bang_hieu_mse_chia_2sigma_binh():
    # Đây là cả điểm mấu chốt của bài: NLL Gauss = MSE/(2σ²) + hằng số không phụ thuộc mu
    mu_a, mu_b = np.array([2.0, 3, 4, 5, 6, 7, 8, 9]), np.full(8, 5.0)
    for sigma in (0.5, 1.0, 2.0, 3.0):
        d_nll = nll_gauss(DU_LIEU, mu_b, sigma) - nll_gauss(DU_LIEU, mu_a, sigma)
        d_mse = np.mean((DU_LIEU - mu_b) ** 2) - np.mean((DU_LIEU - mu_a) ** 2)
        assert np.isclose(d_nll, d_mse / (2 * sigma ** 2)), (
            f"sigma={sigma}: hiệu NLL là {d_nll}, cần bằng hiệu MSE / (2σ²) = {d_mse / (2 * sigma ** 2)}"
        )


def test_mle_bernoulli_la_diem_thap_nhat():
    y = np.array([1.0, 0, 1, 1, 0, 1, 1, 0, 1, 1])
    p_hat = mle_bernoulli(y)
    assert np.isclose(p_hat, 0.7), f"7 mặt ngửa trên 10 lần: cần 0.7, nhận {p_hat}"
    luoi = np.linspace(0.01, 0.99, 197)
    nll = np.array([nll_bernoulli(y, np.full(10, p)) for p in luoi])
    assert nll_bernoulli(y, np.full(10, p_hat)) <= nll.min() + 1e-12, (
        "p do bạn trả về phải cho NLL nhỏ hơn mọi điểm trên lưới; "
        f"tốt nhất trên lưới là p = {luoi[nll.argmin()]:.3f}"
    )


def test_mle_gauss_khop_cong_thuc_dong_va_toi_thieu_nll():
    mu_hat, var_hat = mle_gauss(DU_LIEU)
    assert np.isclose(mu_hat, 5.0), f"mu cần 5.0, nhận {mu_hat}"
    assert np.isclose(var_hat, 4.0), (
        f"var cần 4.0 (tổng bình phương 32 chia n = 8), nhận {var_hat}. "
        "Nếu ra 4.5714 là bạn đã chia cho n−1 — đó là ước lượng không chệch, không phải MLE."
    )
    sigma = np.sqrt(var_hat)
    for mu in (4.0, 4.9, 5.1, 6.0):
        assert nll_gauss(DU_LIEU, mu_hat, sigma) < nll_gauss(DU_LIEU, mu, sigma), f"mu = {mu} lại cho NLL thấp hơn"
    for s in (1.0, 1.9, 2.1, 4.0):
        assert nll_gauss(DU_LIEU, mu_hat, sigma) < nll_gauss(DU_LIEU, mu_hat, s), f"sigma = {s} lại cho NLL thấp hơn"


def test_mle_gauss_tren_du_lieu_ngau_nhien():
    rng = np.random.default_rng(7)
    y = rng.normal(3.0, 1.5, size=500)
    mu_hat, var_hat = mle_gauss(y)
    assert np.isclose(mu_hat, y.mean()) and np.isclose(var_hat, y.var()), (
        f"nhận ({mu_hat}, {var_hat}), cần ({y.mean()}, {y.var()})"
    )
