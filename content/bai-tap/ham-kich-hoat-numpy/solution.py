import numpy as np


def sigmoid(x):
    x = np.asarray(x, dtype=float)
    kq = np.empty_like(x)
    duong = x >= 0
    kq[duong] = 1 / (1 + np.exp(-x[duong]))
    e = np.exp(x[~duong])
    kq[~duong] = e / (1 + e)
    return kq


def dao_ham_sigmoid(x):
    s = sigmoid(x)
    return s * (1 - s)


def tanh(x):
    return np.tanh(np.asarray(x, dtype=float))


def dao_ham_tanh(x):
    return 1 - tanh(x) ** 2


def relu(x):
    return np.maximum(0.0, np.asarray(x, dtype=float))


def dao_ham_relu(x):
    return (np.asarray(x, dtype=float) > 0).astype(float)
