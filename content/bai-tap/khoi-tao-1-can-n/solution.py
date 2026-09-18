import numpy as np


def khoi_tao(kich_thuoc, rng, sigma_w=None):
    Ws = []
    for n_vao, n_ra in zip(kich_thuoc[:-1], kich_thuoc[1:]):
        s = 1 / np.sqrt(n_vao) if sigma_w is None else sigma_w
        Ws.append(rng.normal(scale=s, size=(n_ra, n_vao)))
    return Ws


def std_qua_lop(X, Ws):
    H = X
    ket_qua = [float(np.std(H))]
    for W in Ws:
        H = H @ W.T
        ket_qua.append(float(np.std(H)))
    return ket_qua
