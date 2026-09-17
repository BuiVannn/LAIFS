import math


def test_vi_du_trong_de():
    ws = gradient_descent(lambda w: 2 * w, 2.5, 0.1, 2)
    assert len(ws) == 3, f"cần 3 phần tử (gồm w0), nhận {len(ws)}"
    assert all(math.isclose(a, b) for a, b in zip(ws, [2.5, 2.0, 1.6])), f"nhận {ws}"


def test_hoi_tu_ve_cuc_tieu():
    # L(w) = (w - 3)^2 có cực tiểu tại w = 3
    ws = gradient_descent(lambda w: 2 * (w - 3), -4.0, 0.1, 200)
    assert abs(ws[-1] - 3) < 1e-6, f"sau 200 bước w = {ws[-1]}, cần gần 3"


def test_lr_qua_lon_thi_phan_ky():
    ws = gradient_descent(lambda w: 2 * w, 1.0, 1.1, 20)
    assert abs(ws[-1]) > abs(ws[0]), "với lr = 1.1 trên L = w^2, |w| phải lớn dần"


def test_so_buoc_bang_0():
    assert gradient_descent(lambda w: 2 * w, 5.0, 0.1, 0) == [5.0]
