import numpy as np


def chuan_hang(X):
    return np.sqrt(np.sum(X ** 2, axis=1))


def chuan_hoa_hang(X):
    return X / np.sqrt(np.sum(X ** 2, axis=1, keepdims=True))
