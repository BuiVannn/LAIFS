import numpy as np


def softmax(x, axis=-1):
    x = np.asarray(x, dtype=float)
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)


def chu_y(H, s):
    diem = H @ s
    alpha = softmax(diem)
    c = alpha @ H
    return alpha, c
