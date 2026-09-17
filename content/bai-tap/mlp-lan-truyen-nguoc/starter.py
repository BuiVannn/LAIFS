import numpy as np


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def lan_truyen_xuoi(X, W1, b1, W2, b2):
    Z1 = X @ W1.T + b1
    H = sigmoid(Z1)
    Y_hat = H @ W2.T + b2
    return Y_hat, {"X": X, "Z1": Z1, "H": H}


def lan_truyen_nguoc(X, Y, W1, b1, W2, b2):
    Y_hat, cache = lan_truyen_xuoi(X, W1, b1, W2, b2)
    H = cache["H"]
    n = X.shape[0]
    # Viết code của bạn ở đây
    raise NotImplementedError
