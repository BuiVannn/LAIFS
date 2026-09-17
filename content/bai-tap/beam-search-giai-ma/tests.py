import itertools

import numpy as np

# Bảng xác suất của mô hình dịch "Tôi ăn cơm"
BANG = {
    (): {"I": 0.5, "We": 0.3, "Rice": 0.2},
    ("I",): {"am": 0.5, "eat": 0.4, "like": 0.1},
    ("We",): {"eat": 0.6, "are": 0.4},
    ("Rice",): {"is": 1.0},
    ("I", "am"): {"eating": 0.5, "hungry": 0.3, "rice": 0.2},
    ("I", "eat"): {"rice": 0.9, "bread": 0.07, "food": 0.03},
    ("I", "like"): {"rice": 1.0},
    ("We", "eat"): {"rice": 0.9, "bread": 0.1},
    ("We", "are"): {"eating": 1.0},
    ("Rice", "is"): {"eaten": 1.0},
}


def _bang_ngau_nhien(seed, so_token, so_buoc):
    rng = np.random.default_rng(seed)
    tokens = [f"t{i}" for i in range(so_token)]
    bang = {}
    for buoc in range(so_buoc):
        for tien_to in itertools.product(tokens, repeat=buoc):
            p = rng.random(so_token) + 0.05
            bang[tien_to] = dict(zip(tokens, p / p.sum()))
    return bang, tokens


def _vet_can(bang, tokens, so_buoc):
    tot = None
    for cau in itertools.product(tokens, repeat=so_buoc):
        lp = sum(np.log(bang[cau[:i]][cau[i]]) for i in range(so_buoc))
        if tot is None or lp > tot[1]:
            tot = (list(cau), lp)
    return tot


def test_greedy():
    cau, lp = giai_ma_greedy(BANG, 3)
    assert list(cau) == ["I", "am", "eating"], f"greedy phải ra ['I', 'am', 'eating'], nhận {cau}"
    assert abs(lp - (-2.0794415)) < 1e-5, f"log-prob phải ≈ -2.0794 (= ln 0.125), nhận {lp}"


def test_beam_k1_chinh_la_greedy():
    kq = beam_search(BANG, 1, 3)
    assert len(kq) == 1, f"k = 1 thì chỉ giữ 1 nhánh, nhận {len(kq)}"
    cau_g, lp_g = giai_ma_greedy(BANG, 3)
    assert list(kq[0][0]) == list(cau_g) and abs(kq[0][1] - lp_g) < 1e-9, \
        f"beam k=1 phải trùng greedy: beam {kq[0]}, greedy {(cau_g, lp_g)}"


def test_beam_k2_thang_greedy():
    kq = beam_search(BANG, 2, 3)
    assert len(kq) == 2, f"k = 2 phải trả về 2 ứng viên, nhận {len(kq)}"
    cau, lp = kq[0]
    assert list(cau) == ["I", "eat", "rice"], f"beam k=2 phải ra ['I', 'eat', 'rice'], nhận {cau}"
    assert abs(lp - (-1.7147984)) < 1e-5, f"log-prob phải ≈ -1.7148 (= ln 0.18), nhận {lp}"
    _, lp_greedy = giai_ma_greedy(BANG, 3)
    assert lp > lp_greedy, f"beam k=2 phải hơn greedy: {lp} so với {lp_greedy}"
    assert kq[0][1] >= kq[1][1], "kết quả phải sắp xếp giảm dần theo log_prob"


def test_beam_k3_tim_ra_cau_xac_suat_cao_hon():
    kq = beam_search(BANG, 3, 3)
    assert len(kq) == 3, f"k = 3 phải trả về 3 ứng viên, nhận {len(kq)}"
    assert list(kq[0][0]) == ["Rice", "is", "eaten"], \
        f"k=3 giữ được nhánh 'Rice' nên phải tìm ra ['Rice', 'is', 'eaten'], nhận {kq[0][0]}"
    assert abs(kq[0][1] - (-1.6094379)) < 1e-5, f"log-prob phải ≈ -1.6094 (= ln 0.2), nhận {kq[0][1]}"
    assert [round(lp, 6) for _, lp in kq] == sorted((round(lp, 6) for _, lp in kq), reverse=True), \
        "kết quả phải sắp xếp giảm dần theo log_prob"


def test_beam_rong_bang_vet_can():
    # k đủ lớn để không cắt nhánh nào → beam phải cho đúng câu tốt nhất tuyệt đối
    bang, tokens = _bang_ngau_nhien(7, 4, 3)
    cau_vc, lp_vc = _vet_can(bang, tokens, 3)
    cau_beam, lp_beam = beam_search(bang, 64, 3)[0]
    assert list(cau_beam) == cau_vc, f"với k = 64 phải ra câu tốt nhất {cau_vc}, nhận {cau_beam}"
    assert abs(lp_beam - lp_vc) < 1e-9, f"log-prob phải ≈ {lp_vc}, nhận {lp_beam}"


def test_beam_khong_bao_gio_kem_vet_can():
    for seed in (1, 2, 3):
        bang, tokens = _bang_ngau_nhien(seed, 3, 3)
        _, lp_vc = _vet_can(bang, tokens, 3)
        _, lp_greedy = giai_ma_greedy(bang, 3)
        _, lp_beam = beam_search(bang, 2, 3)[0]
        assert lp_beam <= lp_vc + 1e-9, f"seed {seed}: beam ({lp_beam}) không thể hơn câu tốt nhất ({lp_vc})"
        assert lp_greedy <= lp_vc + 1e-9, f"seed {seed}: greedy ({lp_greedy}) không thể hơn câu tốt nhất ({lp_vc})"
