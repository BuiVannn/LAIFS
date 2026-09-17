import math


def test_parabol():
    kq = dao_ham_so(lambda x: x ** 2, 3.0)
    assert math.isclose(kq, 6.0, abs_tol=1e-6), f"đạo hàm của x² tại 3 phải ≈ 6, nhận {kq}"


def test_la_sai_phan_trung_tam():
    # Với h = 0.1: trung tâm ra 12.01, sai phân tiến ra 12.61
    kq = dao_ham_so(lambda x: x ** 3, 2.0, h=0.1)
    assert math.isclose(kq, 12.01, abs_tol=1e-9), \
        f"với h = 0.1 cần 12.01 (sai phân trung tâm), nhận {kq}. Nếu ra 12.61 là bạn đang dùng sai phân tiến"


def test_ham_mu_va_sin():
    kq = dao_ham_so(math.exp, 0.0)
    assert math.isclose(kq, 1.0, abs_tol=1e-6), f"đạo hàm của e^x tại 0 phải ≈ 1, nhận {kq}"
    kq = dao_ham_so(math.sin, 0.0)
    assert math.isclose(kq, 1.0, abs_tol=1e-6), f"đạo hàm của sin tại 0 phải ≈ 1, nhận {kq}"


def test_dao_ham_am_va_bang_0():
    f = lambda w: (w - 3) ** 2
    assert math.isclose(dao_ham_so(f, 1.0), -4.0, abs_tol=1e-6), "L = (w − 3)² tại w = 1 phải ≈ −4"
    assert abs(dao_ham_so(f, 3.0)) < 1e-6, "tại đáy w = 3 đạo hàm phải ≈ 0"
