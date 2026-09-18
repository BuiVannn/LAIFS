import numpy as np


def chay_momentum(grad, w0, lr, beta, T):
    w = np.array(w0, dtype=float)
    v = np.zeros_like(w)
    duong = [w.copy()]
    for _ in range(T):
        v = beta * v + grad(w)
        w = w - lr * v
        duong.append(w.copy())
    return duong
