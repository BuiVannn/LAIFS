import numpy as np


def cap_ke_tiep(tokens):
    return [(tuple(tokens[:i]), tokens[i]) for i in range(1, len(tokens))]


def cap_bi_che(tokens, ky_hieu="[CHE]"):
    cap = []
    for i in range(len(tokens)):
        che = list(tokens)
        che[i] = ky_hieu
        cap.append((tuple(che), tokens[i]))
    return cap


def so_cap(do_dai):
    return np.maximum(do_dai - 1, 0)
