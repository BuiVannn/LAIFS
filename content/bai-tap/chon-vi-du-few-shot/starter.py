import math
import re


def tach_tu(cau):
    """Cho sẵn: tách câu thành danh sách từ, không phân biệt hoa thường."""
    return re.findall(r"\w+", cau.lower(), re.UNICODE)


def cosine(a, b):
    """Cho sẵn: cosine giữa hai vector dạng dict. Vector rỗng -> 0.0."""
    tich = sum(v * b[w] for w, v in a.items() if w in b)
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    return tich / (na * nb) if na and nb else 0.0


def tf_idf(kho):
    # Viết code của bạn ở đây
    raise NotImplementedError


def chon_vi_du(cau, kho, k):
    # Viết code của bạn ở đây
    raise NotImplementedError


def dung_prompt(cau, vi_du, thuat_ngu):
    # Viết code của bạn ở đây
    raise NotImplementedError
