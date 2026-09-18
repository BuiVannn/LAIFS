import numpy as np


def log_softmax(z, axis=-1):
    # ln p_i = z_i - LSE(z). Tính THẲNG, không đi qua p rồi mới lấy log.
    #   s  = z - np.max(z, axis=axis, keepdims=True)
    #   kq = s - np.log(np.sum(np.exp(s), axis=axis, keepdims=True))
    raise NotImplementedError


def cross_entropy_tu_logits(Z, nhan):
    # Z: (N, K) logit thô · nhan: (N,) chỉ số lớp đúng
    # Lấy log_softmax rồi bốc phần tử của lớp đúng ở từng hàng, đổi dấu, lấy TRUNG BÌNH.
    # Gợi ý bốc theo hàng: lp[np.arange(len(nhan)), nhan]
    raise NotImplementedError
