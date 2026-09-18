import numpy as np

# Với X = I và n = 2, gradient rút gọn thành (w − y): bài toán tách rời từng toạ độ,
# nên kết quả đúng bằng ngưỡng mềm trong phần "tính tay" của bài học.
I2 = np.eye(2)
Y2 = np.array([0.8, 0.4])


def test_nguong_mem_mot_buoc():
    w = lasso_ista(I2, Y2, 0.5, 1.0, 1)
    assert np.allclose(w, [0.3, 0.0]), f"cần [0.3, 0.0] (0.8 bị xén còn 0.3; 0.4 < ngưỡng 0.5 nên về 0), nhận {w}"
    assert w[1] == 0.0, "hệ số nhỏ phải bằng ĐÚNG 0, không phải xấp xỉ"


def test_hoi_tu_van_giu_nguyen():
    w = lasso_ista(I2, Y2, 0.5, 1.0, 200)
    assert np.allclose(w, [0.3, 0.0]), f"đã ở nghiệm thì chạy thêm 199 bước nữa vẫn phải là [0.3, 0.0], nhận {w}"


def test_learning_rate_nho_hai_buoc():
    w = lasso_ista(I2, Y2, 0.5, 0.25, 2)
    assert np.allclose(w, [0.13125, 0.0]), f"η = 0.25, 2 bước phải cho [0.13125, 0.0], nhận {w}"


def test_lam_0_la_gradient_descent_thuong():
    w = lasso_ista(I2, Y2, 0.0, 1.0, 1)
    assert np.allclose(w, Y2), f"λ = 0 thì không xén gì cả, phải cho {Y2}, nhận {w}"


def test_thua_hoa_bai_toan_that():
    rng = np.random.default_rng(5)
    X = rng.normal(size=(80, 8))
    X /= np.linalg.norm(X, axis=0) / np.sqrt(80)
    y = X @ np.array([2.5, 0, 0, -1.8, 0, 0, 0, 0]) + rng.normal(scale=0.2, size=80)
    w0 = lasso_ista(X, y, 0.0, 0.2, 4000)
    assert (w0 == 0).sum() == 0, f"λ = 0 thì không hệ số nào bằng 0, nhận {(w0 == 0).sum()}"
    w = lasso_ista(X, y, 0.3, 0.2, 4000)
    assert (w == 0).sum() == 6, f"λ = 0.3 phải đưa đúng 6/8 hệ số về 0, nhận {(w == 0).sum()} — w = {np.round(w, 3)}"
    assert abs(w[0]) > 2 and abs(w[3]) > 1, f"hai đặc trưng THẬT (số 0 và 3) phải sống sót, nhận {np.round(w, 3)}"
