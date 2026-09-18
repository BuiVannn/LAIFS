import math


def ke_hoach_phien(so_epoch, phut_moi_epoch, gioi_han_phien, moi_n_epoch_luu):
    if so_epoch <= 0 or phut_moi_epoch <= 0 or gioi_han_phien <= 0 or moi_n_epoch_luu <= 0:
        raise ValueError("moi tham so phai la so duong")
    if phut_moi_epoch > gioi_han_phien:
        raise ValueError("mot epoch khong chay tron trong mot phien")
    epoch_moi_phien = int(gioi_han_phien // phut_moi_epoch)
    so_phien = math.ceil(so_epoch / epoch_moi_phien)
    epoch_mat_toi_da = min(moi_n_epoch_luu, epoch_moi_phien) - 1
    return {
        "epoch_moi_phien": epoch_moi_phien,
        "so_phien": so_phien,
        "epoch_mat_toi_da": epoch_mat_toi_da,
        "tong_phut": so_epoch * phut_moi_epoch,
    }


def quota_con(quota_phut, cac_phien):
    if quota_phut < 0:
        raise ValueError("quota khong the am")
    con = quota_phut
    tron = 0
    for phut in cac_phien:
        if phut <= 0:
            raise ValueError("do dai phien phai duong")
        if phut > con:
            return (0, tron, True)
        con -= phut
        tron += 1
    return (con, tron, False)
