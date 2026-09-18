import numpy as np

Y = np.array([1] * 10 + [0] * 90)
Y_HAT = np.array([1] * 6 + [0] * 4 + [1] * 3 + [0] * 87)


def test_ma_tran_vi_du_trong_de():
    assert ma_tran(Y, Y_HAT) == (6, 3, 4, 87), f"cần (6, 3, 4, 87), nhận {ma_tran(Y, Y_HAT)}"


def test_ma_tran_khong_nham_fp_voi_fn():
    y = np.array([1, 1, 0, 0, 0])
    assert ma_tran(y, np.array([1, 0, 1, 0, 0])) == (1, 1, 1, 2), "TP=1 FP=1 FN=1 TN=2"
    assert ma_tran(y, np.array([0, 0, 1, 1, 1])) == (0, 3, 2, 0), "dự đoán ngược hẳn: TP=0 FP=3 FN=2 TN=0"


def test_ma_tran_dem_khong_phai_trung_binh():
    y = np.ones(20, dtype=int)
    assert ma_tran(y, y) == (20, 0, 0, 0), f"phải ĐẾM số mẫu, cần (20,0,0,0), nhận {ma_tran(y, y)}"


def test_thuoc_do_vi_du_trong_de():
    acc, p, r, f1 = thuoc_do(6, 3, 4, 87)
    assert np.isclose(acc, 0.93), f"accuracy cần 0.93, nhận {acc}"
    assert np.isclose(p, 6 / 9), f"precision cần 0.6667, nhận {p}"
    assert np.isclose(r, 0.6), f"recall cần 0.6, nhận {r}"
    assert np.isclose(f1, 12 / 19), f"F1 cần 0.6316, nhận {f1}"


def test_precision_khac_recall():
    _, p, r, _ = thuoc_do(6, 3, 4, 87)
    assert not np.isclose(p, r), "precision chia cho (TP+FP), recall chia cho (TP+FN) — hai mẫu số khác nhau"
    _, p2, r2, _ = thuoc_do(5, 0, 5, 90)
    assert np.isclose(p2, 1.0) and np.isclose(r2, 0.5), f"FP=0 cho precision 1.0 và recall 0.5, nhận {p2}, {r2}"


def test_mau_so_bang_khong_tra_ve_none():
    acc, p, r, f1 = thuoc_do(0, 0, 10, 90)
    assert np.isclose(acc, 0.90), f"accuracy cần 0.90, nhận {acc}"
    assert p is None, f"chưa từng báo dương thì precision KHÔNG xác định, phải là None, nhận {p}"
    assert np.isclose(r, 0.0), f"recall cần 0.0, nhận {r}"
    assert f1 == 0.0, f"F1 cần 0.0, nhận {f1}"
    assert thuoc_do(0, 5, 0, 95)[2] is None, "không có mẫu dương nào thì recall phải là None"


def test_f1_la_trung_binh_dieu_hoa():
    _, _, _, f1 = thuoc_do(1, 0, 99, 900)
    assert np.isclose(f1, 2 * 1.0 * 0.01 / 1.01), f"P=1.0, R=0.01 phải cho F1 ≈ 0.0198 (không phải 0.505), nhận {f1}"
    assert f1 < 0.05, "trung bình điều hoà phải bị kéo về phía số nhỏ hơn"


def test_f1_khop_cong_thuc_rut_gon():
    for tp, fp, fn, tn in ((6, 3, 4, 87), (3, 1, 1, 5), (40, 10, 20, 30)):
        f1 = thuoc_do(tp, fp, fn, tn)[3]
        assert np.isclose(f1, 2 * tp / (2 * tp + fp + fn)), f"F1 phải bằng 2TP/(2TP+FP+FN) tại {(tp, fp, fn, tn)}"


def test_f_beta():
    p, r = 6 / 9, 0.6
    assert np.isclose(f_beta(p, r, 1), 12 / 19), f"beta = 1 phải cho đúng F1, nhận {f_beta(p, r, 1)}"
    assert np.isclose(f_beta(p, r, 2), 0.6122448979591837), f"F2 cần 0.6122, nhận {f_beta(p, r, 2)}"
    assert np.isclose(f_beta(p, r, 0.5), 0.6521739130434783), f"F0.5 cần 0.6522, nhận {f_beta(p, r, 0.5)}"
    assert f_beta(p, r, 2) < f_beta(p, r, 1) < f_beta(p, r, 0.5), "ở đây recall < precision nên beta lớn phải cho điểm thấp hơn"
    assert f_beta(0.0, 0.0, 1) == 0.0, "mẫu số bằng 0 thì trả về 0.0, không được chia cho 0"
