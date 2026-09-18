import numpy as np


def tich_vo_huong(u, v):
    tong = 0.0
    for i in range(len(u)):
        tong += u[i] * v[i]
    return tong


def nhan(A, B):
    m, n = A.shape
    n_b, p = B.shape
    if n != n_b:
        raise ValueError(f"chieu trong khong khop: {A.shape} va {B.shape}")
    C = np.zeros((m, p))
    for i in range(m):
        for j in range(p):
            C[i, j] = tich_vo_huong(A[i, :], B[:, j])
    return C


def cot_ket_qua(A, B, j):
    n = A.shape[1]
    dong_gop = [B[k, j] * A[:, k] for k in range(n)]
    return np.sum(dong_gop, axis=0)
