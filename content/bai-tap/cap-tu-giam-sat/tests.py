import numpy as np

T = ["học", "máy", "là", "học"]


def test_cap_ke_tiep_vi_du_trong_de():
    mong = [(("học",), "máy"), (("học", "máy"), "là"), (("học", "máy", "là"), "học")]
    assert cap_ke_tiep(T) == mong, f"cần {mong}, nhận {cap_ke_tiep(T)}"


def test_cap_ke_tiep_so_luong():
    assert len(cap_ke_tiep(list("abcdefg"))) == 6, "câu 7 token cho đúng 6 mẫu"
    assert cap_ke_tiep(["a"]) == [], "câu 1 token không có ngữ cảnh nào nên cho 0 mẫu"
    assert cap_ke_tiep([]) == [], "câu rỗng cho 0 mẫu"


def test_cap_ke_tiep_khong_nhin_tuong_lai():
    for ngu_canh, nhan in cap_ke_tiep(list("abcdef")):
        assert nhan not in ngu_canh, f"ngữ cảnh {ngu_canh} không được chứa nhãn {nhan}"
        assert len(ngu_canh) >= 1, "ngữ cảnh phải có ít nhất 1 token"


def test_cap_bi_che_vi_du_trong_de():
    cap = cap_bi_che(T)
    assert len(cap) == 4, f"che từng vị trí của câu 4 token cho 4 mẫu, nhận {len(cap)}"
    assert cap[0] == (("[CHE]", "máy", "là", "học"), "học"), f"mẫu đầu sai: {cap[0]}"
    assert cap[3] == (("học", "máy", "là", "[CHE]"), "học"), f"mẫu cuối sai: {cap[3]}"


def test_cap_bi_che_giu_do_dai_va_ky_hieu():
    cap = cap_bi_che(T, ky_hieu="<M>")
    assert all(len(c) == len(T) for c, _ in cap), "câu bị che phải cùng độ dài câu gốc"
    assert cap[2][0].count("<M>") == 1, "mỗi mẫu che đúng một vị trí, bằng ký hiệu được truyền vào"


def test_so_cap_vi_du_trong_de():
    kq = so_cap(np.array([7, 4, 1, 0]))
    assert np.array_equal(kq, [6, 3, 0, 0]), f"cần [6, 3, 0, 0], nhận {kq}"


def test_so_cap_khong_am():
    assert np.all(so_cap(np.array([0, 0, 1])) >= 0), "câu rỗng hoặc 1 token phải cho 0, không được ra số âm"
    assert np.array_equal(so_cap(np.array([100])), [99]), "câu 100 token cho 99 mẫu"


def test_so_cap_khop_voi_cap_ke_tiep():
    for n in (0, 1, 2, 5, 9):
        assert int(so_cap(np.array([n]))[0]) == len(cap_ke_tiep(list(range(n)))), f"so_cap lệch với cap_ke_tiep tại n = {n}"
