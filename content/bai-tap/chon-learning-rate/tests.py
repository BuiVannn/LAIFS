import numpy as np


def loss_tron(w):
    return np.sum(w ** 2)


def grad_tron(w):
    return 2 * w


def test_vi_du_trong_de():
    w0 = np.array([3.0, -4.0])
    lr, loss = chon_learning_rate(loss_tron, grad_tron, w0, [0.01, 0.1, 1.5], 20)
    assert lr == 0.1, f"learning rate tốt nhất cần là 0.1, nhận {lr}"
    assert set(loss) == {0.01, 0.1, 1.5}, f"loss_cuoi cần đủ 3 khoá, nhận {sorted(loss)}"
    assert np.isclose(loss[0.01], 25 * 0.98 ** 40), f"loss[0.01] cần ≈ 11.14, nhận {loss[0.01]}"
    assert loss[1.5] > 1e6, f"lr = 1.5 phải phân kỳ (loss rất lớn), nhận {loss[1.5]}"


def test_khong_sua_w0():
    w0 = np.array([1.0, 1.0])
    chon_learning_rate(loss_tron, grad_tron, w0, [0.1, 0.3], 5)
    assert np.allclose(w0, [1.0, 1.0]), f"w0 bị sửa thành {w0}; mỗi lr phải xuất phát lại từ w0"


def test_phan_ky_thanh_inf():
    lr, loss = chon_learning_rate(loss_tron, grad_tron, np.array([1.0]), [0.2, 10.0], 1000)
    assert lr == 0.2, f"cần chọn 0.2, nhận {lr}"
    assert loss[10.0] == np.inf, f"loss phân kỳ (nan/inf) cần ghi là np.inf, nhận {loss[10.0]}"


def test_thung_lung_hep():
    # L = w1² + 10·w2²: hướng w2 dốc gấp 10 nên lr phải < 0.1
    loss = lambda w: w[0] ** 2 + 10 * w[1] ** 2
    grad = lambda w: np.array([2 * w[0], 20 * w[1]])
    lr, ds = chon_learning_rate(loss, grad, np.array([1.0, 1.0]), [0.01, 0.05, 0.09, 0.11], 50)
    assert lr == 0.09, f"cần chọn 0.09 (0.11 vượt ngưỡng 0.1 nên phân kỳ), nhận {lr}"
    assert ds[0.11] > ds[0.01], "lr = 0.11 phải cho loss tệ hơn lr = 0.01"
