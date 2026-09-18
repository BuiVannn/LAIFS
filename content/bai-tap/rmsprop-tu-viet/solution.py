import numpy as np


def chay_rmsprop(grad, w0, lr, beta, T, eps=1e-8):
    w = np.array(w0, dtype=float)
    s = np.zeros_like(w)
    duong = [w.copy()]
    for _ in range(T):
        g = grad(w)
        s = beta * s + (1 - beta) * g * g
        w = w - lr * g / (np.sqrt(s) + eps)
        duong.append(w.copy())
    return duong
