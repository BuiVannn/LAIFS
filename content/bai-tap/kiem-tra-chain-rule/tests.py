import numpy as np


def _dao_ham_so(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)


def test_vi_du_trong_de():
    L, d = xuoi_nguoc(2.0)
    assert np.isclose(L, 169.0), f"L tại x = 2 phải là 169, nhận {L}"
    assert np.isclose(d, 312.0), f"dL/dx tại x = 2 phải là 312, nhận {d}"


def test_khop_dao_ham_so():
    for x in [-1.5, -0.3, 0.0, 0.7, 1.0, 3.0]:
        _, d = xuoi_nguoc(x)
        so = _dao_ham_so(lambda t: xuoi_nguoc(t)[0], x)
        assert np.isclose(d, so, rtol=1e-5, atol=1e-4), \
            f"tại x = {x}: quy tắc chuỗi ra {d}, đạo hàm số ra {so}. Có quên nhân đạo hàm cục bộ nào không?"


def test_tai_x_bang_0():
    L, d = xuoi_nguoc(0.0)
    assert np.isclose(L, 1.0) and np.isclose(d, 0.0), f"tại x = 0 cần (1, 0), nhận ({L}, {d})"


def test_chay_voi_mang_numpy():
    x = np.linspace(-2, 2, 9)
    L, d = xuoi_nguoc(x)
    assert np.shape(d) == x.shape, f"với mảng đầu vào shape {x.shape}, dL/dx phải cùng shape, nhận {np.shape(d)}"
    assert np.allclose(d, 12 * x * (3 * x ** 2 + 1)), "dL/dx theo từng phần tử chưa đúng"
