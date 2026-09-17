import numpy as np

_W1 = np.array([[0.2, -0.1], [0.5, 0.25]])
_b1 = np.zeros(2)
_W2 = np.array([[1.0, -1.0]])
_b2 = np.array([0.5])


def test_sigmoid():
    z = np.array([0.0, 1.0, -1.0])
    ket_qua = sigmoid(z)
    assert np.allclose(ket_qua, [0.5, 0.7310586, 0.2689414]), f"sigmoid([0, 1, -1]) cần ≈ [0.5, 0.7311, 0.2689], nhận {ket_qua}"


def test_mang_mau_tinh_tay():
    Y_hat, cache = lan_truyen_xuoi(np.array([[1.0, 2.0]]), _W1, _b1, _W2, _b2)
    assert np.allclose(cache["Z1"], [[0.0, 1.0]]), f"Z1 cần [[0, 1]], nhận {cache['Z1']}"
    assert np.allclose(cache["H"], [[0.5, 0.7310586]]), f"H cần ≈ [[0.5, 0.7311]], nhận {cache['H']}"
    assert np.allclose(Y_hat, [[0.2689414]]), f"Y_hat cần ≈ [[0.2689]], nhận {Y_hat}"


def test_shape_ca_batch():
    rng = np.random.default_rng(1)
    X = rng.normal(size=(5, 3))
    Y_hat, cache = lan_truyen_xuoi(X, rng.normal(size=(4, 3)), rng.normal(size=4), rng.normal(size=(2, 4)), rng.normal(size=2))
    assert np.shape(cache["Z1"]) == (5, 4), f"Z1 cần shape (5, 4), nhận {np.shape(cache['Z1'])}"
    assert np.shape(cache["H"]) == (5, 4), f"H cần shape (5, 4), nhận {np.shape(cache['H'])}"
    assert np.shape(Y_hat) == (5, 2), f"Y_hat cần shape (5, 2), nhận {np.shape(Y_hat)}"
    assert cache["X"] is X, "cache['X'] cần là chính X"


def test_moi_hang_la_mot_mau():
    # Tính cả batch phải giống hệt tính riêng từng mẫu
    rng = np.random.default_rng(2)
    X = rng.normal(size=(6, 3))
    W1, b1, W2, b2 = rng.normal(size=(4, 3)), rng.normal(size=4), rng.normal(size=(2, 4)), rng.normal(size=2)
    Y_hat, _ = lan_truyen_xuoi(X, W1, b1, W2, b2)
    for i in range(len(X)):
        h = 1 / (1 + np.exp(-(W1 @ X[i] + b1)))
        dung = W2 @ h + b2
        assert np.allclose(Y_hat[i], dung), f"mẫu thứ {i}: cần {dung}, nhận {Y_hat[i]} (kiểm tra lại chuyển vị W.T và cách cộng bias)"
