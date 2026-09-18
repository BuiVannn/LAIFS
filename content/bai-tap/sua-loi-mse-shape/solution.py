import numpy as np


def _duoi(a, kieu=float):
    """Ep ve mot chieu de (n,) va (n,1) khong con khac nhau."""
    return np.asarray(a, dtype=kieu).ravel()


def mse(y_that, y_doan):
    a, b = _duoi(y_that), _duoi(y_doan)
    if a.shape != b.shape:
        raise ValueError(f"so mau lech: {a.shape} vs {b.shape}")
    return float(np.mean((a - b) ** 2))


def do_chinh_xac(y_that, y_doan):
    a, b = _duoi(y_that, None), _duoi(y_doan, None)
    if a.shape != b.shape:
        raise ValueError(f"so mau lech: {a.shape} vs {b.shape}")
    return float(np.mean(a == b))
