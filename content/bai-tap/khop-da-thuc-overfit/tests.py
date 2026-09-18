import numpy as np

# Bộ số dùng trong phần "tính tay" của bài học: sự thật là y = 2x + 1
XT = np.array([0.0, 1.0, 2.0, 3.0])
YT = np.array([1.0, 3.5, 4.5, 7.5])
XV = np.array([1.5, 2.5])
YV = np.array([4.0, 6.0])


def test_duong_thang_khop_tay():
    tr, va = khop_da_thuc(XT, YT, XV, YV, 1)
    assert np.isclose(tr, 0.16875), f"MSE train của đường thẳng phải là 0.16875, nhận {tr}"
    assert np.isclose(va, 0.023125), f"MSE val của đường thẳng phải là 0.023125, nhận {va}"


def test_bac_ba_khop_hoan_hao_nhung_val_te_hon():
    tr, va = khop_da_thuc(XT, YT, XV, YV, 3)
    assert np.isclose(tr, 0.0, atol=1e-12), f"4 điểm + đa thức bậc 3 phải cho MSE train = 0, nhận {tr}"
    assert np.isclose(va, 0.110352, atol=1e-5), f"MSE val của bậc 3 phải là 0.110352, nhận {va}"
    tr1, va1 = khop_da_thuc(XT, YT, XV, YV, 1)
    assert va > va1, "quá khớp: train giảm về 0 nhưng val phải TỆ hơn đường thẳng"


def test_bac_0_la_trung_binh():
    tr, va = khop_da_thuc(XT, YT, XV, YV, 0)
    assert np.isclose(tr, np.var(YT)), f"bậc 0 là hằng số trung bình, MSE train = phương sai = {np.var(YT)}, nhận {tr}"


def test_du_lieu_thang_hang_thi_mse_bang_0():
    x = np.linspace(-1, 1, 12)
    y = 2 * x - 3
    tr, va = khop_da_thuc(x, y, np.array([0.3, 0.7]), 2 * np.array([0.3, 0.7]) - 3, 1)
    assert np.isclose(tr, 0.0, atol=1e-18) and np.isclose(va, 0.0, atol=1e-18), \
        f"dữ liệu nằm đúng trên đường thẳng thì cả hai MSE phải bằng 0, nhận ({tr}, {va})"


def test_tra_ve_float():
    tr, va = khop_da_thuc(XT, YT, XV, YV, 2)
    assert isinstance(tr, float) and isinstance(va, float), "cần trả về hai số float"
