import numpy as np


def softmax_nhiet_do(z, tau=1.0, axis=-1):
    # tau == 0: trả về one-hot tại (các) vị trí lớn nhất, chia đều nếu hoà.
    #           KHÔNG được chia cho tau ở nhánh này.
    # tau > 0:  softmax của z / tau, nhớ trừ max theo axis trước khi lấy exp.
    raise NotImplementedError


def entropy(p, axis=-1):
    # -sum(p * log(p)) theo axis, quy ước 0·log 0 = 0.
    # Gợi ý: thay các p = 0 bằng 1 trước khi lấy log (vì 0 · log 1 = 0).
    raise NotImplementedError
