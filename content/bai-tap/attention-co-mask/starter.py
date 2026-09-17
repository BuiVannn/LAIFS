import numpy as np


def attention(Q, K, V, mask_nhan_qua=True):
    d_k = Q.shape[-1]
    diem = Q @ K.T / np.sqrt(d_k)
    # Viết code của bạn ở đây: che tương lai (nếu cần), softmax theo hàng, rồi nhân V
    raise NotImplementedError


def ma_hoa_vi_tri(n, d):
    # Viết code của bạn ở đây: cột chẵn dùng sin, cột lẻ dùng cos
    raise NotImplementedError
