import numpy as np


def hoc_thong_ke(X_train):
    return np.mean(X_train, axis=0), np.std(X_train, axis=0)


def ap_dung(X, mu, sigma):
    return (X - mu) / sigma
