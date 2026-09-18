import numpy as np


def logsumexp(z, axis=-1):
    z = np.asarray(z, dtype=float)
    m = np.max(z, axis=axis, keepdims=True)
    kq = m + np.log(np.sum(np.exp(z - m), axis=axis, keepdims=True))
    return np.squeeze(kq, axis=axis)
