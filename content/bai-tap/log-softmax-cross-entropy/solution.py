import numpy as np


def log_softmax(z, axis=-1):
    z = np.asarray(z, dtype=float)
    s = z - np.max(z, axis=axis, keepdims=True)
    return s - np.log(np.sum(np.exp(s), axis=axis, keepdims=True))


def cross_entropy_tu_logits(Z, nhan):
    lp = log_softmax(np.asarray(Z, dtype=float), axis=-1)
    nhan = np.asarray(nhan)
    return float(-np.mean(lp[np.arange(len(nhan)), nhan]))
