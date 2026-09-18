import numpy as np


def lop_tuyen_tinh(X, W, b):
    return X @ W.T + b


def mlp_xuoi(X, tham_so):
    H = X
    for i, (W, b) in enumerate(tham_so):
        H = lop_tuyen_tinh(H, W, b)
        if i < len(tham_so) - 1:
            H = np.maximum(0, H)
    return H
