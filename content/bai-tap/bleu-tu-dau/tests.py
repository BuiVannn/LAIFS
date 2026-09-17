import math

REF = "chính phủ đã công bố kế hoạch mới vào sáng thứ hai"
MEO = "con mèo đang ngồi trên tấm thảm"


def test_clipping():
    # "trên" chỉ có 1 lần trong tham chiếu nên 7 lần lặp chỉ được tính 1
    assert precision_ngram("trên trên trên trên trên trên trên", MEO, 1) == (1, 7)


def test_precision_tung_bac():
    # Bản dịch đảo trật tự cụm — các con số tính tay trong bài học
    dich = "vào sáng thứ hai chính phủ đã công bố kế hoạch mới"
    assert precision_ngram(dich, REF, 1) == (12, 12)
    assert precision_ngram(dich, REF, 2) == (10, 11)
    assert precision_ngram(dich, REF, 3) == (8, 10)
    assert precision_ngram(dich, REF, 4) == (6, 9)


def test_ban_dich_ngan_hon_n():
    assert precision_ngram("chính phủ", REF, 4) == (0, 0)


def test_brevity_penalty():
    assert math.isclose(brevity_penalty(12, 12), 1.0, abs_tol=1e-9)
    assert math.isclose(brevity_penalty(15, 12), 1.0, abs_tol=1e-9)
    assert math.isclose(brevity_penalty(8, 12), math.exp(-0.5), rel_tol=1e-9)
    assert math.isclose(brevity_penalty(9, 12), math.exp(-1 / 3), rel_tol=1e-9)
    assert brevity_penalty(0, 12) == 0.0


def test_bleu_bon_ban_dich():
    mong_doi = {
        "vào sáng thứ hai chính phủ đã công bố kế hoạch mới": 83.45,
        "chính phủ đã thông báo kế hoạch mới vào sáng thứ hai": 63.40,
        "chính phủ đã công bố kế hoạch mới vào sáng thứ ba": 90.36,
        "chính phủ đã công bố kế hoạch mới": 60.65,
    }
    for dich, diem in mong_doi.items():
        thuc = bleu(dich, REF)
        assert abs(thuc - diem) < 0.01, f"{dich!r}: nhận {thuc:.2f}, cần {diem}"


def test_bleu_trung_khop_hoan_toan():
    assert math.isclose(bleu(REF, REF), 100.0, rel_tol=1e-9)


def test_bleu_bang_0_khi_thieu_mot_bac():
    # Không có bigram nào khớp -> p2 = 0 -> BLEU = 0, không được sập vì log(0)
    assert bleu("thứ ba", "thứ hai") == 0.0
    assert bleu("xin chào", REF) == 0.0
