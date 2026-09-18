import numpy as np

# Bộ số dùng trong phần "tính tay" của bài học: Σxy = 28, Σx² = 14
X1 = np.array([[1.0], [2.0], [3.0]])
Y1 = np.array([2.0, 4.0, 6.0])


def test_mot_dac_trung_tinh_tay():
    for lam, mong_doi in ((0.0, 2.0), (6.0, 1.4), (14.0, 1.0), (42.0, 0.5)):
        w = ridge(X1, Y1, lam)
        assert np.isclose(w[0], mong_doi), f"λ = {lam} phải cho w = 28/(14 + λ) = {mong_doi}, nhận {w[0]}"


def test_lam_0_trung_voi_binh_phuong_toi_thieu():
    rng = np.random.default_rng(1)
    X = rng.normal(size=(30, 4))
    y = X @ np.array([1.0, -2.0, 0.5, 3.0]) + rng.normal(scale=0.1, size=30)
    w = ridge(X, y, 0.0)
    w_ols = np.linalg.lstsq(X, y, rcond=None)[0]
    assert np.allclose(w, w_ols, atol=1e-8), f"λ = 0 phải trùng nghiệm bình phương tối thiểu {w_ols}, nhận {w}"


def test_phat_lam_co_trong_so():
    rng = np.random.default_rng(2)
    X = rng.normal(size=(30, 4))
    y = X @ np.array([1.0, -2.0, 0.5, 3.0]) + rng.normal(scale=0.1, size=30)
    chuan = [float(np.linalg.norm(ridge(X, y, lam))) for lam in (0.0, 1.0, 10.0, 100.0)]
    assert all(a > b for a, b in zip(chuan, chuan[1:])), f"λ càng lớn thì ‖w‖ phải càng nhỏ, nhận {chuan}"
    assert all(abs(v) > 1e-9 for v in ridge(X, y, 100.0)), "L2 co trọng số về gần 0 nhưng KHÔNG đưa về đúng 0"


def test_dac_trung_cong_tuyen():
    # Hai cột gần trùng nhau: bình phương tối thiểu cho nghiệm điên rồ, ridge chia đều
    x1 = np.array([1.0, 2.0, 3.0, 4.0])
    X = np.column_stack([x1, x1 + 0.001])
    y = 3 * x1
    w0 = ridge(X, y, 0.0)
    w1 = ridge(X, y, 1.0)
    assert np.isclose(w1[0], w1[1], atol=0.01), f"ridge phải chia đều hai cột gần trùng, nhận {w1}"
    assert np.linalg.norm(w1) < np.linalg.norm(w0), f"‖w‖ của ridge phải nhỏ hơn của OLS: {w1} vs {w0}"


def test_kich_thuoc_dau_ra():
    w = ridge(np.ones((5, 3)), np.ones(5), 1.0)
    assert np.asarray(w).shape == (3,), f"w phải có shape (3,), nhận {np.asarray(w).shape}"
