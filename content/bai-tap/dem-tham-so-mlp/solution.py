import numpy as np


def dem_tham_so(kien_truc):
    return int(sum(n * m + m for n, m in zip(kien_truc[:-1], kien_truc[1:])))


def khoi_tao(kien_truc, seed=0):
    rng = np.random.default_rng(seed)
    return [(rng.normal(0, 0.1, size=(m, n)), np.zeros(m)) for n, m in zip(kien_truc[:-1], kien_truc[1:])]


def chuoi_shape(kien_truc, so_mau):
    return [(so_mau, n) for n in kien_truc]
