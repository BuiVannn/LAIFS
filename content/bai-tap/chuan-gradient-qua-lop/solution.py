import numpy as np


def _f(ten, Z):
    if ten == "relu":
        return np.maximum(Z, 0)
    return 1 / (1 + np.exp(-Z))


def _df(ten, Z, A):
    if ten == "relu":
        return (Z > 0).astype(float)
    return A * (1 - A)


def chuan_gradient_theo_lop(X, Ws, kich_hoat):
    A = [np.asarray(X, dtype=float)]
    Z = []
    for W in Ws:
        Z.append(A[-1] @ W)
        A.append(_f(kich_hoat, Z[-1]))
    dA = np.ones_like(A[-1]) / A[-1].size
    chuan = []
    for l in range(len(Ws) - 1, -1, -1):
        dZ = dA * _df(kich_hoat, Z[l], A[l + 1])
        chuan.append(float(np.linalg.norm(A[l].T @ dZ)))
        dA = dZ @ Ws[l].T
    return chuan[::-1]
