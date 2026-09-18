import numpy as np


def test_vi_du_tinh_tay():
    X = np.array([[3.0, 4.0], [1.0, 0.0]])
    assert np.allclose(chuan_hang(X), [5.0, 1.0]), f"chuẩn phải là [5, 1], nhận {chuan_hang(X)}"
    assert np.allclose(chuan_hoa_hang(X), [[0.6, 0.8], [1.0, 0.0]]), \
        f"chuẩn hoá phải là [[0.6, 0.8], [1, 0]], nhận {chuan_hoa_hang(X)}"


def test_shape_khong_vuong():
    # Ma trận KHÔNG vuông: sai trục hay thiếu keepdims sẽ lộ ra ngay
    X = np.arange(12.0).reshape(3, 4) + 1
    assert np.shape(chuan_hang(X)) == (3,), f"chuan_hang cần shape (3,), nhận {np.shape(chuan_hang(X))}"
    assert np.shape(chuan_hoa_hang(X)) == (3, 4), \
        f"chuan_hoa_hang phải giữ nguyên shape (3, 4), nhận {np.shape(chuan_hoa_hang(X))}"


def test_gia_tri_khop_numpy():
    rng = np.random.default_rng(7)
    X = rng.normal(size=(5, 3)) + 4
    mong = np.linalg.norm(X, axis=1)
    assert np.allclose(chuan_hang(X), mong), \
        f"lệch với np.linalg.norm(X, axis=1):\n  của bạn: {np.round(chuan_hang(X), 5)}\n  đúng:    {np.round(mong, 5)}"


def test_moi_hang_dai_bang_1():
    rng = np.random.default_rng(11)
    X = rng.normal(size=(6, 9))
    Y = chuan_hoa_hang(X)
    dai = np.linalg.norm(Y, axis=1)
    assert np.allclose(dai, 1.0), f"sau chuẩn hoá, mọi hàng phải dài 1, nhận {np.round(dai, 5)}"
    # Chuẩn hoá chỉ đổi độ dài, KHÔNG đổi hướng
    assert np.allclose(Y * np.linalg.norm(X, axis=1, keepdims=True), X), \
        "hướng của mỗi hàng phải giữ nguyên: nhân lại với chuẩn cũ phải ra X"


def test_khong_sua_X_goc():
    X = np.array([[3.0, 4.0]])
    chuan_hoa_hang(X)
    assert np.allclose(X, [[3.0, 4.0]]), "hàm không được sửa mảng đầu vào (tránh sửa nhầm view)"
