import numpy as np


def dropout_xuoi(h, p, rng, huan_luyen):
    if not huan_luyen:
        return h
    mat_na = rng.random(h.shape) < p
    return h * mat_na / p
