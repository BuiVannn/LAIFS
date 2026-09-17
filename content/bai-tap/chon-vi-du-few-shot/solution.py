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


def _vector_hoa(tu, idf):
    if not tu:
        return {}
    v = {}
    for w in tu:
        if w in idf:
            v[w] = v.get(w, 0.0) + idf[w] / len(tu)
    return v


def tf_idf(kho):
    if not kho:
        return [], {}
    cac_tu = [tach_tu(c) for c in kho]
    df = {}
    for tu in cac_tu:
        for w in set(tu):
            df[w] = df.get(w, 0) + 1
    idf = {w: math.log(len(kho) / d) for w, d in df.items()}
    return [_vector_hoa(tu, idf) for tu in cac_tu], idf


def chon_vi_du(cau, kho, k):
    vecto, idf = tf_idf(kho)
    q = _vector_hoa(tach_tu(cau), idf)
    diem = [(-cosine(q, v), i) for i, v in enumerate(vecto)]
    diem.sort()
    return [i for _, i in diem[:k]]


def dung_prompt(cau, vi_du, thuat_ngu):
    thap = cau.lower()
    khop = [(k, v) for k, v in thuat_ngu.items() if k.lower() in thap]
    khoi = []
    if khop:
        khoi.append("Bảng thuật ngữ:\n" + "\n".join(f"- {k} -> {v}" for k, v in khop))
    if vi_du:
        khoi.append("Ví dụ:\n" + "\n\n".join(f"EN: {n}\nVI: {d}" for n, d in vi_du))
    khoi.append(f"Dịch câu sau sang tiếng Việt.\nEN: {cau}\nVI:")
    return "\n\n".join(khoi)
