def chay_theo_thu_tu(o, thu_tu):
    if len(set(thu_tu)) != len(thu_tu):
        raise ValueError("thu_tu co o bi lap")
    bo_nho = set()
    for i in thu_tu:
        if not 0 <= i < len(o):
            raise ValueError(f"chi so o khong hop le: {i}")
        for ten in o[i]["dung"]:
            if ten not in bo_nho:
                return (ten, i, set(bo_nho))
        bo_nho |= set(o[i]["gan"])
    return (None, None, bo_nho)


def restart_and_run_all(o):
    return chay_theo_thu_tu(o, list(range(len(o))))


def bien_con_sot(o, thu_tu):
    _, _, sau_khi_chay = chay_theo_thu_tu(o, thu_tu)
    _, _, sau_khi_restart = restart_and_run_all(o)
    return sorted(sau_khi_chay - sau_khi_restart)
