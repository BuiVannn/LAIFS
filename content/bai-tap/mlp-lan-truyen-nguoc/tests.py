import numpy as np


def _loss(X, Y, W1, b1, W2, b2):
    # Lượt xuôi tham chiếu, độc lập với code của người học
    H = 1 / (1 + np.exp(-(X @ W1.T + b1)))
    return np.sum((H @ W2.T + b2 - Y) ** 2) / X.shape[0]


def _gradient_so(X, Y, tham_so, eps=1e-6):
    ket_qua = []
    for p in tham_so:
        g = np.zeros_like(p)
        for i in np.ndindex(p.shape):
            goc = p[i]
            p[i] = goc + eps
            L_cong = _loss(X, Y, *tham_so)
            p[i] = goc - eps
            L_tru = _loss(X, Y, *tham_so)
            p[i] = goc
            g[i] = (L_cong - L_tru) / (2 * eps)
        ket_qua.append(g)
    return ket_qua


def test_mang_mau_tinh_tay():
    W1 = np.array([[0.2, -0.1], [0.5, 0.25]])
    g = lan_truyen_nguoc(np.array([[1.0, 2.0]]), np.array([[1.0]]), W1, np.zeros(2), np.array([[1.0, -1.0]]), np.array([0.5]))
    assert np.allclose(g["db2"], [-1.4621172]), f"db2 cần ≈ [-1.4621], nhận {g['db2']}"
    assert np.allclose(g["dW2"], [[-0.7310586, -1.0688933]]), f"dW2 cần ≈ [[-0.7311, -1.0689]], nhận {g['dW2']}"
    assert np.allclose(g["db1"], [-0.3655293, 0.2874697]), f"db1 cần ≈ [-0.3655, 0.2875], nhận {g['db1']}"
    assert np.allclose(g["dW1"], [[-0.3655293, -0.7310586], [0.2874697, 0.5749394]]), \
        f"dW1 cần ≈ [[-0.3655, -0.7311], [0.2875, 0.5749]], nhận {g['dW1']}"


def test_shape_gradient_bang_shape_tham_so():
    rng = np.random.default_rng(3)
    W1, b1, W2, b2 = rng.normal(size=(5, 3)), rng.normal(size=5), rng.normal(size=(2, 5)), rng.normal(size=2)
    g = lan_truyen_nguoc(rng.normal(size=(7, 3)), rng.normal(size=(7, 2)), W1, b1, W2, b2)
    for ten, p in (("dW1", W1), ("db1", b1), ("dW2", W2), ("db2", b2)):
        assert np.shape(g[ten]) == p.shape, f"{ten} cần shape {p.shape} giống tham số, nhận {np.shape(g[ten])}"


def test_khop_gradient_so():
    rng = np.random.default_rng(4)
    X, Y = rng.normal(size=(4, 3)), rng.normal(size=(4, 2))
    tham_so = [rng.normal(size=(5, 3)), rng.normal(size=5), rng.normal(size=(2, 5)), rng.normal(size=2)]
    g = lan_truyen_nguoc(X, Y, *[p.copy() for p in tham_so])
    so = _gradient_so(X, Y, tham_so)
    for ten, g_so in zip(("dW1", "db1", "dW2", "db2"), so):
        assert np.allclose(g[ten], g_so, atol=1e-5), \
            f"{ten} lệch với gradient số:\n  backprop: {np.round(g[ten], 5)}\n  gradient số: {np.round(g_so, 5)}"


def test_mot_buoc_gd_lam_giam_loss():
    rng = np.random.default_rng(5)
    X, Y = rng.normal(size=(8, 3)), rng.normal(size=(8, 1))
    W1, b1, W2, b2 = rng.normal(size=(4, 3)), np.zeros(4), rng.normal(size=(1, 4)), np.zeros(1)
    truoc = _loss(X, Y, W1, b1, W2, b2)
    g = lan_truyen_nguoc(X, Y, W1, b1, W2, b2)
    sau = _loss(X, Y, W1 - 0.01 * g["dW1"], b1 - 0.01 * g["db1"], W2 - 0.01 * g["dW2"], b2 - 0.01 * g["db2"])
    assert sau < truoc, f"đi ngược gradient một bước nhỏ phải làm loss giảm: trước {truoc:.5f}, sau {sau:.5f}"
