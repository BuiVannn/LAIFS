import numpy as np


def du_doan_theo_nguong(diem, t):
    return (diem >= t).astype(int)


def duong_pr(diem, y, nguong):
    P, R = [], []
    for t in nguong:
        y_hat = du_doan_theo_nguong(diem, t)
        tp = np.sum((y == 1) & (y_hat == 1))
        fp = np.sum((y == 0) & (y_hat == 1))
        fn = np.sum((y == 1) & (y_hat == 0))
        P.append(tp / (tp + fp) if tp + fp else np.nan)
        R.append(tp / (tp + fn) if tp + fn else np.nan)
    return np.array(P, dtype=float), np.array(R, dtype=float)


def nguong_tot_nhat(diem, y, nguong):
    P, R = duong_pr(diem, y, nguong)
    P, R = np.nan_to_num(P), np.nan_to_num(R)
    tong = P + R
    f1 = np.divide(2 * P * R, tong, out=np.zeros_like(tong), where=tong > 0)
    i = int(np.argmax(f1))
    return float(nguong[i]), float(f1[i])


def roc_auc(diem, y):
    duong, am = diem[y == 1], diem[y == 0]
    thang = (duong[:, None] > am[None, :]) + 0.5 * (duong[:, None] == am[None, :])
    return float(np.mean(thang))
