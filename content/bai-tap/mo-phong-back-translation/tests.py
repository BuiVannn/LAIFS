import math


def test_vi_du_trong_de():
    kq = sinh_cap_gia(["măn khảu", "tê nhà"], lambda c: c.upper())
    assert kq == [("MĂN KHẢU", "măn khảu"), ("TÊ NHÀ", "tê nhà")], f"nhan {kq}"


def test_cau_nguoi_viet_phai_o_phia_dich():
    don_ngu = ["cau that mot", "cau that hai"]
    kq = sinh_cap_gia(don_ngu, lambda c: "rac " + c)
    for i, (nguon, dich) in enumerate(kq):
        assert dich == don_ngu[i], "phia dich phai la cau don ngu goc, khong phai cau may sinh"
        assert nguon.startswith("rac"), "phia nguon phai la dau ra cua mo hinh nguoc"


def test_don_ngu_rong():
    assert sinh_cap_gia([], lambda c: c) == []


def test_loc_giu_cap_can_doi():
    cap = [("a b c", "x y z"), ("a", "x y")]
    assert loc_theo_ti_le_dai(cap) == cap, "ti le 1.0 va 0.5 deu nam trong khoang mac dinh"


def test_loc_bo_cap_lech_dai():
    cap = [
        ("mot hai ba bon nam", "x"),          # ti le 5.0 -> bo
        ("mot", "x y z bon nam"),             # ti le 0.2 -> bo
        ("mot hai", "x y"),                   # ti le 1.0 -> giu
    ]
    kq = loc_theo_ti_le_dai(cap)
    assert kq == [("mot hai", "x y")], f"nhan {kq}"


def test_loc_bo_cap_rong():
    cap = [("", "x y"), ("a b", "   "), ("a b", "x y")]
    kq = loc_theo_ti_le_dai(cap)
    assert kq == [("a b", "x y")], f"cap rong phai bi bo, nhan {kq}"


def test_loc_ton_trong_nguong_tu_chon():
    cap = [("a b c", "x")]  # ti le 3.0
    assert loc_theo_ti_le_dai(cap) == []
    assert loc_theo_ti_le_dai(cap, min_ti=0.25, max_ti=4.0) == cap


def test_tron_va_ti_le_gia():
    that = [("a", "b")]
    gia = [("c", "d"), ("e", "f")]
    du_lieu, ti = tron_du_lieu(that, gia, lap_that=1)
    assert len(du_lieu) == 3, f"nhan {len(du_lieu)}"
    assert du_lieu[0] == ("a", "b"), "du lieu that phai dung truoc"
    assert math.isclose(ti, 2 / 3, abs_tol=1e-9), f"nhan {ti}"


def test_lap_du_lieu_that_lam_giam_ti_le_gia():
    that = [("a", "b")]
    gia = [("c", "d"), ("e", "f")]
    du_lieu, ti = tron_du_lieu(that, gia, lap_that=4)
    assert len(du_lieu) == 6, f"nhan {len(du_lieu)}"
    assert math.isclose(ti, 2 / 6, abs_tol=1e-9), f"nhan {ti}"


def test_quy_mo_thuc_te():
    # 20 000 cap that, 200 000 cau don ngu -> lap 10 lan thi gia chiem dung mot nua
    that = [("nguon %d" % i, "dich %d" % i) for i in range(2000)]
    don_ngu = ["dich don ngu %d" % i for i in range(20000)]
    gia = loc_theo_ti_le_dai(sinh_cap_gia(don_ngu, lambda c: c))
    assert len(gia) == 20000, f"mo hinh nguoc dong nhat thi khong cap nao bi loc, nhan {len(gia)}"
    _, ti = tron_du_lieu(that, gia, lap_that=10)
    assert math.isclose(ti, 0.5, abs_tol=1e-9), f"nhan {ti}"


def test_khong_co_du_lieu_nao():
    du_lieu, ti = tron_du_lieu([], [], lap_that=3)
    assert du_lieu == [] and ti == 0.0, f"nhan {du_lieu}, {ti}"
