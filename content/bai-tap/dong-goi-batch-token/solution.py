import numpy as np


def dong_goi(cac_chuoi, max_length, pad_id=0):
    if max_length <= 0:
        raise ValueError("max_length phai duong")
    if len(cac_chuoi) == 0:
        raise ValueError("batch rong")
    cat = [list(c)[:max_length] for c in cac_chuoi]
    L = max(len(c) for c in cat)
    input_ids = np.full((len(cat), L), pad_id, dtype=np.int64)
    attention_mask = np.zeros((len(cat), L), dtype=np.int64)
    for i, c in enumerate(cat):
        input_ids[i, : len(c)] = c
        attention_mask[i, : len(c)] = 1
    return input_ids, attention_mask


def byte_attention(batch, so_dau, do_dai, byte_moi_so=4):
    if min(batch, so_dau, do_dai, byte_moi_so) <= 0:
        raise ValueError("moi tham so phai duong")
    return batch * so_dau * do_dai * do_dai * byte_moi_so


def do_dai_toi_da(byte_cho_phep, batch, so_dau, byte_moi_so=4):
    moi_o = batch * so_dau * byte_moi_so
    if moi_o <= 0:
        raise ValueError("moi tham so phai duong")
    return int(np.floor(np.sqrt(byte_cho_phep / moi_o)))
