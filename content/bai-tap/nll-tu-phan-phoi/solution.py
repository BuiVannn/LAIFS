import numpy as np


def nll_bernoulli(y, p):
    """NLL trung bình cho Bernoulli — chính là binary cross-entropy."""
    y, p = np.asarray(y, dtype=float), np.asarray(p, dtype=float)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))


def nll_gauss(y, mu, sigma):
    """NLL trung bình cho Gauss phương sai cố định — phần phụ thuộc mu chính là MSE/(2 sigma^2)."""
    y, mu = np.asarray(y, dtype=float), np.asarray(mu, dtype=float)
    return np.mean(0.5 * np.log(2 * np.pi * sigma ** 2) + (y - mu) ** 2 / (2 * sigma ** 2))


def mle_bernoulli(y):
    """p làm NLL Bernoulli nhỏ nhất."""
    return float(np.mean(np.asarray(y, dtype=float)))


def mle_gauss(y):
    """(mu, var) làm NLL Gauss nhỏ nhất. Chú ý: var chia cho n."""
    y = np.asarray(y, dtype=float)
    mu = np.mean(y)
    var = np.mean((y - mu) ** 2)
    return float(mu), float(var)
