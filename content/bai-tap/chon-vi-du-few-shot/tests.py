import math

KHO = [
    "The patient was admitted to the intensive care unit",
    "The patient was discharged on the third day",
    "The court dismissed the appeal on procedural grounds",
    "The contract shall be governed by the laws of the state",
    "The nurse recorded the patient blood pressure every hour",
]


def test_kho_rong():
    assert tf_idf([]) == ([], {})


def test_idf_cua_tu_co_o_moi_cau_bang_0():
    _, idf = tf_idf(KHO)
    assert math.isclose(idf["the"], 0.0, abs_tol=1e-12), "tu xuat hien o moi cau phai co idf = 0"
    assert idf["court"] > idf["patient"] > 0, "tu cang hiem thi idf cang cao"


def test_trong_so_tf_idf():
    kho = ["a a b", "b c"]
    vecto, idf = tf_idf(kho)
    # 'a' chi co o cau 0 -> idf = ln(2/1) = ln 2; tf = 2/3
    assert math.isclose(vecto[0]["a"], (2 / 3) * math.log(2), abs_tol=1e-12), f"nhan {vecto[0]}"
    # 'b' co o ca hai cau -> idf = 0
    assert math.isclose(vecto[0]["b"], 0.0, abs_tol=1e-12)
    assert "c" not in vecto[0], "chi dua vao dict nhung tu co mat trong cau"


def test_chon_dung_mien():
    cau = "The patient was discharged from the intensive care unit"
    assert chon_vi_du(cau, KHO, 2) == [0, 1], "hai vi du y te phai duoc chon truoc vi du phap ly"


def test_chon_vi_du_phap_ly():
    cau = "The court rejected the appeal filed by the contract holder"
    kq = chon_vi_du(cau, KHO, 2)
    assert set(kq) == {2, 3}, f"cau phap ly phai chon vi du phap ly, nhan {kq}"


def test_k_lon_hon_kho():
    kq = chon_vi_du("The patient", KHO, 99)
    assert len(kq) == len(KHO), f"nhan {len(kq)}"
    assert sorted(kq) == list(range(len(KHO)))


def test_bang_diem_thi_uu_tien_chi_so_nho():
    cau = "zzz qqq"  # khong tu nao trung kho -> moi cau deu 0 diem
    assert chon_vi_du(cau, KHO, 3) == [0, 1, 2]


def test_prompt_du_ba_khoi():
    p = dung_prompt(
        "The patient was discharged from the ICU.",
        [("The nurse checked the chart.", "Điều dưỡng kiểm tra bệnh án.")],
        {"discharge": "xuất viện", "ICU": "khoa hồi sức tích cực", "appeal": "kháng cáo"},
    )
    can = (
        "Bảng thuật ngữ:\n"
        "- discharge -> xuất viện\n"
        "- ICU -> khoa hồi sức tích cực\n"
        "\n"
        "Ví dụ:\n"
        "EN: The nurse checked the chart.\n"
        "VI: Điều dưỡng kiểm tra bệnh án.\n"
        "\n"
        "Dịch câu sau sang tiếng Việt.\n"
        "EN: The patient was discharged from the ICU.\n"
        "VI:"
    )
    assert p == can, f"nhan:\n{p}"


def test_prompt_khong_co_thuat_ngu_khop():
    p = dung_prompt("Hello world.", [], {"appeal": "kháng cáo"})
    assert p == "Dịch câu sau sang tiếng Việt.\nEN: Hello world.\nVI:", f"nhan:\n{p}"


def test_prompt_nhieu_vi_du_cach_nhau_dong_trong():
    p = dung_prompt("X.", [("a", "b"), ("c", "d")], {})
    assert p == "Ví dụ:\nEN: a\nVI: b\n\nEN: c\nVI: d\n\nDịch câu sau sang tiếng Việt.\nEN: X.\nVI:", f"nhan:\n{p}"


def test_prompt_khop_thuat_ngu_khong_phan_biet_hoa_thuong():
    p = dung_prompt("The ICU is full.", [], {"icu": "khoa hồi sức tích cực"})
    assert p.startswith("Bảng thuật ngữ:\n- icu -> khoa hồi sức tích cực"), f"nhan:\n{p}"
