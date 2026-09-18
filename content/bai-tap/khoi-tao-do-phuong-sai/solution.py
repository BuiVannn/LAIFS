import numpy as np


def khoi_tao(n_in, n_out, kieu, rng):
    if kieu == "xavier":
        std = np.sqrt(2.0 / (n_in + n_out))
    elif kieu == "he":
        std = np.sqrt(2.0 / n_in)
    else:
        std = float(kieu)
    return rng.normal(0.0, std, size=(n_in, n_out))


def do_phuong_sai(kieu, L=20, n=256, seed=0):
    rng = np.random.default_rng(seed)
    h = rng.normal(0, 1, (512, n))
    ps = []
    for _ in range(L):
        W = khoi_tao(n, n, kieu, rng)
        z = h @ W
        ps.append(float(z.var()))
        h = np.maximum(0, z)
    return ps
