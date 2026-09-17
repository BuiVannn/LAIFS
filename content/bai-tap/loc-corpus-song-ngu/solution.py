DAU_CAU = " .,!?;:"


def chuan_hoa(cau):
    return " ".join(cau.split()).lower().strip(DAU_CAU)


def loc_corpus(cap_cau, tap_test, ti_le_toi_da=3.0):
    nguon_test = {chuan_hoa(n) for n, _ in tap_test}
    dich_test = {chuan_hoa(d) for _, d in tap_test}

    giu_lai = []
    da_thay = set()
    thong_ke = {"rong": 0, "trung_nhau": 0, "ti_le_do_dai": 0, "ro_ri_test": 0, "trung_lap": 0}

    for nguon, dich in cap_cau:
        n, d = chuan_hoa(nguon), chuan_hoa(dich)
        if not n or not d:
            thong_ke["rong"] += 1
            continue
        if n == d:
            thong_ke["trung_nhau"] += 1
            continue
        a, b = len(n.split()), len(d.split())
        if max(a, b) / min(a, b) > ti_le_toi_da:
            thong_ke["ti_le_do_dai"] += 1
            continue
        if n in nguon_test or d in dich_test:
            thong_ke["ro_ri_test"] += 1
            continue
        if (n, d) in da_thay:
            thong_ke["trung_lap"] += 1
            continue
        da_thay.add((n, d))
        giu_lai.append((nguon, dich))

    return giu_lai, thong_ke
