SO = [
    {"gan": ["du_lieu"], "dung": []},
    {"gan": ["mo_hinh"], "dung": ["du_lieu"]},
    {"gan": ["ket_qua"], "dung": ["mo_hinh"]},
]

# Notebook "tac gia chay lung tung": chay [0, 2, 1] thi tron, chay tu tren xuong thi chet.
LUNG_TUNG = [
    {"gan": ["a"], "dung": []},
    {"gan": ["b"], "dung": ["c"]},
    {"gan": ["c"], "dung": ["a"]},
]


def test_chay_tu_tren_xuong_thi_tron():
    ten, i, bo_nho = chay_theo_thu_tu(SO, [0, 1, 2])
    assert ten is None, f"thu tu 0,1,2 phai chay tron, nhan loi o bien {ten!r}"
    assert i is None, f"khong co loi thi chi so o phai la None, nhan {i}"
    assert bo_nho == {"du_lieu", "mo_hinh", "ket_qua"}, f"bo nho cuoi phai co du 3 bien, nhan {bo_nho}"


def test_chay_o_giua_truoc_thi_thieu_bien():
    ten, i, bo_nho = chay_theo_thu_tu(SO, [1, 0, 2])
    assert ten == "du_lieu", f"o 1 dung du_lieu truoc khi o 0 gan no, phai bao 'du_lieu', nhan {ten!r}"
    assert i == 1, f"loi xay ra o o so 1, nhan {i}"
    assert bo_nho == set(), f"luc do bo nho con rong, nhan {bo_nho}"


def test_loi_o_giua_chuoi_giu_nguyen_bo_nho_da_co():
    ten, i, bo_nho = chay_theo_thu_tu(SO, [0, 2, 1])
    assert (ten, i) == ("mo_hinh", 2), f"phai bao ('mo_hinh', 2), nhan {(ten, i)}"
    assert bo_nho == {"du_lieu"}, f"o 0 da chay nen bo nho phai la {{'du_lieu'}}, nhan {bo_nho}"


def test_o_tu_dung_bien_cua_chinh_no():
    # x = x + 1: ve phai duoc doc TRUOC khi ve trai duoc gan
    o = [{"gan": ["x"], "dung": ["x"]}]
    ten, i, _ = chay_theo_thu_tu(o, [0])
    assert ten == "x", (
        "o dang x = x + 1 chay khi chua co x phai bao loi: kiem tra 'dung' TRUOC khi them 'gan', "
        f"nhan {ten!r}"
    )


def test_bo_nho_tra_ve_la_ban_sao_khong_bi_sua_nguoc():
    ten, i, bo_nho = chay_theo_thu_tu(SO, [0, 2, 1])
    bo_nho.add("rac")
    ten2, i2, bo_nho2 = chay_theo_thu_tu(SO, [0, 2, 1])
    assert "rac" not in bo_nho2, "bo nho tra ve phai la ban sao, nguoi goi sua no khong duoc anh huong lan sau"


def test_restart_and_run_all():
    ten, i, bo_nho = restart_and_run_all(LUNG_TUNG)
    assert (ten, i) == ("c", 1), f"chay tu tren xuong phai chet o o 1 vi thieu 'c', nhan {(ten, i)}"
    assert bo_nho == {"a"}, f"luc chet chi moi co 'a', nhan {bo_nho}"
    assert restart_and_run_all(SO)[0] is None, "notebook SO chay tu tren xuong phai tron"


def test_bien_con_sot():
    sot = bien_con_sot(LUNG_TUNG, [0, 2, 1])
    assert sot == ["b", "c"], (
        "chay [0,2,1] tron nen bo nho co a,b,c; chay tu tren xuong chet ngay o 1 nen chi co a. "
        f"Bien con sot phai la ['b', 'c'] (da sap xep), nhan {sot}"
    )
    assert bien_con_sot(SO, [0, 1, 2]) == [], f"notebook lanh manh thi khong co bien con sot, nhan {bien_con_sot(SO, [0, 1, 2])}"


def test_bien_con_sot_khi_chay_thieu_o():
    # Chay it o hon run-all: khong co bien nao "thua", nen ket qua rong.
    assert bien_con_sot(SO, [0]) == [], f"chay it hon thi khong co bien thua, nhan {bien_con_sot(SO, [0])}"


def test_bat_thu_tu_khong_hop_le():
    loi = None
    try:
        chay_theo_thu_tu(SO, [0, 0, 1])
    except ValueError as e:
        loi = e
    assert loi is not None, "thu_tu co o lap lai phai raise ValueError"

    loi = None
    try:
        chay_theo_thu_tu(SO, [0, 5])
    except ValueError as e:
        loi = e
    assert loi is not None, "chi so o nam ngoai notebook phai raise ValueError"


def test_chi_so_0_van_hop_le():
    # Bay hay gap: viet dieu kien 0 < i thay vi 0 <= i, lam o dau tien bi tu choi
    ten, i, bo_nho = chay_theo_thu_tu(SO, [0])
    assert ten is None and bo_nho == {"du_lieu"}, f"chay rieng o 0 phai hop le, nhan {(ten, bo_nho)}"
