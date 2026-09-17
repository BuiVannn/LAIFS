import numpy as np


def buoc_rnn(h, x, Wh, Wx, b):
    return np.tanh(Wh @ h + Wx @ x + b)


def ma_hoa(X, Wh, Wx, b):
    k = Wh.shape[0]
    h = np.zeros(k)
    H = np.empty((len(X), k))
    for t, x in enumerate(X):
        h = buoc_rnn(h, x, Wh, Wx, b)
        H[t] = h
    return H, h
