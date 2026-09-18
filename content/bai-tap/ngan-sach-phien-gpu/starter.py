import math


def ke_hoach_phien(so_epoch, phut_moi_epoch, gioi_han_phien, moi_n_epoch_luu):
    # 0. tham so <= 0 -> raise ValueError; phut_moi_epoch > gioi_han_phien -> raise ValueError
    # 1. epoch_moi_phien = so epoch chay TRON trong mot phien -> chia lay phan nguyen (//)
    # 2. so_phien = lam tron LEN (math.ceil) cua so_epoch / epoch_moi_phien
    # 3. epoch_mat_toi_da = min(moi_n_epoch_luu, epoch_moi_phien) - 1
    # 4. tra ve dict 4 khoa: epoch_moi_phien, so_phien, epoch_mat_toi_da, tong_phut
    raise NotImplementedError


def quota_con(quota_phut, cac_phien):
    # quota_phut am -> raise ValueError; phien co do dai <= 0 -> raise ValueError
    # Chay lan luot tung phien:
    #   phien dai hon quota con lai -> bi cat giua chung: tra ve (0, so phien TRON da chay, True)
    #   nguoc lai -> tru quota, dem them mot phien tron
    # Chay het danh sach -> (quota con lai, so phien, False)
    raise NotImplementedError
