import numpy as np


def chuan_toan_cuc(gs):
    return float(np.sqrt(sum(np.sum(np.asarray(g, dtype=float) ** 2) for g in gs)))


def cat_gradient(gs, nguong):
    chuan = chuan_toan_cuc(gs)
    he_so = nguong / chuan if chuan > nguong else 1.0
    return [np.asarray(g, dtype=float) * he_so for g in gs]
