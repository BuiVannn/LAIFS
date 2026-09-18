import numpy as np


def batch_norm_xuoi(X, gamma, beta, tb_chay, ps_chay, huan_luyen, momentum=0.9, eps=1e-5):
    if huan_luyen:
        mu = np.mean(X, axis=0)
        var = np.var(X, axis=0)
        tb_chay = momentum * tb_chay + (1 - momentum) * mu
        ps_chay = momentum * ps_chay + (1 - momentum) * var
    else:
        mu, var = tb_chay, ps_chay
    xhat = (X - mu) / np.sqrt(var + eps)
    return gamma * xhat + beta, tb_chay, ps_chay
