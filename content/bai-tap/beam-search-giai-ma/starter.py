import numpy as np


def giai_ma_greedy(bang, so_buoc):
    tien_to, log_prob = (), 0.0
    # Viết code của bạn ở đây: mỗi bước lấy token có xác suất cao nhất, cộng dồn np.log(p)
    raise NotImplementedError


def beam_search(bang, k, so_buoc):
    beams = [((), 0.0)]
    # Viết code của bạn ở đây: mở rộng mọi tiền tố, sắp xếp giảm dần theo log_prob, giữ k cái đầu
    raise NotImplementedError
