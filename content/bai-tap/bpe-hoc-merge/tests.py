_DEM = {"low": 5, "lower": 2, "newest": 6, "widest": 3}


def test_bon_merge_dau():
    m = hoc_merge(_DEM, 4)
    assert m == [("e", "s"), ("es", "t"), ("l", "o"), ("lo", "w")], f"nhận {m}"


def test_merge_dung_so_luong_va_la_tuple():
    m = hoc_merge(_DEM, 2)
    assert len(m) == 2, f"cần đúng 2 merge, nhận {len(m)}"
    assert all(isinstance(c, tuple) and len(c) == 2 for c in m), f"mỗi merge phải là tuple 2 phần tử, nhận {m}"


def test_dung_som_khi_het_cap():
    # "ab" và "b": sau merge ('a','b') thì không còn cặp liền kề nào
    m = hoc_merge({"ab": 1, "b": 1}, 10)
    assert m == [("a", "b")], f"phải dừng sau 1 merge, nhận {m}"


def test_tan_suat_co_nhan_so_lan_xuat_hien():
    # "ab" hiếm nhưng nặng ký (100 lần) phải thắng "cd" xuất hiện 3 lần
    m = hoc_merge({"ab": 100, "cd": 3}, 1)
    assert m == [("a", "b")], f"phải cân theo số lần xuất hiện, nhận {m}"


def test_ap_dung_tu_moi():
    m = hoc_merge(_DEM, 4)
    assert ap_dung(m, "lowest") == ["low", "est"], f"nhận {ap_dung(m, 'lowest')}"


def test_ap_dung_giu_ky_tu_la():
    m = hoc_merge(_DEM, 4)
    assert ap_dung(m, "lowz") == ["low", "z"], f"nhận {ap_dung(m, 'lowz')}"
    assert ap_dung(m, "xyz") == ["x", "y", "z"], f"nhận {ap_dung(m, 'xyz')}"


def test_ap_dung_theo_thu_hang_khong_phai_trai_sang_phai():
    # ('b','c') học sau ('c','d'): quét trái→phải sẽ ra ['a','bc','d'] (SAI),
    # theo thứ hạng phải gộp ('c','d') trước → ['a', 'b', 'cd']
    merges = [("c", "d"), ("b", "c")]
    assert ap_dung(merges, "abcd") == ["a", "b", "cd"], f"nhận {ap_dung(merges, 'abcd')}"


def test_ap_dung_mot_ky_tu():
    assert ap_dung([("a", "b")], "a") == ["a"]
