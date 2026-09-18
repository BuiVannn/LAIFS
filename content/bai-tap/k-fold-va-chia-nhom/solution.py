import numpy as np


def chia_thoi_gian(t, n_test):
    thu_tu = np.argsort(t, kind="stable")
    moc = len(t) - n_test
    return thu_tu[:moc], thu_tu[moc:]


def chia_theo_nhom(nhom, nhom_test):
    la_test = np.isin(nhom, nhom_test)
    return np.flatnonzero(~la_test), np.flatnonzero(la_test)


def cua_so_tien(n, k):
    doan = np.array_split(np.arange(n), k + 1)
    return [(np.concatenate(doan[: j + 1]), doan[j + 1]) for j in range(k)]
