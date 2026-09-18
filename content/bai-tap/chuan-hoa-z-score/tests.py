import numpy as np


def test_vi_du_tinh_tay():
    X = np.array([[2.0], [4], [4], [4], [5], [5], [7], [9]])
    mu, sigma = hoc_thong_ke(X)
    assert np.allclose(mu, [5.0]), f"mu cần [5], nhận {mu}"
    assert np.allclose(sigma, [2.0]), f"sigma cần [2], nhận {sigma}"
    z = ap_dung(X, mu, sigma)
    assert np.allclose(z.ravel(), [-1.5, -0.5, -0.5, -0.5, 0, 0, 1, 2]), \
        f"z cần [-1.5, -0.5, -0.5, -0.5, 0, 0, 1, 2], nhận {z.ravel()}"


def test_shape_va_thong_ke_theo_cot():
    # (6, 4) không vuông: sai trục là lộ ra ngay
    rng = np.random.default_rng(0)
    X = rng.normal(loc=[0.0, 10, -3, 100], scale=[1.0, 5, 0.1, 20], size=(6, 4))
    mu, sigma = hoc_thong_ke(X)
    assert np.shape(mu) == (4,), f"mu cần shape (4,) — một số cho mỗi ĐẶC TRƯNG, nhận {np.shape(mu)}"
    assert np.shape(sigma) == (4,), f"sigma cần shape (4,), nhận {np.shape(sigma)}"
    assert np.allclose(mu, X.mean(axis=0)) and np.allclose(sigma, X.std(axis=0)), \
        "mu/sigma phải tính theo cột (axis=0), không phải theo hàng"


def test_sau_chuan_hoa_mean_0_std_1():
    rng = np.random.default_rng(1)
    X = rng.normal(loc=[5.0, -20, 0.01], scale=[3.0, 0.5, 7], size=(200, 3))
    Z = ap_dung(X, *hoc_thong_ke(X))
    assert np.shape(Z) == (200, 3), f"phải giữ nguyên shape (200, 3), nhận {np.shape(Z)}"
    assert np.allclose(Z.mean(axis=0), 0, atol=1e-10), f"mỗi cột phải có trung bình 0, nhận {Z.mean(axis=0)}"
    assert np.allclose(Z.std(axis=0), 1), f"mỗi cột phải có độ lệch chuẩn 1, nhận {Z.std(axis=0)}"


def test_khong_tinh_lai_tren_tap_test():
    rng = np.random.default_rng(2)
    X_train = rng.normal(loc=0.0, scale=1.0, size=(100, 2))
    X_test = rng.normal(loc=8.0, scale=3.0, size=(40, 2))   # phân phối KHÁC hẳn train
    mu, sigma = hoc_thong_ke(X_train)
    Z = ap_dung(X_test, mu, sigma)
    assert not np.allclose(Z.mean(axis=0), 0, atol=0.5), (
        "tập test lệch hẳn khỏi train nên sau khi chuẩn hoá bằng thống kê của TRAIN, trung bình của nó "
        f"phải KHÁC 0 rõ rệt. Nhận {Z.mean(axis=0)} — có vẻ bạn đang tính lại mu/sigma bên trong ap_dung."
    )
    assert np.allclose(Z, (X_test - mu) / sigma), "ap_dung chỉ được dùng đúng mu, sigma được truyền vào"


def test_chay_duoc_voi_mot_mau_don():
    mu, sigma = np.array([5.0, 1.0]), np.array([2.0, 4.0])
    z = ap_dung(np.array([[9.0, 5.0]]), mu, sigma)
    assert np.shape(z) == (1, 2), f"một mẫu đơn phải ra shape (1, 2), nhận {np.shape(z)}"
    assert np.allclose(z, [[2.0, 1.0]]), f"cần [[2, 1]], nhận {z}"
