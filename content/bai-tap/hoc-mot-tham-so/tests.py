import numpy as np

X = np.array([1.0, 2.0, 3.0, 4.0])
Y = np.array([2.1, 3.9, 6.2, 7.8])


def test_du_doan():
    assert np.allclose(du_doan(2.0, X), [2.0, 4.0, 6.0, 8.0]), f"du_doan(2, x) cần [2,4,6,8], nhận {du_doan(2.0, X)}"
    assert np.isclose(du_doan(1.99, 5.0), 9.95), "du_doan phải chạy được với x là một số"


def test_mat_mat_vi_du_trong_de():
    assert np.isclose(mat_mat(1.99, X, Y), 0.02425), f"mat_mat(1.99) cần 0.02425, nhận {mat_mat(1.99, X, Y)}"
    assert np.isclose(mat_mat(2.10, X, Y), 0.1150), f"mat_mat(2.10) cần 0.1150, nhận {mat_mat(2.10, X, Y)}"
    assert np.isclose(mat_mat(1.90, X, Y), 0.0850), f"mat_mat(1.90) cần 0.0850, nhận {mat_mat(1.90, X, Y)}"


def test_mat_mat_la_trung_binh_khong_phai_tong():
    x, y = np.array([1.0, 1.0, 1.0, 1.0]), np.array([0.0, 0.0, 0.0, 0.0])
    assert np.isclose(mat_mat(2.0, x, y), 4.0), f"MSE là TRUNG BÌNH bình phương sai số, cần 4.0, nhận {mat_mat(2.0, x, y)}"


def test_mat_mat_khong_triet_tieu_dau():
    x, y = np.array([1.0, 1.0]), np.array([3.0, -1.0])
    assert np.isclose(mat_mat(1.0, x, y), 4.0), f"sai số [-2, +2] phải cho MSE = 4, nhận {mat_mat(1.0, x, y)}"


def test_hoc_vi_du_trong_de():
    assert np.isclose(hoc(X, Y), 1.99), f"hoc(x, y) cần 1.99 (= 59.7/30), nhận {hoc(X, Y)}"


def test_hoc_du_lieu_khong_nhieu():
    x = np.array([1.0, 2.0, 3.0])
    assert np.isclose(hoc(x, 3.0 * x), 3.0), "dữ liệu khớp hoàn hảo y = 3x thì phải học ra w = 3"
    assert np.isclose(mat_mat(hoc(x, 3.0 * x), x, 3.0 * x), 0.0), "khớp hoàn hảo thì loss phải bằng 0"


def test_hoc_cho_loss_nho_nhat():
    w = hoc(X, Y)
    for khac in (w - 0.3, w - 0.05, w + 0.05, w + 0.3):
        assert mat_mat(w, X, Y) < mat_mat(khac, X, Y), f"w = {w} phải cho loss nhỏ hơn w = {khac}"


def test_tra_ve_float():
    assert isinstance(hoc(X, Y), float), "hoc cần trả về float"
    assert isinstance(mat_mat(1.99, X, Y), float), "mat_mat cần trả về float"
