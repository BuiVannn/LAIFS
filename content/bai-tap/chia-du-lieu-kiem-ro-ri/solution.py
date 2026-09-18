import numpy as np


def chia(pi, ti_le):
    n = len(pi)
    n_val, n_test = int(n * ti_le[1]), int(n * ti_le[2])
    n_train = n - n_val - n_test
    return pi[:n_train], pi[n_train:n_train + n_val], pi[n_train + n_val:]


def trung_lap(X, A, B):
    goc = {np.asarray(X[j]).tobytes() for j in A}
    return sorted(int(i) for i in B if np.asarray(X[i]).tobytes() in goc)


def k_fold(pi, k):
    return [(pi[~np.isin(pi, fold)], fold) for fold in np.array_split(pi, k)]
