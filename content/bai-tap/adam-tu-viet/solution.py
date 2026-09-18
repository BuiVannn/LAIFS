import numpy as np


def chay_adam(grad, w0, lr, T, b1=0.9, b2=0.999, eps=1e-8):
    w = np.array(w0, dtype=float)
    m = np.zeros_like(w)
    v = np.zeros_like(w)
    duong = [w.copy()]
    for t in range(1, T + 1):
        g = grad(w)
        m = b1 * m + (1 - b1) * g
        v = b2 * v + (1 - b2) * g * g
        m_hat = m / (1 - b1 ** t)
        v_hat = v / (1 - b2 ** t)
        w = w - lr * m_hat / (np.sqrt(v_hat) + eps)
        duong.append(w.copy())
    return duong
