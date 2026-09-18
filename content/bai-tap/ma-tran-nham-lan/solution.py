import numpy as np


def ma_tran(y, y_hat):
    return (int(np.sum((y == 1) & (y_hat == 1))), int(np.sum((y == 0) & (y_hat == 1))),
            int(np.sum((y == 1) & (y_hat == 0))), int(np.sum((y == 0) & (y_hat == 0))))


def thuoc_do(tp, fp, fn, tn):
    acc = (tp + tn) / (tp + fp + fn + tn)
    p = tp / (tp + fp) if tp + fp else None
    r = tp / (tp + fn) if tp + fn else None
    f1 = 2 * p * r / (p + r) if p and r else 0.0
    return acc, p, r, f1


def f_beta(p, r, beta):
    mau = beta * beta * p + r
    return (1 + beta * beta) * p * r / mau if mau else 0.0
