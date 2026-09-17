import math
from collections import Counter


def precision_ngram(ban_dich, tham_chieu, n):
    # Trả về (khop, tong). Nhớ clipping: mỗi n-gram chỉ tính tối đa
    # bằng số lần nó xuất hiện trong tham_chieu.
    raise NotImplementedError


def brevity_penalty(do_dai_ban_dich, do_dai_tham_chieu):
    # BP = 1 nếu c > r, ngược lại e^(1 - r/c). c == 0 thì trả về 0.0
    raise NotImplementedError


def bleu(ban_dich, tham_chieu, n_max=4):
    # 100 * BP * trung bình nhân của p_1..p_n_max. Có p_n nào bằng 0 thì trả về 0.0
    raise NotImplementedError
