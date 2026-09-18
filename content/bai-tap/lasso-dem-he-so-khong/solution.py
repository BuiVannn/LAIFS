import numpy as np


def lasso_ista(X, y, lam, lr, so_buoc):
    n, d = X.shape
    w = np.zeros(d)
    for _ in range(so_buoc):
        g = 2 * (X.T @ (X @ w - y)) / n
        z = w - lr * g
        t = lr * lam
        w = np.sign(z) * np.maximum(np.abs(z) - t, 0)
    return w
