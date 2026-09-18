import numpy as np


def nll_bernoulli(y, p):
    """NLL trung bình cho Bernoulli — chính là binary cross-entropy."""
    # Viết code của bạn ở đây
    raise NotImplementedError


def nll_gauss(y, mu, sigma):
    """NLL trung bình cho Gauss phương sai cố định — phần phụ thuộc mu chính là MSE/(2 sigma^2)."""
    # Viết code của bạn ở đây
    raise NotImplementedError


def mle_bernoulli(y):
    """p làm NLL Bernoulli nhỏ nhất."""
    # Viết code của bạn ở đây
    raise NotImplementedError


def mle_gauss(y):
    """(mu, var) làm NLL Gauss nhỏ nhất. Chú ý: var chia cho n."""
    # Viết code của bạn ở đây
    raise NotImplementedError
