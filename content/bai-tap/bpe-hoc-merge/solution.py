from collections import Counter


def hoc_merge(dem_tu, so_merge):
    tu = {t: list(t) for t in dem_tu}
    merges = []
    for _ in range(so_merge):
        cap = Counter()
        for t, ky_tu in tu.items():
            for i in range(len(ky_tu) - 1):
                cap[(ky_tu[i], ky_tu[i + 1])] += dem_tu[t]
        if not cap:
            break
        (a, b), _ = cap.most_common(1)[0]
        merges.append((a, b))
        for t, ky_tu in tu.items():
            i, moi = 0, []
            while i < len(ky_tu):
                if i < len(ky_tu) - 1 and ky_tu[i] == a and ky_tu[i + 1] == b:
                    moi.append(a + b)
                    i += 2
                else:
                    moi.append(ky_tu[i])
                    i += 1
            tu[t] = moi
    return merges


def ap_dung(merges, tu):
    hang = {cap: i for i, cap in enumerate(merges)}
    ky_tu = list(tu)
    while len(ky_tu) > 1:
        tot, vt = None, -1
        for i in range(len(ky_tu) - 1):
            r = hang.get((ky_tu[i], ky_tu[i + 1]))
            if r is not None and (tot is None or r < tot):
                tot, vt = r, i
        if vt < 0:
            break
        ky_tu[vt:vt + 2] = [ky_tu[vt] + ky_tu[vt + 1]]
    return ky_tu
