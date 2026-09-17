import numpy as np


def du_doan(X, w, b):
    return X @ w + b


def nghiem_dong(X, y):
    Xb = np.hstack([X, np.ones((X.shape[0], 1))])
    theta = np.linalg.solve(Xb.T @ Xb, Xb.T @ y)
    return theta[:-1], float(theta[-1])
