CAP = [
    ("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
    ("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
    ("Please sign here.", "   "),
    ("OK", "ok"),
    ("Yes.", "Vâng ạ, tôi hoàn toàn đồng ý với anh về chuyện này."),
    ("He didn't say anything.", "Anh ấy không nói gì cả."),
    ("Good morning.", "Chào buổi sáng."),
]
TEST = [("He didn't say anything.", "Anh ta chẳng nói gì.")]


def test_chuan_hoa():
    assert chuan_hoa("  Chào   buổi sáng!! ") == "chào buổi sáng"
    assert chuan_hoa("   ") == ""
    assert chuan_hoa("OK") == chuan_hoa("ok")


def test_vi_du_trong_de():
    giu, tk = loc_corpus(CAP, TEST)
    assert giu == [
        ("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
        ("Good morning.", "Chào buổi sáng."),
    ], f"nhận {giu}"
    assert tk == {"rong": 1, "trung_nhau": 1, "ti_le_do_dai": 1, "ro_ri_test": 1, "trung_lap": 1}, f"nhận {tk}"


def test_giu_nguyen_ban_va_thu_tu():
    cap = [("  Hello  ", "Xin chào"), ("Bye", "Tạm biệt")]
    giu, _ = loc_corpus(cap, [])
    assert giu == cap, "phải trả về chuỗi nguyên bản, đúng thứ tự vào"


def test_ro_ri_theo_ve_dich():
    # Vế nguồn khác nhau nhưng vế đích trùng tập test -> vẫn là rò rỉ
    cap = [("They left early.", "Họ về sớm.")]
    test = [("They went home early.", "họ về sớm")]
    giu, tk = loc_corpus(cap, test)
    assert giu == [] and tk["ro_ri_test"] == 1


def test_nguong_ti_le_do_dai():
    cap = [("a b", "x y z w v w")]  # 2 và 6 từ -> tỉ lệ đúng 3.0
    giu, tk = loc_corpus(cap, [], ti_le_toi_da=3.0)
    assert giu == cap, "tỉ lệ bằng đúng ngưỡng thì GIỮ (chỉ loại khi lớn hơn)"
    giu, tk = loc_corpus(cap, [], ti_le_toi_da=2.0)
    assert giu == [] and tk["ti_le_do_dai"] == 1


def test_thong_ke_du_5_khoa_khi_khong_loai_gi():
    giu, tk = loc_corpus([("Hi", "Chào bạn")], [])
    assert len(giu) == 1
    assert tk == {"rong": 0, "trung_nhau": 0, "ti_le_do_dai": 0, "ro_ri_test": 0, "trung_lap": 0}


def test_trung_lap_bo_qua_hoa_thuong_va_dau_cau():
    cap = [("Good morning.", "Chào buổi sáng."), ("GOOD MORNING", "chào   buổi sáng")]
    giu, tk = loc_corpus(cap, [])
    assert len(giu) == 1 and tk["trung_lap"] == 1
