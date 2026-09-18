import numpy as np


def _xlogy(x, y):
    """x·ln(y) với quy ước 0·ln(y) = 0, để p one-hot không sinh ra nan."""
    x, y = np.asarray(x, dtype=float), np.asarray(y, dtype=float)
    kq = np.zeros_like(x)
    m = x > 0
    kq[m] = x[m] * np.log(y[m])
    return kq


def entropy(p):
    return float(-np.sum(_xlogy(p, p)))


def cross_entropy(p, q):
    return float(-np.sum(_xlogy(p, q)))


def kl(p, q):
    return float(np.sum(_xlogy(p, p)) - np.sum(_xlogy(p, q)))


def cross_entropy_batch(P, Q):
    """P, Q shape (n, K) — cross-entropy trung bình trên n hàng."""
    return float(np.mean(-np.sum(_xlogy(P, Q), axis=1)))
