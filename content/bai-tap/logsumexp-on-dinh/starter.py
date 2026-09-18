import numpy as np


def logsumexp(z, axis=-1):
    # 1. m = np.max(z, axis=axis, keepdims=True)
    # 2. kq = m + log(sum(exp(z - m), axis, keepdims=True))
    # 3. bỏ trục đã cộng: np.squeeze(kq, axis=axis)
    # KHÔNG được tính np.log(np.sum(np.exp(z))) trực tiếp: tràn số với logit lớn.
    raise NotImplementedError
