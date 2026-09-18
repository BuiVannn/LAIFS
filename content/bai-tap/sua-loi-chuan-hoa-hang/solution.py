import numpy as np


def chuan_hoa_hang(X):
    X = np.asarray(X, dtype=float)
    mu = X.mean(axis=1, keepdims=True)
    sd = X.std(axis=1, keepdims=True)
    sd_an_toan = np.where(sd == 0, 1.0, sd)   # hang hang so: mau so 1, tu so von da bang 0
    return (X - mu) / sd_an_toan
