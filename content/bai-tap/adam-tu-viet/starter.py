import numpy as np


def chay_adam(grad, w0, lr, T, b1=0.9, b2=0.999, eps=1e-8):
    w = np.array(w0, dtype=float)
    m = np.zeros_like(w)
    v = np.zeros_like(w)
    duong = [w.copy()]
    # Viết code của bạn ở đây. Nhớ t chạy từ 1, và nhớ hai dòng hiệu chỉnh thiên lệch.
    raise NotImplementedError
