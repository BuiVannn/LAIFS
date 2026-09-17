import numpy as np


def test_vi_du_trong_de():
    f = lambda v: v[0] ** 2 + 3 * v[1] ** 2
    g = gradient_so(f, np.array([1.0, 2.0]))
    assert np.shape(g) == (2,), f"gradient phải có shape (2,), nhận {np.shape(g)}"
    assert np.allclose(g, [2.0, 12.0], atol=1e-5), f"cần ≈ [2, 12], nhận {g}"


def test_bien_khac_la_hang_so():
    # g(x, y) = x²y + y: ∂g/∂x = 2xy = 4, ∂g/∂y = x² + 1 = 2 tại (1, 2)
    f = lambda v: v[0] ** 2 * v[1] + v[1]
    g = gradient_so(f, np.array([1.0, 2.0]))
    assert np.allclose(g, [4.0, 2.0], atol=1e-5), f"cần ≈ [4, 2], nhận {g}"


def test_ma_tran_cung_shape():
    # f(W) = tổng bình phương mọi phần tử → gradient = 2W
    W = np.arange(6, dtype=float).reshape(2, 3)
    g = gradient_so(lambda M: np.sum(M ** 2), W)
    assert np.shape(g) == (2, 3), f"W shape (2, 3) thì gradient cũng phải (2, 3), nhận {np.shape(g)}"
    assert np.allclose(g, 2 * W, atol=1e-4), f"cần ≈ 2W = {2 * W}, nhận {g}"


def test_khong_sua_dau_vao():
    x = np.array([1.0, -2.0, 0.5])
    ban_sao = x.copy()
    gradient_so(lambda v: np.sum(v ** 3), x)
    assert np.array_equal(x, ban_sao), f"mảng x bị thay đổi: {ban_sao} → {x}"


def test_ham_tuyen_tinh():
    a = np.array([3.0, 4.0, -1.0])
    g = gradient_so(lambda v: a @ v, np.zeros(3))
    assert np.allclose(g, a, atol=1e-6), f"gradient của a·x phải bằng a = {a}, nhận {g}"
