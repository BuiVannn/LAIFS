import numpy as np

Y = np.array([1.0, 2.0, 3.0, 4.0])
YP_COT = np.array([[1.1], [1.9], [3.2], [3.8]])
YP_HANG = np.array([1.1, 1.9, 3.2, 3.8])


def test_mse_khi_hai_ben_cung_shape():
    kq = mse(Y, YP_HANG)
    assert np.isscalar(kq) or np.ndim(kq) == 0, f"mse phai tra ve mot so, nhan {type(kq)}"
    assert np.isclose(kq, 0.025), f"mse dung la 0.025, nhan {kq}"
    assert np.isclose(mse(Y, Y), 0.0), "du doan trung nhan thi mse = 0"


def test_mse_khong_bi_broadcasting_khi_lech_chieu():
    kq = mse(Y, YP_COT)
    assert np.isclose(kq, 0.025), (
        f"(4,) tru (4,1) broadcasting thanh (4,4) roi cho 2.375; ket qua dung la 0.025, nhan {kq}"
    )


def test_mse_doi_xung_va_doi_cho_hai_tham_so():
    assert np.isclose(mse(YP_COT, Y), 0.025), "doi cho hai tham so van phai cho 0.025"
    assert np.isclose(mse(YP_COT, Y), mse(Y, YP_COT)), "mse phai doi xung"
    assert np.isclose(mse(YP_COT, YP_HANG), 0.0), "cung mot du doan viet hai kieu shape thi mse = 0"


def test_mse_khong_am_va_khop_cong_thuc_tinh_tay():
    # sai so: -0.1, 0.1, -0.2, 0.2  ->  (0.01 + 0.01 + 0.04 + 0.04)/4 = 0.025
    kq = mse(Y, YP_COT)
    assert kq >= 0, f"mse khong the am, nhan {kq}"
    tay = (0.01 + 0.01 + 0.04 + 0.04) / 4
    assert np.isclose(kq, tay), f"tinh tay ra {tay}, ham cho {kq}"


def test_mse_tren_kich_thuoc_khac_va_du_lieu_nguyen():
    a = np.array([1, 2, 3, 4, 5])          # kieu int
    b = np.array([[1], [2], [3], [4], [10]])
    kq = mse(a, b)
    assert np.isclose(kq, 5.0), f"chi mau cuoi lech 5 => 25/5 = 5.0, nhan {kq}"


def test_do_chinh_xac_khong_bi_broadcasting():
    kq = do_chinh_xac(np.array([0, 1, 1, 0]), np.array([[0], [1], [0], [0]]))
    assert np.isclose(kq, 0.75), (
        f"3/4 mau dung nen accuracy = 0.75; broadcasting (4,4) se cho 0.5, nhan {kq}"
    )


def test_do_chinh_xac_hai_dau_mut():
    y = np.array([0, 1, 1, 0])
    assert np.isclose(do_chinh_xac(y, y), 1.0), "trung hoan toan phai cho 1.0"
    assert np.isclose(do_chinh_xac(y, y[:, None]), 1.0), "viet dang cot van phai cho 1.0"
    assert np.isclose(do_chinh_xac(y, 1 - y), 0.0), "sai hoan toan phai cho 0.0"
    assert np.isclose(do_chinh_xac(y, (1 - y)[:, None]), 0.0), "dang cot van phai cho 0.0"


def test_bao_loi_khi_so_mau_that_su_lech():
    for ham in (mse, do_chinh_xac):
        bi_bat = False
        try:
            ham(np.zeros(4), np.zeros(5))
        except (ValueError, AssertionError):
            bi_bat = True
        assert bi_bat, f"{ham.__name__} phai bao loi khi 4 nhan gap 5 du doan, khong duoc tra ve so"


def test_khong_bao_loi_khi_chi_khac_cach_viet_shape():
    # (n,) va (n,1) la CUNG mot du lieu, khong duoc coi la lech
    mse(np.zeros(4), np.zeros((4, 1)))
    do_chinh_xac(np.zeros(4, dtype=int), np.zeros((4, 1), dtype=int))
