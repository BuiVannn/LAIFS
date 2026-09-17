import numpy as np


def du_doan(X, w, b):
    return (X @ w + b >= 0).astype(int)


def huan_luyen_perceptron(X, y, lr=1.0, so_epoch=100):
    w = np.zeros(X.shape[1])
    b = 0.0
    for _ in range(so_epoch):
        so_lan_sua = 0
        for xi, yi in zip(X, y):
            sai_lech = yi - (1 if xi @ w + b >= 0 else 0)
            if sai_lech != 0:
                w = w + lr * sai_lech * xi
                b = b + lr * sai_lech
                so_lan_sua += 1
        if so_lan_sua == 0:
            break
    return w, b
