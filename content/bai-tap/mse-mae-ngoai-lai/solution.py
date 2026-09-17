import numpy as np


def mse(y, y_hat):
    return float(np.mean((y - y_hat) ** 2))


def mae(y, y_hat):
    return float(np.mean(np.abs(y - y_hat)))


def ty_le_tang(y, y_ngoai_lai, y_hat):
    return mse(y_ngoai_lai, y_hat) / mse(y, y_hat), mae(y_ngoai_lai, y_hat) / mae(y, y_hat)
