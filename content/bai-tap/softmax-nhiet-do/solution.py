import numpy as np


def softmax_nhiet_do(z, tau=1.0, axis=-1):
    z = np.asarray(z, dtype=float)
    if tau == 0:
        dan_dau = (z == np.max(z, axis=axis, keepdims=True)).astype(float)
        return dan_dau / np.sum(dan_dau, axis=axis, keepdims=True)
    s = z / tau
    e = np.exp(s - np.max(s, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)


def entropy(p, axis=-1):
    p = np.asarray(p, dtype=float)
    khac_khong = np.where(p > 0, p, 1)
    return -np.sum(p * np.log(khac_khong), axis=axis)
