import numpy as np


def shape_broadcast(a, b):
    a, b = tuple(a), tuple(b)
    n = max(len(a), len(b))
    a = (1,) * (n - len(a)) + a
    b = (1,) * (n - len(b)) + b
    ket_qua = []
    for x, y in zip(a, b):
        if x == y or x == 1:
            ket_qua.append(y)
        elif y == 1:
            ket_qua.append(x)
        else:
            return None
    return tuple(ket_qua)
