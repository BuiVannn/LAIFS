import numpy as np

X_CONG = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)


def test_du_doan_shape_va_nguong():
    X = np.array([[1.0, 3.0], [1.0, 0.5], [0.0, 0.0]])
    kq = du_doan(X, np.array([2.0, -1.0]), 0.5)
    assert np.shape(kq) == (3,), f"kết quả phải có shape (3,), nhận {np.shape(kq)}"
    # z = -0.5, 2.0, 0.5 ; z = 0 phải ra 1
    assert list(kq) == [0, 1, 1], f"cần [0, 1, 1], nhận {list(kq)}"
    assert list(du_doan(np.array([[1.0, 1.0]]), np.array([1.0, 1.0]), -2.0)) == [1], "z = 0 phải dự đoán 1 (quy ước z >= 0)"


def test_mot_epoch_cong_and():
    w, b = huan_luyen_perceptron(X_CONG, np.array([0, 0, 0, 1]), lr=1.0, so_epoch=1)
    assert np.allclose(w, [1, 1]) and np.isclose(b, 0), f"sau 1 epoch cần w = [1, 1], b = 0; nhận w = {w}, b = {b}. Nhớ khởi tạo bằng 0 và duyệt đúng thứ tự"


def test_hoc_duoc_and_va_or():
    for ten, y in (("AND", [0, 0, 0, 1]), ("OR", [0, 1, 1, 1])):
        w, b = huan_luyen_perceptron(X_CONG, np.array(y))
        assert list(du_doan(X_CONG, w, b)) == y, f"chưa học đúng cổng {ten}: dự đoán {list(du_doan(X_CONG, w, b))}"


def test_du_lieu_tach_duoc():
    rng = np.random.default_rng(0)
    X = rng.uniform(-3, 3, size=(60, 2))
    X = X[np.abs(X[:, 0] + 2 * X[:, 1] - 1) > 0.3]  # chừa khoảng hở quanh đường biên thật
    y = (X[:, 0] + 2 * X[:, 1] - 1 > 0).astype(int)
    w, b = huan_luyen_perceptron(X, y, lr=0.1, so_epoch=1000)
    so_sai = int(np.sum(du_doan(X, w, b) != y))
    assert so_sai == 0, f"dữ liệu tách được tuyến tính thì phải phân loại đúng hết, còn sai {so_sai} điểm"


def test_xor_khong_hoc_duoc():
    y = np.array([0, 1, 1, 0])
    w, b = huan_luyen_perceptron(X_CONG, y, so_epoch=50)
    assert np.sum(du_doan(X_CONG, w, b) != y) > 0, "XOR không tách được bằng đường thẳng, không thể đúng hết cả 4 điểm"
