import numpy as np


def test_mot_buoc_tinh_tay():
    # x = [1, 2], y = [2, 4]; từ w = b = 0: dw = 2*mean([-2, -8]) = -10, db = 2*mean([-2, -4]) = -6
    w, b = hoi_quy_gd(np.array([1.0, 2.0]), np.array([2.0, 4.0]), 0.1, 1)
    assert np.isclose(w, 1.0) and np.isclose(b, 0.6), f"sau 1 bước cần (1.0, 0.6), nhận ({w}, {b})"


def test_du_lieu_nam_tren_duong_thang():
    x = np.linspace(-1, 1, 20)
    y = 3 * x - 2
    w, b = hoi_quy_gd(x, y, 0.1, 2000)
    assert np.isclose(w, 3, atol=1e-3) and np.isclose(b, -2, atol=1e-3), f"cần (3, -2), nhận ({w}, {b})"


def test_du_lieu_co_nhieu():
    rng = np.random.default_rng(0)
    x = rng.uniform(-2, 2, 200)
    y = 1.5 * x + 0.5 + rng.normal(0, 0.1, 200)
    w, b = hoi_quy_gd(x, y, 0.05, 3000)
    w_dung, b_dung = np.polyfit(x, y, 1)
    assert np.isclose(w, w_dung, atol=1e-3) and np.isclose(b, b_dung, atol=1e-3), \
        f"cần gần ({w_dung:.4f}, {b_dung:.4f}), nhận ({w:.4f}, {b:.4f})"


def test_tra_ve_float():
    w, b = hoi_quy_gd(np.array([0.0, 1.0]), np.array([1.0, 2.0]), 0.1, 5)
    assert isinstance(w, float) and isinstance(b, float), "cần trả về float, không phải mảng numpy"
