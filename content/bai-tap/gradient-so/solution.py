import numpy as np


def gradient_so(f, x, h=1e-5):
    x = np.array(x, dtype=float)  # bản sao, không đụng tới mảng gốc
    grad = np.zeros_like(x)
    for i in np.ndindex(x.shape):
        goc = x[i]
        x[i] = goc + h
        cong = f(x)
        x[i] = goc - h
        tru = f(x)
        x[i] = goc
        grad[i] = (cong - tru) / (2 * h)
    return grad
