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
    D2 = 2 * (Y_hat - Y) / n
    dW2 = D2.T @ H
    db2 = D2.sum(axis=0)
    dH = D2 @ W2
    D1 = dH * H * (1 - H)
    dW1 = D1.T @ X
    db1 = D1.sum(axis=0)
    return {"dW1": dW1, "db1": db1, "dW2": dW2, "db2": db2}
