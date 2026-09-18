import numpy as np

A = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
B = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])


def test_tich_vo_huong():
    assert np.isclose(tich_vo_huong(np.array([1.0, 2, 3]), np.array([4.0, 0, -1])), 1.0), \
        "(1,2,3)·(4,0,-1) = 4 + 0 - 3 = 1"
    assert np.ndim(tich_vo_huong(np.array([1.0, 2]), np.array([3.0, 4]))) == 0, \
        "tích vô hướng phải trả về MỘT SỐ, không phải mảng"


def test_vi_du_tinh_tay():
    C = nhan(A, B)
    assert np.shape(C) == (2, 2), f"cần shape (2, 2), nhận {np.shape(C)}"
    assert np.allclose(C, [[4.0, 5.0], [10.0, 11.0]]), f"cần [[4, 5], [10, 11]], nhận {C}"


def test_shape_chu_nhat_va_khop_numpy():
    rng = np.random.default_rng(1)
    for m, n, p in ((4, 3, 5), (1, 6, 2), (7, 2, 1)):
        X, Y = rng.normal(size=(m, n)), rng.normal(size=(n, p))
        C = nhan(X, Y)
        assert np.shape(C) == (m, p), f"({m},{n}) @ ({n},{p}) phải ra ({m},{p}), nhận {np.shape(C)}"
        assert np.allclose(C, X @ Y), f"giá trị lệch với X @ Y ở shape ({m},{n})x({n},{p})"


def test_bao_loi_khi_chieu_khong_khop():
    try:
        nhan(np.zeros((2, 3)), np.zeros((4, 5)))
    except ValueError:
        return
    except Exception as e:
        raise AssertionError(f"cần ValueError, nhận {type(e).__name__}")
    raise AssertionError("chiều trong không khớp (3 != 4) thì phải raise ValueError")


def test_to_hop_cot_khop_voi_nhan():
    rng = np.random.default_rng(5)
    X, Y = rng.normal(size=(4, 3)), rng.normal(size=(3, 5))
    C = nhan(X, Y)
    for j in range(5):
        cot = cot_ket_qua(X, Y, j)
        assert np.shape(cot) == (4,), f"cot_ket_qua cần shape (4,), nhận {np.shape(cot)}"
        assert np.allclose(cot, C[:, j]), \
            f"cột {j} theo tổ hợp cột phải bằng cột {j} của tích:\n  {np.round(cot, 5)}\n  {np.round(C[:, j], 5)}"
    assert np.allclose(cot_ket_qua(A, B, 0), [4.0, 10.0]), "cot_ket_qua(A, B, 0) phải là [4, 10]"


def test_tu_viet_vong_lap():
    import dis
    for ten in ("tich_vo_huong", "nhan", "cot_ket_qua"):
        f = globals()[ten]
        assert not any(i.argrepr == "@" for i in dis.get_instructions(f)), \
            f"{ten}: bài này yêu cầu tự viết vòng lặp, đừng dùng toán tử @"
        goi = set(f.__code__.co_names)
        assert not goi & {"dot", "matmul", "einsum"}, \
            f"{ten}: đừng gọi np.dot/np.matmul/np.einsum, hãy tự cộng dồn"

