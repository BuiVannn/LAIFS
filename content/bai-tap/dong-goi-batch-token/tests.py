import numpy as np

BATCH = [[101, 5, 6, 102], [101, 7, 102], [101, 8, 9, 10, 11, 102]]


def test_shape_theo_chuoi_dai_nhat_sau_khi_cat():
    ids, mask = dong_goi(BATCH, max_length=10)
    assert ids.shape == (3, 6), (
        f"chuoi dai nhat co 6 token va max_length=10 khong cat gi, nen shape la (3, 6), nhan {ids.shape}"
    )
    assert mask.shape == (3, 6), f"mask phai cung shape voi input_ids, nhan {mask.shape}"


def test_khong_dem_thua_toi_max_length():
    ids, _ = dong_goi(BATCH, max_length=50)
    assert ids.shape == (3, 6), (
        f"dem toi chuoi DAI NHAT trong batch, khong phai toi max_length, nhan {ids.shape}"
    )


def test_noi_dung_va_pad():
    ids, mask = dong_goi(BATCH, max_length=10, pad_id=0)
    assert list(ids[1]) == [101, 7, 102, 0, 0, 0], f"hang 2 phai duoc dem 0 o cuoi, nhan {list(ids[1])}"
    assert list(mask[1]) == [1, 1, 1, 0, 0, 0], f"mask 1 o token that, 0 o pad, nhan {list(mask[1])}"
    assert list(ids[2]) == [101, 8, 9, 10, 11, 102], f"hang dai nhat khong bi dem, nhan {list(ids[2])}"
    assert list(mask[2]) == [1, 1, 1, 1, 1, 1], f"nhan {list(mask[2])}"


def test_pad_id_khac_0():
    ids, mask = dong_goi(BATCH, max_length=10, pad_id=1)
    assert list(ids[1]) == [101, 7, 102, 1, 1, 1], f"pad_id=1 phai duoc dung lam gia tri dem, nhan {list(ids[1])}"
    assert list(mask[1]) == [1, 1, 1, 0, 0, 0], (
        f"mask KHONG duoc suy ra tu 'id == 0': voi pad_id=1 cach do sai het, nhan {list(mask[1])}"
    )


def test_cat_bot_khi_qua_dai():
    ids, mask = dong_goi(BATCH, max_length=3)
    assert ids.shape == (3, 3), f"cat con 3 token nen shape la (3, 3), nhan {ids.shape}"
    assert list(ids[2]) == [101, 8, 9], f"cat tu DAU chuoi giu 3 token dau, nhan {list(ids[2])}"
    assert mask.sum() == 9, f"ca 3 hang deu day 3 token that nen tong mask = 9, nhan {mask.sum()}"


def test_mot_chuoi_duy_nhat():
    ids, mask = dong_goi([[1, 2]], max_length=5)
    assert ids.shape == (1, 2) and list(mask[0]) == [1, 1], f"nhan {ids.shape}, {list(mask[0])}"


def test_kieu_du_lieu_la_so_nguyen():
    ids, mask = dong_goi(BATCH, max_length=10)
    assert np.issubdtype(np.asarray(ids).dtype, np.integer), f"input_ids phai la so nguyen, nhan {np.asarray(ids).dtype}"
    assert np.issubdtype(np.asarray(mask).dtype, np.integer), f"attention_mask phai la so nguyen, nhan {np.asarray(mask).dtype}"


def test_bat_dau_vao_hong():
    for goi in (lambda: dong_goi(BATCH, max_length=0), lambda: dong_goi([], max_length=5)):
        loi = None
        try:
            goi()
        except ValueError as e:
            loi = e
        assert loi is not None, "max_length = 0 hoac batch rong phai raise ValueError"


def test_byte_attention():
    # (8, 12, 512, 512) x 4 byte
    assert byte_attention(8, 12, 512, 4) == 100_663_296, f"nhan {byte_attention(8, 12, 512, 4)}"
    assert byte_attention(1, 1, 10) == 400, f"mac dinh 4 byte moi so: 1*1*10*10*4 = 400, nhan {byte_attention(1, 1, 10)}"


def test_byte_attention_tang_binh_phuong_theo_do_dai():
    a = byte_attention(4, 8, 256)
    b = byte_attention(4, 8, 512)
    assert b == 4 * a, f"gap doi do dai phai gap BON lan bo nho (binh phuong), nhan {b} so voi {a}"


def test_byte_attention_bat_tham_so_vo_ly():
    loi = None
    try:
        byte_attention(0, 8, 512)
    except ValueError as e:
        loi = e
    assert loi is not None, "tham so khong duong phai raise ValueError"


def test_do_dai_toi_da_lam_tron_xuong():
    # 15 GB cho ma tran chu y, batch 8, 12 dau, float32
    L = do_dai_toi_da(15 * 1024**3, batch=8, so_dau=12, byte_moi_so=4)
    assert byte_attention(8, 12, L, 4) <= 15 * 1024**3, f"do dai {L} phai con vua bo nho"
    assert byte_attention(8, 12, L + 1, 4) > 15 * 1024**3, f"do dai {L} + 1 phai vuot bo nho — ban lam tron len roi"


def test_do_dai_toi_da_khop_nguoc_voi_byte_attention():
    byte = byte_attention(2, 4, 128, 4)
    assert do_dai_toi_da(byte, batch=2, so_dau=4, byte_moi_so=4) == 128, (
        f"vua khit thi phai tra ve dung 128, nhan {do_dai_toi_da(byte, batch=2, so_dau=4, byte_moi_so=4)}"
    )
