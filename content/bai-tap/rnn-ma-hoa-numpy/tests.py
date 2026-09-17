import numpy as np

Wh2 = 0.9 * np.eye(2)
Wx2 = np.eye(2)
b2 = np.zeros(2)
X_CON_MEO_DEN = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])


def test_mot_buoc_rnn():
    h = buoc_rnn(np.zeros(2), np.array([1.0, 0.0]), Wh2, Wx2, b2)
    assert np.shape(h) == (2,), f"h mới phải có shape (2,), nhận {np.shape(h)}"
    assert np.allclose(h, [np.tanh(1.0), 0.0]), f"h0 = 0, x = [1, 0] thì h1 = tanh([1, 0]), nhận {h}"


def test_buoc_rnn_dung_ca_Wh_Wx_va_b():
    Wh = np.array([[0.5, -0.2], [0.1, 0.3]])
    Wx = np.array([[1.0, 0.0, -0.5], [0.0, 2.0, 0.25]])
    b = np.array([0.1, -0.2])
    h = np.array([0.3, -0.4])
    x = np.array([1.0, 0.5, 2.0])
    assert np.allclose(buoc_rnn(h, x, Wh, Wx, b), np.tanh(Wh @ h + Wx @ x + b)), (
        "công thức phải là tanh(Wh @ h + Wx @ x + b) — kiểm tra lại có quên b hoặc đảo Wh/Wx không"
    )


def test_vi_du_trong_de():
    H, c = ma_hoa(X_CON_MEO_DEN, Wh2, Wx2, b2)
    assert np.shape(H) == (3, 2), f"H phải có shape (3, 2) — không chứa h0, nhận {np.shape(H)}"
    mong_doi = [[0.7615942, 0.0], [0.5950412, 0.7615942], [0.9113674, 0.9335633]]
    assert np.allclose(H, mong_doi, atol=1e-6), f"H = {H}, cần {np.array(mong_doi)}"
    assert np.allclose(c, [0.9113674, 0.9335633], atol=1e-6), f"c = {c}"


def test_c_luon_la_trang_thai_cuoi():
    rng = np.random.default_rng(0)
    X = rng.normal(size=(7, 3))
    Wh = 0.5 * np.eye(4)
    Wx = rng.normal(size=(4, 3))
    b = rng.normal(size=4)
    H, c = ma_hoa(X, Wh, Wx, b)
    assert np.shape(H) == (7, 4), f"H phải có shape (7, 4), nhận {np.shape(H)}"
    assert np.shape(c) == (4,), f"c phải có shape (4,), nhận {np.shape(c)}"
    assert np.allclose(c, H[-1]), "vector ngữ cảnh c phải đúng bằng hàng cuối của H"


def test_shape_cua_c_khong_doi_theo_do_dai_cau():
    Wh = 0.9 * np.eye(5)
    Wx = np.ones((5, 2))
    b = np.zeros(5)
    for T in (1, 4, 30):
        _, c = ma_hoa(np.ones((T, 2)), Wh, Wx, b)
        assert np.shape(c) == (5,), f"câu {T} từ: c phải vẫn có shape (5,), nhận {np.shape(c)}"


def test_moi_buoc_deu_dung_trang_thai_truoc_do():
    # Nếu quên truyền h cũ vào bước sau, hai từ giống nhau sẽ cho hai trạng thái giống nhau
    X = np.array([[1.0, 0.0], [1.0, 0.0]])
    H, _ = ma_hoa(X, Wh2, Wx2, b2)
    assert not np.allclose(H[0], H[1]), "h2 phải khác h1 vì h2 = tanh(0.9·h1 + x) — có thể bạn quên dùng lại h"
