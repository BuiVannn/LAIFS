import numpy as np


def batch_norm_nguoc(dY, X, gamma, eps=1e-5):
    n = X.shape[0]
    mu = np.mean(X, axis=0)
    var = np.var(X, axis=0)
    s = np.sqrt(var + eps)
    xhat = (X - mu) / s
    dgamma = np.sum(dY * xhat, axis=0)
    dbeta = np.sum(dY, axis=0)
    g = gamma * dY
    dX = (n * g - np.sum(g, axis=0) - xhat * np.sum(g * xhat, axis=0)) / (n * s)
    return dX, dgamma, dbeta
