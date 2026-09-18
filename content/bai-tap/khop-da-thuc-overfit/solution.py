import numpy as np


def khop_da_thuc(x_train, y_train, x_val, y_val, bac):
    V = np.vander(x_train, bac + 1)
    he_so = np.linalg.lstsq(V, y_train, rcond=None)[0]
    mse_train = np.mean((np.polyval(he_so, x_train) - y_train) ** 2)
    mse_val = np.mean((np.polyval(he_so, x_val) - y_val) ** 2)
    return float(mse_train), float(mse_val)
