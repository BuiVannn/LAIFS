import numpy as np


def du_doan(w, x):
    return w * x


def mat_mat(w, x, y):
    return float(np.mean((du_doan(w, x) - y) ** 2))


def hoc(x, y):
    return float(np.sum(x * y) / np.sum(x * x))
