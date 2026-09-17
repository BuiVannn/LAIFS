import numpy as np

Y = np.array([3.0, 5.0, 4.0, 8.0])
Y_HAT = np.array([2.5, 5.5, 4.0, 6.0])


def test_vi_du_trong_de():
    assert np.isclose(mse(Y, Y_HAT), 1.125), f"MSE cần 1.125, nhận {mse(Y, Y_HAT)}"
    assert np.isclose(mae(Y, Y_HAT), 0.75), f"MAE cần 0.75, nhận {mae(Y, Y_HAT)}"


def test_sai_so_am_duong_khong_triet_tieu():
    y, y_hat = np.array([0.0, 0.0]), np.array([2.0, -2.0])
    assert np.isclose(mse(y, y_hat), 4.0), f"sai số [+2, -2] cho MSE = 4, nhận {mse(y, y_hat)}"
    assert np.isclose(mae(y, y_hat), 2.0), f"sai số [+2, -2] cho MAE = 2, nhận {mae(y, y_hat)}"


def test_du_doan_dung_hoan_toan():
    assert mse(Y, Y) == 0 and mae(Y, Y) == 0, "dự đoán đúng hết thì MSE và MAE phải bằng 0"


def test_ty_le_tang_ngoai_lai():
    tang_mse, tang_mae = ty_le_tang(Y, np.array([3.0, 5.0, 4.0, 16.0]), Y_HAT)
    assert np.isclose(tang_mse, 25.125 / 1.125), f"tang_mse cần ≈ 22.333, nhận {tang_mse}"
    assert np.isclose(tang_mae, 2.75 / 0.75), f"tang_mae cần ≈ 3.667, nhận {tang_mae}"
    assert tang_mse > tang_mae, "MSE phải nhạy với ngoại lai hơn MAE"


def test_tra_ve_float():
    assert isinstance(mse(Y, Y_HAT), float) and isinstance(mae(Y, Y_HAT), float), "cần trả về float, không phải mảng numpy"
