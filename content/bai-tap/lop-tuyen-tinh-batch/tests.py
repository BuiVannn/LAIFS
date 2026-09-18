import numpy as np


def test_vi_du_tinh_tay():
    X = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    W = np.array([[1.0, 0.0, -1.0], [0.5, 0.5, 0.5]])
    b = np.array([1.0, -1.0])
    Z = lop_tuyen_tinh(X, W, b)
    assert np.shape(Z) == (2, 2), f"cần shape (2, 2), nhận {np.shape(Z)}"
    assert np.allclose(Z, [[-1.0, 2.0], [-1.0, 6.5]]), f"cần [[-1, 2], [-1, 6.5]], nhận {Z}"


def test_shape_khac_nhau_moi_chieu():
    # d_vao = 7, d_ra = 3, n = 5: ba số khác nhau nên sai .T hay sai thứ tự đều lộ ra
    rng = np.random.default_rng(0)
    X, W, b = rng.normal(size=(5, 7)), rng.normal(size=(3, 7)), rng.normal(size=3)
    Z = lop_tuyen_tinh(X, W, b)
    assert np.shape(Z) == (5, 3), f"(5, 7) với W (3, 7) phải ra (5, 3), nhận {np.shape(Z)}"
    assert np.allclose(Z, X @ W.T + b), "giá trị lệch với X @ W.T + b"


def test_tung_mau_doc_lap():
    # Hàng thứ i của kết quả chỉ được phụ thuộc hàng thứ i của X
    rng = np.random.default_rng(3)
    X, W, b = rng.normal(size=(6, 4)), rng.normal(size=(2, 4)), rng.normal(size=2)
    Z = lop_tuyen_tinh(X, W, b)
    for i in range(6):
        rieng = lop_tuyen_tinh(X[i:i + 1], W, b)
        assert np.allclose(Z[i], rieng[0]), f"mẫu {i} chạy riêng phải cho cùng kết quả như khi chạy cả batch"


def test_bias_cong_vao_tung_hang():
    X = np.zeros((4, 3))
    W = np.zeros((2, 3))
    b = np.array([7.0, -2.0])
    Z = lop_tuyen_tinh(X, W, b)
    assert np.allclose(Z, np.tile(b, (4, 1))), \
        f"với X = 0 và W = 0, mỗi hàng phải đúng bằng b = {b}, nhận {Z}"


def test_mlp_xuoi_relu_giua_cac_lop():
    rng = np.random.default_rng(9)
    tham_so = [(rng.normal(size=(5, 3)), rng.normal(size=5)),
               (rng.normal(size=(4, 5)), rng.normal(size=4)),
               (rng.normal(size=(2, 4)), rng.normal(size=2))]
    X = rng.normal(size=(6, 3))
    Y = mlp_xuoi(X, tham_so)
    assert np.shape(Y) == (6, 2), f"cần shape (6, 2), nhận {np.shape(Y)}"
    H = np.maximum(0, X @ tham_so[0][0].T + tham_so[0][1])
    H = np.maximum(0, H @ tham_so[1][0].T + tham_so[1][1])
    mong = H @ tham_so[2][0].T + tham_so[2][1]
    assert np.allclose(Y, mong), f"lệch với tham chiếu:\n  của bạn: {np.round(Y, 5)}\n  đúng:    {np.round(mong, 5)}"


def test_lop_cuoi_khong_relu():
    # Một lớp duy nhất: không được ReLU, nên số âm phải giữ nguyên
    W = np.array([[-1.0]])
    Y = mlp_xuoi(np.array([[2.0]]), [(W, np.zeros(1))])
    assert np.allclose(Y, [[-2.0]]), f"lớp cuối KHÔNG kích hoạt, cần [[-2]], nhận {Y}"


def test_relu_that_su_duoc_dung():
    # Hai lớp, chọn số sao cho có ReLU và không ReLU cho kết quả khác nhau
    W1, b1 = np.array([[1.0], [-1.0]]), np.zeros(2)
    W2, b2 = np.array([[1.0, 1.0]]), np.zeros(1)
    Y = mlp_xuoi(np.array([[3.0]]), [(W1, b1), (W2, b2)])
    assert np.allclose(Y, [[3.0]]), \
        f"lớp ẩn cho (3, -3), ReLU thành (3, 0), cộng lại được 3. Nhận {Y} (nếu là 0 thì bạn quên ReLU)"
