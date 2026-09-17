import numpy as np


def giai_ma_greedy(bang, so_buoc):
    tien_to, log_prob = (), 0.0
    for _ in range(so_buoc):
        token, p = max(bang[tien_to].items(), key=lambda kv: kv[1])
        tien_to += (token,)
        log_prob += np.log(p)
    return list(tien_to), log_prob


def beam_search(bang, k, so_buoc):
    beams = [((), 0.0)]
    for _ in range(so_buoc):
        ung_vien = []
        for tien_to, log_prob in beams:
            for token, p in bang[tien_to].items():
                ung_vien.append((tien_to + (token,), log_prob + np.log(p)))
        ung_vien.sort(key=lambda x: -x[1])
        beams = ung_vien[:k]
    return [(list(t), lp) for t, lp in beams]
