import numpy as np


def hoi_quy_gd(x, y, lr, so_buoc):
    w, b = 0.0, 0.0
    for _ in range(so_buoc):
        sai = w * x + b - y
        dw = 2 * np.mean(sai * x)
        db = 2 * np.mean(sai)
        w, b = w - lr * dw, b - lr * db
    return float(w), float(b)
