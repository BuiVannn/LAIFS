import numpy as np

VUONG = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]])


def test_giu_nguyen_shape():
    for shape in ((3, 3), (5, 3), (2, 7), (1, 4)):
        rng = np.random.default_rng(0)
        X = rng.normal(size=shape)
        Z = chuan_hoa_hang(X)
        assert np.shape(Z) == shape, f"dau vao {shape} phai cho ra {shape}, nhan {np.shape(Z)}"


def test_ma_tran_vuong_van_phai_dung_truc():
    # (3,3) la cai bay: tru theo cot cung "chay duoc" nhung sai hoan toan.
    Z = chuan_hoa_hang(VUONG)
    assert np.allclose(Z.sum(axis=1), 0.0), (
        f"tong MOI HANG phai bang 0 sau khi tru trung binh hang, nhan {Z.sum(axis=1)}"
    )
    mong_doi = np.array([-1.224744871, 0.0, 1.224744871])
    for i in range(3):
        assert np.allclose(Z[i], mong_doi), f"hang {i} phai la {mong_doi}, nhan {Z[i]}"


def test_bat_bien_tong_hang_bang_0_va_do_lech_bang_1():
    rng = np.random.default_rng(7)
    X = rng.normal(loc=50.0, scale=4.0, size=(5, 3))
    Z = chuan_hoa_hang(X)
    assert np.allclose(Z.sum(axis=1), 0.0, atol=1e-9), f"tong moi hang phai bang 0, nhan {Z.sum(axis=1)}"
    assert np.allclose(Z.std(axis=1), 1.0), f"do lech chuan moi hang phai bang 1, nhan {Z.std(axis=1)}"


def test_khong_vuong_de_lo_loi_truc():
    X = np.array([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0], [0.0, 1.0, 2.0],
                  [5.0, 5.5, 6.0], [-1.0, 0.0, 1.0]])
    Z = chuan_hoa_hang(X)
    assert np.shape(Z) == (5, 3), f"nhan {np.shape(Z)}"
    assert np.allclose(Z.sum(axis=1), 0.0, atol=1e-9), f"nhan {Z.sum(axis=1)}"
    assert np.allclose(Z.std(axis=1), 1.0), f"nhan {Z.std(axis=1)}"
    assert np.allclose(Z[4], [-1.224744871, 0.0, 1.224744871]), f"hang cuoi sai: {Z[4]}"


def test_hang_hang_so_khong_sinh_nan():
    X = np.array([[5.0, 5.0, 5.0], [1.0, 2.0, 3.0]])
    Z = chuan_hoa_hang(X)
    assert np.isfinite(Z).all(), f"chia cho do lech chuan 0 sinh nan/inf: {Z}"
    assert np.allclose(Z[0], 0.0), f"hang hang so phai thanh toan 0, nhan {Z[0]}"
    assert np.allclose(Z[1], [-1.224744871, 0.0, 1.224744871]), f"hang con lai van phai dung: {Z[1]}"


def test_mang_kieu_nguyen_khong_bi_cat_phan_thap_phan():
    X = np.array([[1, 2, 3], [10, 20, 40]])
    Z = chuan_hoa_hang(X)
    assert np.issubdtype(np.asarray(Z).dtype, np.floating), (
        f"ket qua phai la so thuc, nhan dtype {np.asarray(Z).dtype}"
    )
    assert np.allclose(Z[0], [-1.224744871, 0.0, 1.224744871]), f"nhan {Z[0]}"
    assert np.allclose(Z.sum(axis=1), 0.0, atol=1e-9), f"nhan {Z.sum(axis=1)}"


def test_khong_doi_khi_cong_hang_so_vao_tung_hang():
    # Chuan hoa theo hang => cong mot hang so vao CA HANG khong lam doi ket qua.
    rng = np.random.default_rng(3)
    X = rng.normal(size=(4, 5))
    dich = np.array([[100.0], [-7.0], [0.0], [3.5]])
    assert np.allclose(chuan_hoa_hang(X), chuan_hoa_hang(X + dich)), (
        "cong hang so vao tung hang khong duoc lam doi ket qua — dau hieu dang tru theo cot"
    )


def test_khong_sua_mang_goc():
    X = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    ban_sao = X.copy()
    chuan_hoa_hang(X)
    assert np.array_equal(X, ban_sao), "ham khong duoc sua mang dau vao tai cho"
