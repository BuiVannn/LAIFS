import numpy as np


def cosine(a, b):
    m = np.linalg.norm(a) * np.linalg.norm(b)
    return 0.0 if m == 0 else float(a @ b / m)


def _xep_hang(E, tu, v, bo_qua, k):
    do_dai = np.linalg.norm(E, axis=1)
    nv = np.linalg.norm(v)
    cos = np.zeros(len(tu)) if nv == 0 else np.divide(E @ v, do_dai * nv, out=np.zeros(len(tu)), where=do_dai > 0)
    thu_tu = np.argsort(-cos)
    ra = [(tu[i], float(cos[i])) for i in thu_tu if tu[i] not in bo_qua]
    return ra[:k]


def lang_gieng(E, tu, muc_tieu, k):
    i = tu.index(muc_tieu)
    return _xep_hang(E, tu, E[i], {muc_tieu}, k)


def tuong_tu(E, tu, a, b, c, k=1):
    v = E[tu.index(b)] - E[tu.index(a)] + E[tu.index(c)]
    return _xep_hang(E, tu, v, {a, b, c}, k)
