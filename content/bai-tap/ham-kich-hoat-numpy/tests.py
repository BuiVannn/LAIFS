# dot-bien-bo-qua: đổi >= thành > — tại x = 0 hai nhánh sigmoid cho cùng 0.5
import numpy as np

X = np.array([-2.0, 0.0, 2.0, 5.0])


def test_sigmoid_gia_tri():
    kq = sigmoid(X)
    assert np.shape(kq) == (4,), f"shape phải giữ nguyên (4,), nhận {np.shape(kq)}"
    assert np.allclose(kq, [0.11920292, 0.5, 0.88079708, 0.99330715]), f"sigmoid sai: {kq}"
    assert np.allclose(dao_ham_sigmoid(X), [0.10499359, 0.25, 0.10499359, 0.00664806]), f"đạo hàm sigmoid sai: {dao_ham_sigmoid(X)}"


def test_sigmoid_on_dinh_so():
    with np.errstate(over="raise"):
        kq = sigmoid(np.array([-1000.0, -50.0, 50.0, 1000.0]))
    assert np.allclose(kq, [0.0, 0.0, 1.0, 1.0]), f"sigmoid với |x| lớn phải ≈ 0 hoặc 1, nhận {kq}"
    assert np.all(np.isfinite(kq)), "sigmoid không được ra nan/inf"


def test_sigmoid_giu_shape_ma_tran():
    Z = np.array([[-1.0, 0.0, 1.0], [3.0, -3.0, 0.5]])
    assert np.shape(sigmoid(Z)) == (2, 3), f"shape phải giữ nguyên (2, 3), nhận {np.shape(sigmoid(Z))}"
    assert np.allclose(sigmoid(Z), 1 / (1 + np.exp(-Z))), "sigmoid trên ma trận sai giá trị"


def test_tanh():
    assert np.allclose(tanh(X), [-0.96402758, 0.0, 0.96402758, 0.9999092]), f"tanh sai: {tanh(X)}"
    assert np.allclose(dao_ham_tanh(X), [0.07065082, 1.0, 0.07065082, 0.00018158]), f"đạo hàm tanh sai: {dao_ham_tanh(X)}"


def test_relu():
    assert np.allclose(relu(X), [0.0, 0.0, 2.0, 5.0]), f"ReLU sai: {relu(X)}"
    assert np.allclose(dao_ham_relu(X), [0.0, 0.0, 1.0, 1.0]), f"đạo hàm ReLU sai (tại 0 quy ước lấy 0): {dao_ham_relu(X)}"


def test_dao_ham_khop_dao_ham_so():
    x = np.array([-1.3, 0.4, 2.2])
    h = 1e-5
    for ten, f, df in (("sigmoid", sigmoid, dao_ham_sigmoid), ("tanh", tanh, dao_ham_tanh), ("relu", relu, dao_ham_relu)):
        xap_xi = (f(x + h) - f(x - h)) / (2 * h)
        assert np.allclose(df(x), xap_xi, atol=1e-6), f"đạo hàm {ten} không khớp với đạo hàm số: {df(x)} so với {xap_xi}"
