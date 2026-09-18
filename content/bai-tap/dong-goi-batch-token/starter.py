import numpy as np


def dong_goi(cac_chuoi, max_length, pad_id=0):
    # max_length <= 0 hoac batch rong -> raise ValueError
    # 1. cat moi chuoi con toi da max_length token: list(c)[:max_length]
    # 2. L = do dai LON NHAT SAU KHI CAT (khong phai max_length)
    # 3. input_ids: mang (N, L) dtype int, dien san pad_id
    #    attention_mask: mang (N, L) dtype int, dien san 0
    # 4. voi tung chuoi: chep token vao dau hang, dat mask = 1 dung o do
    raise NotImplementedError


def byte_attention(batch, so_dau, do_dai, byte_moi_so=4):
    # Ma tran diem chu y co shape (batch, so_dau, do_dai, do_dai)
    # Tra ve so byte cua no. Tham so khong duong -> raise ValueError
    raise NotImplementedError


def do_dai_toi_da(byte_cho_phep, batch, so_dau, byte_moi_so=4):
    # Dao nguoc ham tren: do dai lon nhat ma ma tran chu y con vua byte_cho_phep.
    # Nho lam tron XUONG (np.floor) roi doi sang int.
    raise NotImplementedError
