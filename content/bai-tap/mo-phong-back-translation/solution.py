def sinh_cap_gia(don_ngu, mo_hinh_nguoc):
    # Câu người viết nằm ở PHÍA ĐÍCH; câu máy sinh nằm ở phía nguồn
    return [(mo_hinh_nguoc(c), c) for c in don_ngu]


def loc_theo_ti_le_dai(cap, min_ti=0.5, max_ti=2.0):
    giu = []
    for nguon, dich in cap:
        a, b = len(nguon.split()), len(dich.split())
        if a == 0 or b == 0:
            continue
        if min_ti <= a / b <= max_ti:
            giu.append((nguon, dich))
    return giu


def tron_du_lieu(song_ngu, cap_gia, lap_that=1):
    du_lieu = list(song_ngu) * lap_that + list(cap_gia)
    ti_le_gia = len(cap_gia) / len(du_lieu) if du_lieu else 0.0
    return du_lieu, ti_le_gia
