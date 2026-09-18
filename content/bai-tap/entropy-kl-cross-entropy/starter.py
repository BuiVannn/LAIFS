import numpy as np


def _xlogy(x, y):
    """x·ln(y) với quy ước 0·ln(y) = 0, để p one-hot không sinh ra nan."""
    x, y = np.asarray(x, dtype=float), np.asarray(y, dtype=float)
    # Viết code của bạn ở đây (gợi ý: mặt nạ boolean m = x > 0)
    raise NotImplementedError


def entropy(p):
    # Viết code của bạn ở đây
    raise NotImplementedError


def cross_entropy(p, q):
    # Viết code của bạn ở đây
    raise NotImplementedError


def kl(p, q):
    # Viết code của bạn ở đây
    raise NotImplementedError


def cross_entropy_batch(P, Q):
    """P, Q shape (n, K) — cross-entropy trung bình trên n hàng."""
    # Viết code của bạn ở đây
    raise NotImplementedError
