import numpy as np


def test_du_doan_shape_va_gia_tri():
    X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
    y_hat = du_doan(X, np.array([0.5, -1.0]), 2.0)
    assert np.shape(y_hat) == (3,), f"ŷ cần shape (3,), nhận {np.shape(y_hat)}"
    assert np.allclose(y_hat, [0.5, -0.5, -1.5]), f"cần [0.5, -0.5, -1.5], nhận {y_hat}"


def test_vi_du_tinh_tay():
    w, b = nghiem_dong(np.array([[1.0], [2.0], [3.0]]), np.array([2.0, 2.0, 5.0]))
    assert np.shape(w) == (1,), f"w cần shape (1,), nhận {np.shape(w)}"
    assert np.allclose(w, [1.5]) and np.isclose(b, 0.0), f"cần w = [1.5], b = 0, nhận w = {w}, b = {b}"


def test_du_lieu_khong_nhieu():
    rng = np.random.default_rng(1)
    X = rng.normal(size=(50, 3))
    y = X @ np.array([2.0, -1.0, 0.5]) + 4.0
    w, b = nghiem_dong(X, y)
    assert np.allclose(w, [2.0, -1.0, 0.5]) and np.isclose(b, 4.0), \
        f"dữ liệu sinh từ w = [2, -1, 0.5], b = 4 nhưng nhận w = {w}, b = {b}"


def test_khop_voi_lstsq():
    rng = np.random.default_rng(2)
    X = rng.normal(size=(200, 4))
    y = X @ np.array([1.0, 0.0, -2.0, 3.0]) - 1.0 + rng.normal(0, 0.5, 200)
    w, b = nghiem_dong(X, y)
    Xb = np.hstack([X, np.ones((200, 1))])
    theta = np.linalg.lstsq(Xb, y, rcond=None)[0]
    assert np.allclose(w, theta[:-1]) and np.isclose(b, theta[-1]), \
        f"kết quả khác np.linalg.lstsq: cần w = {theta[:-1]}, b = {theta[-1]:.4f}"
    mse = np.mean((du_doan(X, w, b) - y) ** 2)
    assert mse <= np.mean((du_doan(X, w + 0.01, b) - y) ** 2), "MSE tại nghiệm phải nhỏ nhất"


def test_b_la_float():
    _, b = nghiem_dong(np.array([[0.0], [1.0]]), np.array([1.0, 3.0]))
    assert isinstance(b, float), f"b cần kiểu float, nhận {type(b).__name__}"
