def test_so_sanh_khong_dung_thu_tu_chuoi():
    assert so_sanh("1.10.0", "1.9.0") == 1, "1.10.0 moi hon 1.9.0 (10 > 9), khong duoc so sanh chuoi"
    assert so_sanh("1.9.0", "1.10.0") == -1, "1.9.0 cu hon 1.10.0"
    assert so_sanh("2.4.6", "2.4.10") == -1, "2.4.6 cu hon 2.4.10 (6 < 10)"


def test_so_sanh_bang_nhau_va_thieu_thanh_phan():
    assert so_sanh("2.4.6", "2.4.6") == 0, "hai phien ban y het nhau phai cho 0"
    assert so_sanh("1.2", "1.2.0") == 0, "thieu thanh phan thi coi nhu 0, nen 1.2 == 1.2.0"
    assert so_sanh("1.2.0.0", "1.2") == 0, "1.2.0.0 cung bang 1.2"
    assert so_sanh("2", "2.0.1") == -1, "2 tuc la 2.0.0, cu hon 2.0.1"
    assert so_sanh("2.0.1", "2") == 1, "phai doi xung: dao hai tham so thi dao dau ket qua"


def test_so_sanh_tra_dung_ba_gia_tri():
    for a, b in (("1.0", "2.0"), ("2.0", "1.0"), ("1.0", "1.0"), ("1.0.1", "1.0")):
        kq = so_sanh(a, b)
        assert kq in (-1, 0, 1), f"so_sanh phai tra -1, 0 hoac 1, nhan {kq!r}"


def test_thoa_man_bang_va_khac():
    assert thoa_man("2.4.6", "==2.4.6"), "2.4.6 thoa ==2.4.6"
    assert not thoa_man("2.4.7", "==2.4.6"), "2.4.7 KHONG thoa ==2.4.6"
    assert not thoa_man("2.4.6", "==2.4"), "==2.4 tuc ==2.4.0, khac 2.4.6"
    assert thoa_man("2.4.0", "==2.4"), "2.4.0 va 2.4 la mot"
    assert not thoa_man("2.5.0", "!=2.5.0"), "2.5.0 khong thoa !=2.5.0"
    assert thoa_man("2.5.1", "!=2.5.0"), "2.5.1 thoa !=2.5.0"


def test_thoa_man_lon_hon_nho_hon():
    assert thoa_man("2.0.0", ">=2.0"), "bang moc van thoa >="
    assert not thoa_man("2.0.0", ">2.0"), "bang moc KHONG thoa > (lon hon han)"
    assert thoa_man("2.0.1", ">2.0"), "2.0.1 lon hon 2.0"
    assert thoa_man("2.9.0", "<=2.9"), "2.9.0 bang 2.9 nen thoa <="
    assert not thoa_man("2.9.1", "<=2.9"), "2.9.1 lon hon 2.9"
    assert thoa_man("2.9.9", "<3.0"), "2.9.9 nho hon 3.0"
    assert not thoa_man("3.0.0", "<3.0"), "3.0.0 khong nho hon 3.0"
    assert not thoa_man("1.9.0", ">=1.10.0"), "1.9.0 cu hon 1.10.0 nen KHONG thoa (bay so sanh chuoi)"


def test_thoa_man_tuong_duong_tilde():
    assert thoa_man("2.4.6", "~=2.4.6"), "bang moc thi thoa"
    assert thoa_man("2.4.9", "~=2.4.6"), "2.4.9 van trong nhanh 2.4.* va >= moc"
    assert thoa_man("2.4.10", "~=2.4.6"), "2.4.10 van trong nhanh 2.4.*"
    assert not thoa_man("2.5.0", "~=2.4.6"), "~= KHONG cho nhay sang nhanh MINOR moi"
    assert not thoa_man("3.0.0", "~=2.4.6"), "~= KHONG cho nhay sang major moi"
    assert not thoa_man("2.4.0", "~=2.4.6"), "~= van doi >= moc, 2.4.0 nho hon 2.4.6"
    assert not thoa_man("2.3.9", "~=2.4.6"), "2.3.9 cu hon moc"


def test_thoa_man_bo_khoang_trang_va_bao_loi():
    assert thoa_man("2.1.0", ">= 2.0"), "phai chiu duoc khoang trang sau toan tu"
    assert thoa_man("2.1.0", "  >=2.0  "), "phai chiu duoc khoang trang hai dau"
    bi_bat = False
    try:
        thoa_man("2.1.0", "2.0")
    except ValueError:
        bi_bat = True
    assert bi_bat, "rang buoc khong co toan tu phai raise ValueError"


def test_thoa_man_khong_nham_toan_tu_hai_ky_tu():
    # ">=2.0" ma doc thanh ">" + "=2.0" thi _tach("=2.0") se no ValueError,
    # hoac cho ket qua sai. Cac truong hop duoi bat dung loi do.
    assert thoa_man("2.0.0", ">=2.0"), "'>=' phai duoc nhan dang truoc '>'"
    assert thoa_man("2.0.0", "<=2.0"), "'<=' phai duoc nhan dang truoc '<'"
    assert thoa_man("2.4.6", "~=2.4.0"), "'~=' phai duoc nhan dang, khong roi vao nhanh khac"
