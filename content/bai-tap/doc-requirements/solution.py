TOAN_TU = ("~=", "==", "!=", ">=", "<=", ">", "<")


def _chuan_hoa(ten):
    return ten.strip().lower().replace("_", "-")


def doc_requirements(text):
    ket_qua = []
    for dong in text.splitlines():
        dong = dong.split("#")[0].strip()
        if not dong:
            continue
        for tt in TOAN_TU:
            if tt in dong:
                ten, _, pb = dong.partition(tt)
                ket_qua.append((_chuan_hoa(ten), tt, pb.strip()))
                break
        else:
            ket_qua.append((_chuan_hoa(dong), "", ""))
    return ket_qua


def soat(text):
    reqs = doc_requirements(text)
    tat_ca = [ten for ten, _, _ in reqs]
    khong_pin = [ten for ten, tt, _ in reqs if tt != "=="]
    da_thay, trung_ten = set(), []
    for ten in tat_ca:
        if ten in da_thay and ten not in trung_ten:
            trung_ten.append(ten)
        da_thay.add(ten)
    return {"khong_pin": khong_pin, "trung_ten": trung_ten, "tat_ca": tat_ca}
