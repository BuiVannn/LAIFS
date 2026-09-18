from itertools import zip_longest

TOAN_TU = ("~=", "==", "!=", ">=", "<=", ">", "<")


def _tach(pb):
    return [int(x) for x in pb.strip().split(".")]


def so_sanh(a, b):
    for x, y in zip_longest(_tach(a), _tach(b), fillvalue=0):
        if x < y:
            return -1
        if x > y:
            return 1
    return 0


def thoa_man(phien_ban, rang_buoc):
    rang_buoc = rang_buoc.strip()
    for tt in TOAN_TU:
        if rang_buoc.startswith(tt):
            moc = rang_buoc[len(tt):].strip()
            break
    else:
        raise ValueError(f"rang buoc khong hop le: {rang_buoc!r}")

    kq = so_sanh(phien_ban, moc)
    if tt == "==":
        return kq == 0
    if tt == "!=":
        return kq != 0
    if tt == ">=":
        return kq >= 0
    if tt == "<=":
        return kq <= 0
    if tt == ">":
        return kq > 0
    if tt == "<":
        return kq < 0
    # ~= : lon hon hay bang moc, va van cung nhanh (bo thanh phan cuoi cua moc)
    nhanh = _tach(moc)[:-1]
    return kq >= 0 and _tach(phien_ban)[:len(nhanh)] == nhanh
