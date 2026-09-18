import numpy as np


def mot_epoch(x, y, w, lr, B, rng):
    n = len(x)
    thu_tu = rng.permutation(n)
    for dau in range(0, n, B):
        idx = thu_tu[dau:dau + B]
        xb, yb = x[idx], y[idx]
        grad = 2 * np.mean((w * xb - yb) * xb)
        w = w - lr * grad
    return float(w)
