def chay_theo_thu_tu(o, thu_tu):
    # 1. thu_tu co chi so lap -> raise ValueError; chi so ngoai [0, len(o)) -> raise ValueError
    # 2. bo_nho = set(); voi tung o theo thu_tu:
    #       kiem tra TAT CA ten trong o[i]["dung"] truoc,
    #       ten nao chua co trong bo_nho -> tra ve (ten, i, set(bo_nho))
    #    roi moi bo_nho |= set(o[i]["gan"])
    # 3. chay het -> tra ve (None, None, bo_nho)
    raise NotImplementedError


def restart_and_run_all(o):
    # chay dung tu tren xuong duoi: thu_tu = 0, 1, 2, ...
    raise NotImplementedError


def bien_con_sot(o, thu_tu):
    # ten bien co trong bo nho sau chay_theo_thu_tu nhung KHONG co sau restart_and_run_all
    # tra ve list da sap xep (sorted)
    raise NotImplementedError
