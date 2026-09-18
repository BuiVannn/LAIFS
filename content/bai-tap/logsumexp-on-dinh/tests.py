import numpy as np


def test_gia_tri_co_ban():
    kq = logsumexp(np.array([0.0, 1.0, 2.0]))
    assert np.isclose(kq, 2.4076059644), f"ln(1 + e + e^2) = 2.4076059644, nhan {kq}"
    assert np.isclose(logsumexp(np.array([0.0])), 0.0), "mot phan tu thi LSE(z) = z"


def test_logit_khong_lo_khong_tran():
    kq = logsumexp(np.array([1000.0, 1001.0, 1002.0]))
    assert np.isfinite(kq), f"tran so: nhan {kq} — hay tru max truoc khi lay exp"
    assert np.isclose(kq, 1002.4076059644), f"nhan {kq}"


def test_logit_rat_am_khong_thanh_vo_cung_am():
    kq = logsumexp(np.array([-1000.0, -1001.0, -1002.0]))
    assert np.isfinite(kq), f"tran duoi roi log(0): nhan {kq}"
    assert np.isclose(kq, -999.5923940356), f"nhan {kq}"


def test_khoang_cach_lon_chi_tru_dung_max_moi_song():
    # Tru min (hay cong max) van cho e^1000 -> inf. Chi tru MAX moi an toan.
    kq = logsumexp(np.array([0.0, 900.0, 1000.0]))
    assert np.isfinite(kq), f"tran so: nhan {kq} — phai tru np.max, khong phai np.min"
    assert np.isclose(kq, 1000.0), f"e^1000 ap dao hoan toan nen LSE ~ 1000, nhan {kq}"


def test_lon_hon_max_nhung_khong_qua_max_cong_log_k():
    # Bat dang thuc chat che: max(z) <= LSE(z) <= max(z) + ln(K)
    rng = np.random.default_rng(11)
    for _ in range(5):
        z = rng.normal(size=7) * 20
        kq = logsumexp(z)
        assert z.max() <= kq + 1e-9, f"LSE phai >= max(z): {kq} vs {z.max()}"
        assert kq <= z.max() + np.log(len(z)) + 1e-9, f"LSE phai <= max(z) + ln(K): {kq}"


def test_theo_truc_tren_mang_2_chieu():
    A = np.array([[0.0, 1.0, 2.0], [1000.0, 1001.0, 1002.0]])
    hang = logsumexp(A, axis=-1)
    assert np.shape(hang) == (2,), f"axis=-1 tren (2,3) phai cho shape (2,), nhan {np.shape(hang)}"
    assert np.allclose(hang, [2.4076059644, 1002.4076059644]), f"nhan {hang}"
    cot = logsumexp(A, axis=0)
    assert np.shape(cot) == (3,), f"axis=0 tren (2,3) phai cho shape (3,), nhan {np.shape(cot)}"
    assert np.allclose(cot, [1000.0, 1001.0, 1002.0]), f"nhan {cot}"


def test_khop_cach_ngay_tho_khi_so_nho():
    rng = np.random.default_rng(5)
    z = rng.normal(size=(4, 6))
    assert np.allclose(logsumexp(z, axis=-1), np.log(np.sum(np.exp(z), axis=-1))), (
        "voi so nho, ban on dinh phai khop y het ban ngay tho"
    )
