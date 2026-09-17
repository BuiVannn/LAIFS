import numpy as np


def attention(Q, K, V, mask_nhan_qua=True):
    d_k = Q.shape[-1]
    diem = Q @ K.T / np.sqrt(d_k)
    if mask_nhan_qua:
        n = Q.shape[0]
        che = np.triu(np.ones((n, n), dtype=bool), k=1)
        diem = np.where(che, -np.inf, diem)
    diem = diem - diem.max(axis=1, keepdims=True)
    e = np.exp(diem)
    trong_so = e / e.sum(axis=1, keepdims=True)
    return trong_so @ V, trong_so


def ma_hoa_vi_tri(n, d):
    pos = np.arange(n)[:, None]
    i = np.arange(d // 2)[None, :]
    goc = pos / 10000 ** (2 * i / d)
    PE = np.zeros((n, d))
    PE[:, 0::2] = np.sin(goc)
    PE[:, 1::2] = np.cos(goc)
    return PE
