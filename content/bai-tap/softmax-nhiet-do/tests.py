import numpy as np

Z = np.array([2.0, 1.0, 0.1])


def test_tau_bang_1_la_softmax_thuong():
    p = softmax_nhiet_do(Z)
    assert np.allclose(p, [0.659001, 0.242433, 0.098566], atol=1e-6), f"nhan {p}"
    assert np.isclose(p.sum(), 1.0), f"tong phai bang 1, nhan {p.sum()}"


def test_tau_nho_lam_phan_phoi_nhon():
    p = softmax_nhiet_do(Z, tau=0.5)
    assert np.allclose(p, [0.863777, 0.116900, 0.019323], atol=1e-6), f"nhan {p}"
    assert np.isclose(p.sum(), 1.0), f"tong phai bang 1, nhan {p.sum()}"


def test_tau_lon_lam_phan_phoi_phang():
    p = softmax_nhiet_do(Z, tau=2.0)
    assert np.allclose(p, [0.501688, 0.304289, 0.194023], atol=1e-6), f"nhan {p}"


def test_gioi_han_tau_ve_0_la_argmax():
    p = softmax_nhiet_do(Z, tau=1e-6)
    assert np.all(np.isfinite(p)), f"tran so khi tau rat nho: nhan {p} — phai tru max SAU khi chia cho tau"
    assert np.allclose(p, [1.0, 0.0, 0.0]), f"tau -> 0 phai cho one-hot tai lop lon nhat, nhan {p}"


def test_gioi_han_tau_ra_vo_cung_la_phan_bo_deu():
    p = softmax_nhiet_do(Z, tau=1e6)
    assert np.allclose(p, [1 / 3, 1 / 3, 1 / 3], atol=1e-5), f"tau -> vo cung phai cho phan bo deu, nhan {p}"


def test_tau_bang_0_xu_ly_rieng():
    p = softmax_nhiet_do(Z, tau=0)
    assert np.all(np.isfinite(p)), f"tau = 0 phai xu ly rieng, khong duoc chia cho 0; nhan {p}"
    assert np.allclose(p, [1.0, 0.0, 0.0]), f"nhan {p}"
    assert np.isclose(p.sum(), 1.0), f"tong phai bang 1, nhan {p.sum()}"
    hoa = softmax_nhiet_do(np.array([5.0, 5.0, 1.0]), tau=0)
    assert np.allclose(hoa, [0.5, 0.5, 0.0]), f"hoa nhau thi chia deu, nhan {hoa}"
    hai_chieu = softmax_nhiet_do(np.array([[5.0, 1.0, 0.0], [1.0, 9.0, 2.0]]), tau=0)
    assert np.shape(hai_chieu) == (2, 3), f"phai giu nguyen shape (2,3), nhan {np.shape(hai_chieu)}"
    assert np.allclose(hai_chieu, [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]]), (
        f"tau = 0 tren mang 2 chieu phai lay max theo tung HANG (nho keepdims=True): nhan {hai_chieu}"
    )


def test_bat_bien_va_khong_tran_voi_logit_khong_lo():
    p = softmax_nhiet_do(np.array([1000.0, 1001.0, 1002.0]))
    assert np.all(np.isfinite(p)), f"tran so: nhan {p} — hay tru max truoc khi lay exp"
    assert np.allclose(p, [0.09003057, 0.24472847, 0.66524096]), f"nhan {p}"
    rong = softmax_nhiet_do(np.array([0.0, 900.0, 1000.0]), tau=0.5)
    assert np.all(np.isfinite(rong)), f"phai tru np.max chu khong phai np.min; nhan {rong}"


def test_theo_truc_tren_mang_2_chieu():
    A = np.array([[2.0, 1.0, 0.1], [1000.0, 1001.0, 1002.0]])
    p = softmax_nhiet_do(A, tau=0.5)
    assert np.shape(p) == (2, 3), f"phai giu nguyen shape, nhan {np.shape(p)}"
    assert np.allclose(p.sum(axis=-1), 1.0), f"tong theo hang phai bang 1, nhan {p.sum(axis=-1)}"
    cot = softmax_nhiet_do(A, axis=0)
    assert np.allclose(cot.sum(axis=0), 1.0), "axis=0 thi tong theo COT phai bang 1"


def test_entropy():
    assert np.isclose(entropy(np.array([1 / 3, 1 / 3, 1 / 3])), np.log(3)), "phan bo deu cho entropy lon nhat = ln K"
    assert np.isclose(entropy(np.array([1.0, 0.0, 0.0])), 0.0), "one-hot cho entropy = 0 (quy uoc 0 log 0 = 0)"
    assert np.isclose(entropy(softmax_nhiet_do(Z)), 0.8467381788, atol=1e-6), f"nhan {entropy(softmax_nhiet_do(Z))}"
    hai = entropy(np.array([[1 / 3, 1 / 3, 1 / 3], [1.0, 0.0, 0.0]]))
    assert np.shape(hai) == (2,), f"tren (2,3) phai cho shape (2,), nhan {np.shape(hai)}"


def test_entropy_tang_don_dieu_theo_nhiet_do():
    truoc = -1.0
    for tau in (0.25, 0.5, 1.0, 2.0, 4.0, 8.0):
        h = float(entropy(softmax_nhiet_do(Z, tau=tau)))
        assert h > truoc, f"entropy phai tang khi tau tang; tai tau = {tau} nhan {h} <= {truoc}"
        truoc = h
    assert truoc < np.log(3), "entropy khong bao gio vuot ln K"
