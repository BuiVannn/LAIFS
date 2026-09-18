import numpy as np


def _xuoi(X, gamma, beta, eps=1e-5):
    mu = X.mean(axis=0)
    var = X.var(axis=0)
    return gamma * (X - mu) / np.sqrt(var + eps) + beta


def test_khop_bang_tinh_tay():
    X = np.array([[1.], [3.], [4.], [5.], [7.]])
    dY = np.array([[1.], [0.], [0.], [0.], [0.]])
    dX, dgamma, dbeta = batch_norm_nguoc(dY, X, np.array([2.]))
    assert np.allclose(dbeta, [1.]), f"dbeta cần [1], nhận {dbeta}"
    assert np.allclose(dgamma, [-1.5], atol=1e-4), f"dgamma cần [-1.5], nhận {dgamma}"
    can = np.array([[0.35], [-0.35], [-0.2], [-0.05], [0.25]])
    assert np.allclose(dX, can, atol=1e-4), f"dX cần\n{can.ravel()}\nnhận\n{np.asarray(dX).ravel()}"


def test_shape_giong_tham_so():
    rng = np.random.default_rng(11)
    X, dY, gamma = rng.normal(size=(9, 4)), rng.normal(size=(9, 4)), rng.normal(size=4)
    dX, dgamma, dbeta = batch_norm_nguoc(dY, X, gamma)
    assert np.shape(dX) == (9, 4), f"dX cần shape (9, 4), nhận {np.shape(dX)}"
    assert np.shape(dgamma) == (4,), f"dgamma cần shape (4,) giống gamma, nhận {np.shape(dgamma)}"
    assert np.shape(dbeta) == (4,), f"dbeta cần shape (4,) giống beta, nhận {np.shape(dbeta)}"


def test_hai_bat_bien_bang_khong():
    rng = np.random.default_rng(12)
    X, dY, gamma = rng.normal(size=(8, 3)) * 5 + 2, rng.normal(size=(8, 3)), rng.normal(size=3)
    dX, _, _ = batch_norm_nguoc(dY, X, gamma)
    xhat = (X - X.mean(axis=0)) / np.sqrt(X.var(axis=0) + 1e-5)
    assert np.allclose(np.sum(dX, axis=0), 0, atol=1e-8), \
        f"tổng dX theo batch phải bằng 0, nhận {np.sum(dX, axis=0)}"
    assert np.allclose(np.sum(dX * xhat, axis=0), 0, atol=1e-6), \
        f"tổng dX·x̂ theo batch phải bằng 0, nhận {np.sum(dX * xhat, axis=0)}"


def test_dX_khop_gradient_so():
    rng = np.random.default_rng(13)
    gamma, beta = rng.normal(size=3), rng.normal(size=3)
    R = rng.normal(size=(6, 3))
    X0 = rng.normal(size=(6, 3)) * 2 + 1
    dat, chenh = kiem_tra_gradient(
        lambda Xv: float(np.sum(R * _xuoi(Xv, gamma, beta))),
        lambda Xv: batch_norm_nguoc(R, Xv, gamma)[0],
        X0,
    )
    assert dat, f"dX lệch với gradient số, chênh lệch tương đối {chenh:.2e}"


def test_dgamma_khop_gradient_so():
    rng = np.random.default_rng(14)
    beta = rng.normal(size=3)
    R = rng.normal(size=(6, 3))
    X = rng.normal(size=(6, 3)) * 2 + 1
    dat, chenh = kiem_tra_gradient(
        lambda gv: float(np.sum(R * _xuoi(X, gv, beta))),
        lambda gv: batch_norm_nguoc(R, X, gv)[1],
        rng.normal(size=3),
    )
    assert dat, f"dgamma lệch với gradient số, chênh lệch tương đối {chenh:.2e}"


def test_dbeta_khop_gradient_so():
    rng = np.random.default_rng(15)
    gamma = rng.normal(size=3)
    R = rng.normal(size=(6, 3))
    X = rng.normal(size=(6, 3))
    dat, chenh = kiem_tra_gradient(
        lambda bv: float(np.sum(R * _xuoi(X, gamma, bv))),
        lambda bv: batch_norm_nguoc(R, X, gamma)[2],
        rng.normal(size=3),
    )
    assert dat, f"dbeta lệch với gradient số, chênh lệch tương đối {chenh:.2e}"


def test_khong_phu_thuoc_dau_vao_mot_mau_rieng_le():
    # Gradient của MẪU 2 phải khác 0 dù dY chỉ chạm mẫu 1: mu và sigma phụ thuộc mọi mẫu
    X = np.array([[1., 9.], [3., 9.], [4., 9.], [5., 9.], [7., 9.]])
    dY = np.zeros((5, 2))
    dY[0, 0] = 1.0
    dX, _, _ = batch_norm_nguoc(dY, X, np.array([2., 1.]))
    assert abs(dX[1, 0]) > 1e-6, \
        f"mẫu 2 phải nhận gradient khác 0 (qua mu và sigma), nhận {dX[1, 0]}"
    assert np.allclose(dX[:, 1], 0, atol=1e-8), \
        f"cột 2 không nhận gradient nào nên dX cột 2 phải bằng 0, nhận {dX[:, 1]}"
