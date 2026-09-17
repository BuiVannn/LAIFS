import math
from collections import Counter


def _ngram(tu, n):
    return Counter(tuple(tu[i:i + n]) for i in range(len(tu) - n + 1))


def precision_ngram(ban_dich, tham_chieu, n):
    c = _ngram(ban_dich.split(), n)
    r = _ngram(tham_chieu.split(), n)
    khop = sum(min(so, r[g]) for g, so in c.items())
    return khop, sum(c.values())


def brevity_penalty(do_dai_ban_dich, do_dai_tham_chieu):
    c, r = do_dai_ban_dich, do_dai_tham_chieu
    if c == 0:
        return 0.0
    return 1.0 if c > r else math.exp(1 - r / c)


def bleu(ban_dich, tham_chieu, n_max=4):
    ps = [precision_ngram(ban_dich, tham_chieu, n) for n in range(1, n_max + 1)]
    if any(tong == 0 or khop == 0 for khop, tong in ps):
        return 0.0
    bp = brevity_penalty(len(ban_dich.split()), len(tham_chieu.split()))
    tb = math.exp(sum(math.log(khop / tong) for khop, tong in ps) / n_max)
    return 100.0 * bp * tb
