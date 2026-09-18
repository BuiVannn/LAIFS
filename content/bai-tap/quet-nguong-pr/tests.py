import numpy as np

DIEM = np.array([0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10])
Y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 0, 0])


def test_du_doan_theo_nguong_lay_ca_dau_bang():
    kq = du_doan_theo_nguong(DIEM, 0.70)
    assert list(kq) == [1, 1, 1, 1, 0, 0, 0, 0, 0, 0], f"t = 0.70 phải lấy cả mẫu có điểm ĐÚNG BẰNG 0.70, nhận {list(kq)}"
    assert list(du_doan_theo_nguong(DIEM, 0.95)) == [1] + [0] * 9, "mẫu cao điểm nhất phải được lấy tại t = 0.95"
    assert du_doan_theo_nguong(DIEM, 0.05).sum() == 10, "ngưỡng dưới mọi điểm thì gắn cờ hết"


def test_duong_pr_khop_bang_tinh_tay():
    P, R = duong_pr(DIEM, Y, DIEM)
    mong_p = [1.0, 0.5, 2 / 3, 0.75, 0.6, 0.5, 4 / 7, 0.5, 4 / 9, 0.4]
    mong_r = [0.25, 0.25, 0.5, 0.75, 0.75, 0.75, 1.0, 1.0, 1.0, 1.0]
    assert np.allclose(P, mong_p), f"precision cần {np.round(mong_p, 4)}, nhận {np.round(P, 4)}"
    assert np.allclose(R, mong_r), f"recall cần {mong_r}, nhận {np.round(R, 4)}"


def test_recall_don_dieu_khi_ha_nguong():
    _, R = duong_pr(DIEM, Y, DIEM)
    assert np.all(np.diff(R) >= 0), f"hạ ngưỡng thì recall không bao giờ được giảm, nhận {R}"


def test_precision_khong_don_dieu():
    P, _ = duong_pr(DIEM, Y, DIEM)
    assert P[1] < P[0] and P[2] > P[1], "precision phải răng cưa: 1.00 → 0.50 → 0.6667"


def test_duong_pr_mau_so_bang_khong():
    P, R = duong_pr(DIEM, Y, np.array([1.5]))
    assert np.isnan(P[0]), f"ngưỡng trên mọi điểm: chưa báo dương lần nào nên precision là nan, nhận {P[0]}"
    assert np.isclose(R[0], 0.0), f"recall vẫn xác định và bằng 0, nhận {R[0]}"
    P2, R2 = duong_pr(DIEM, np.zeros(10, dtype=int), np.array([0.05]))
    assert np.isnan(R2[0]), "không có mẫu dương nào thì recall là nan"


def test_nguong_tot_nhat():
    t, f1 = nguong_tot_nhat(DIEM, Y, DIEM)
    assert np.isclose(t, 0.70), f"ngưỡng tốt nhất là 0.70, không phải 0.5, nhận {t}"
    assert np.isclose(f1, 0.75), f"F1 tại đó cần 0.75, nhận {f1}"


def test_nguong_tot_nhat_khong_chon_nguong_vo_nghia():
    t, f1 = nguong_tot_nhat(DIEM, Y, np.array([1.5, 0.70]))
    assert np.isclose(t, 0.70) and np.isclose(f1, 0.75), f"ngưỡng không báo dương lần nào phải cho F1 = 0, nhận {(t, f1)}"


def test_roc_auc_vi_du_trong_de():
    assert np.isclose(roc_auc(DIEM, Y), 19 / 24), f"cần 19/24 = 0.7917, nhận {roc_auc(DIEM, Y)}"


def test_roc_auc_cac_truong_hop_bien():
    d = np.array([0.9, 0.8, 0.2, 0.1])
    assert np.isclose(roc_auc(d, np.array([1, 1, 0, 0])), 1.0), "xếp hạng hoàn hảo cho AUC = 1"
    assert np.isclose(roc_auc(d, np.array([0, 0, 1, 1])), 0.0), "xếp hạng ngược hoàn toàn cho AUC = 0"


def test_roc_auc_cap_hoa_diem_tinh_nua_diem():
    d = np.array([0.5, 0.5])
    assert np.isclose(roc_auc(d, np.array([1, 0])), 0.5), f"hai mẫu cùng điểm: AUC phải là 0.5, nhận {roc_auc(d, np.array([1, 0]))}"
    d2 = np.array([0.9, 0.5, 0.5, 0.1])
    assert np.isclose(roc_auc(d2, np.array([1, 1, 0, 0])), 0.875), f"3 thắng + 1 hoà trên 4 cặp = 0.875, nhận {roc_auc(d2, np.array([1, 1, 0, 0]))}"
