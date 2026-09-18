def test_vi_du_chinh_trong_de():
    kq = ke_hoach_phien(so_epoch=30, phut_moi_epoch=25, gioi_han_phien=720, moi_n_epoch_luu=5)
    assert kq["epoch_moi_phien"] == 28, f"720 // 25 = 28 epoch tron mot phien, nhan {kq['epoch_moi_phien']}"
    assert kq["so_phien"] == 2, f"30 epoch / 28 lam tron LEN = 2 phien, nhan {kq['so_phien']}"
    assert kq["epoch_mat_toi_da"] == 4, f"luu moi 5 epoch thi mat nhieu nhat 4 epoch, nhan {kq['epoch_mat_toi_da']}"
    assert kq["tong_phut"] == 750, f"30 * 25 = 750 phut, nhan {kq['tong_phut']}"


def test_lam_tron_len_chu_khong_phai_lam_tron_xuong():
    kq = ke_hoach_phien(so_epoch=29, phut_moi_epoch=25, gioi_han_phien=720, moi_n_epoch_luu=1)
    assert kq["so_phien"] == 2, f"29 epoch, 28 epoch/phien -> phai 2 phien chu khong phai 1, nhan {kq['so_phien']}"


def test_chia_het_thi_khong_them_phien_thua():
    kq = ke_hoach_phien(so_epoch=56, phut_moi_epoch=25, gioi_han_phien=720, moi_n_epoch_luu=1)
    assert kq["so_phien"] == 2, f"56 = 2 x 28 chan, phai dung 2 phien, nhan {kq['so_phien']}"


def test_epoch_moi_phien_lay_phan_nguyen_khong_lam_tron_len():
    kq = ke_hoach_phien(so_epoch=10, phut_moi_epoch=7, gioi_han_phien=20, moi_n_epoch_luu=2)
    assert kq["epoch_moi_phien"] == 2, (
        f"20 // 7 = 2 (epoch thu ba bi phien cat giua chung nen khong tinh), nhan {kq['epoch_moi_phien']}"
    )
    assert kq["so_phien"] == 5, f"10 epoch / 2 = 5 phien, nhan {kq['so_phien']}"


def test_luu_moi_epoch_thi_khong_mat_gi():
    kq = ke_hoach_phien(so_epoch=10, phut_moi_epoch=10, gioi_han_phien=100, moi_n_epoch_luu=1)
    assert kq["epoch_mat_toi_da"] == 0, f"luu sau moi epoch thi mat 0 epoch, nhan {kq['epoch_mat_toi_da']}"


def test_luu_thua_hon_suc_chua_cua_phien():
    # Luu moi 100 epoch nhung mot phien chi chay duoc 4 -> mat nhieu nhat 3 epoch.
    kq = ke_hoach_phien(so_epoch=20, phut_moi_epoch=10, gioi_han_phien=45, moi_n_epoch_luu=100)
    assert kq["epoch_moi_phien"] == 4, f"45 // 10 = 4, nhan {kq['epoch_moi_phien']}"
    assert kq["epoch_mat_toi_da"] == 3, (
        f"mat nhieu nhat la min(100, 4) - 1 = 3 epoch, khong phai 99, nhan {kq['epoch_mat_toi_da']}"
    )


def test_bat_tham_so_vo_ly():
    for tham_so in (
        dict(so_epoch=0, phut_moi_epoch=10, gioi_han_phien=100, moi_n_epoch_luu=1),
        dict(so_epoch=10, phut_moi_epoch=0, gioi_han_phien=100, moi_n_epoch_luu=1),
        dict(so_epoch=10, phut_moi_epoch=10, gioi_han_phien=0, moi_n_epoch_luu=1),
        dict(so_epoch=10, phut_moi_epoch=10, gioi_han_phien=100, moi_n_epoch_luu=0),
    ):
        loi = None
        try:
            ke_hoach_phien(**tham_so)
        except ValueError as e:
            loi = e
        assert loi is not None, f"tham so khong duong phai raise ValueError: {tham_so}"


def test_mot_epoch_dai_hon_ca_phien_thi_bat_kha_thi():
    loi = None
    try:
        ke_hoach_phien(so_epoch=3, phut_moi_epoch=800, gioi_han_phien=720, moi_n_epoch_luu=1)
    except ValueError as e:
        loi = e
    assert loi is not None, (
        "mot epoch 800 phut khong bao gio chay tron trong phien 720 phut: phai raise ValueError, "
        "khong duoc tra ve epoch_moi_phien = 0"
    )


def test_quota_du_cho_moi_phien():
    con, tron, bi_cat = quota_con(1800, [600, 600, 300])
    assert (con, tron, bi_cat) == (300, 3, False), f"1800 - 1500 = 300 con lai, 3 phien tron, nhan {(con, tron, bi_cat)}"


def test_quota_het_giua_phien_cuoi():
    con, tron, bi_cat = quota_con(1800, [720, 720, 720])
    assert bi_cat is True, "phien thu ba vuot quota con lai nen bi cat giua chung"
    assert con == 0, f"quota phai can kiet, nhan {con}"
    assert tron == 2, f"chi 2 phien chay tron (phien thu ba bi cat khong tinh), nhan {tron}"


def test_quota_vua_khit_thi_khong_bi_cat():
    con, tron, bi_cat = quota_con(1440, [720, 720])
    assert (con, tron, bi_cat) == (0, 2, False), (
        f"720 + 720 = 1440 vua het, KHONG bi cat (dung > chu khong phai >=), nhan {(con, tron, bi_cat)}"
    )


def test_quota_khong_chay_phien_nao_sau_khi_bi_cat():
    con, tron, bi_cat = quota_con(100, [60, 60, 10])
    assert (con, tron, bi_cat) == (0, 1, True), (
        f"phien 2 da cat het quota, phien 3 khong con chay duoc, nhan {(con, tron, bi_cat)}"
    )


def test_quota_bat_dau_vao_vo_ly():
    for goi in (lambda: quota_con(-1, [10]), lambda: quota_con(100, [10, 0])):
        loi = None
        try:
            goi()
        except ValueError as e:
            loi = e
        assert loi is not None, "quota am hoac phien khong duong phai raise ValueError"
