import numpy as np


def sigmoid(z):
    e = np.exp(-np.abs(z))
    return np.where(z < 0, e / (1 + e), 1 / (1 + e))


def mat_mat(X, y, w, b):
    p = sigmoid(X @ w + b)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))


def huan_luyen_logistic(X, y, lr, so_buoc):
    w = np.zeros(X.shape[1])
    b = 0.0
    for _ in range(so_buoc):
        sai = sigmoid(X @ w + b) - y
        w = w - lr * (X.T @ sai) / len(y)
        b = b - lr * np.mean(sai)
    return w, float(b)


def du_doan(X, w, b, nguong=0.5):
    return (sigmoid(X @ w + b) >= nguong).astype(int)
