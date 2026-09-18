VI_DU = """# thu vien tinh toan
numpy==2.4.6
scipy >= 1.11        # de cho pip tu chon ban moi

scikit_learn
torch!=2.1.0
Pillow~=10.2.0
   # dong chu thich thut le
matplotlib<=3.9
seaborn>0.12
tqdm<5
"""


def test_tach_dung_ten_toan_tu_phien_ban():
    kq = doc_requirements("numpy==2.4.6\n")
    assert kq == [("numpy", "==", "2.4.6")], f"nhan {kq}"


def test_bo_dong_trong_va_chu_thich():
    kq = doc_requirements("# chi la ghi chu\n\n   \n   # thut le roi moi chu thich\nnumpy==2.0\n")
    assert kq == [("numpy", "==", "2.0")], f"dong trong va dong chu thich phai bi bo, nhan {kq}"


def test_bo_chu_thich_cuoi_dong_va_khoang_trang():
    kq = doc_requirements("scipy >= 1.11        # de pip tu chon\n")
    assert kq == [("scipy", ">=", "1.11")], (
        f"phai cat chu thich sau # va bo khoang trang hai ben toan tu, nhan {kq}"
    )


def test_khong_nham_toan_tu_hai_ky_tu_thanh_mot_ky_tu():
    # Neu thu ">" truoc ">=" thi phien ban se thanh "=1.11" — bay kinh dien.
    assert doc_requirements("scipy>=1.11\n") == [("scipy", ">=", "1.11")], "'>=' phai duoc thu truoc '>'"
    assert doc_requirements("a<=3.9\n") == [("a", "<=", "3.9")], "'<=' phai duoc thu truoc '<'"
    assert doc_requirements("b!=2.1.0\n") == [("b", "!=", "2.1.0")], "'!=' phai duoc nhan dang"
    assert doc_requirements("c~=10.2.0\n") == [("c", "~=", "10.2.0")], "'~=' phai duoc nhan dang"
    assert doc_requirements("d>0.12\n") == [("d", ">", "0.12")], "'>' don le van phai chay"
    assert doc_requirements("e<5\n") == [("e", "<", "5")], "'<' don le van phai chay"


def test_khong_co_toan_tu():
    kq = doc_requirements("torch\n")
    assert kq == [("torch", "", "")], f"khong co toan tu thi tra chuoi rong cho ca hai truong, nhan {kq}"


def test_chuan_hoa_ten_goi():
    kq = doc_requirements("Pillow~=10.2.0\nscikit_learn\nTORCH==2.6.0\n")
    ten = [t for t, _, _ in kq]
    assert ten == ["pillow", "scikit-learn", "torch"], f"phai ha chu thuong va doi _ thanh -, nhan {ten}"


def test_giu_dung_thu_tu_va_du_so_dong():
    kq = doc_requirements(VI_DU)
    ten = [t for t, _, _ in kq]
    assert ten == [
        "numpy", "scipy", "scikit-learn", "torch", "pillow",
        "matplotlib", "seaborn", "tqdm",
    ], f"phai giu dung thu tu xuat hien va bo het dong chu thich, nhan {ten}"
    assert kq[4] == ("pillow", "~=", "10.2.0"), f"nhan {kq[4]}"
    assert kq[5] == ("matplotlib", "<=", "3.9"), f"nhan {kq[5]}"


def test_soat_khong_pin():
    d = soat(VI_DU)
    assert set(d) == {"khong_pin", "trung_ten", "tat_ca"}, f"dict phai co dung ba khoa, nhan {sorted(d)}"
    assert d["khong_pin"] == [
        "scipy", "scikit-learn", "torch", "pillow", "matplotlib", "seaborn", "tqdm",
    ], f"chi goi dung '==' moi duoc coi la da pin, nhan {d['khong_pin']}"
    assert "numpy" not in d["khong_pin"], "numpy dung == nen da pin"


def test_soat_trung_ten():
    d = soat("numpy==2.4.6\nscipy>=1.11\nnumpy==2.0.0\ntorch\nNumPy==1.26.4\n")
    assert d["trung_ten"] == ["numpy"], (
        f"moi ten trung chi ke MOT lan, va phai nhan ra NumPy = numpy, nhan {d['trung_ten']}"
    )
    assert d["tat_ca"] == ["numpy", "scipy", "numpy", "torch", "numpy"], (
        f"tat_ca giu nguyen ca ban trung, nhan {d['tat_ca']}"
    )
    assert d["khong_pin"] == ["scipy", "torch"], f"nhan {d['khong_pin']}"


def test_soat_file_sach_khong_bao_gi():
    d = soat("numpy==2.4.6\nscipy==1.16.0\n")
    assert d["khong_pin"] == [], f"file da pin het thi khong_pin phai rong, nhan {d['khong_pin']}"
    assert d["trung_ten"] == [], f"khong co ten trung thi trung_ten phai rong, nhan {d['trung_ten']}"
    assert d["tat_ca"] == ["numpy", "scipy"], f"nhan {d['tat_ca']}"
