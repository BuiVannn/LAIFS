import numpy as np

X = np.array([1.0, 2.0, 3.0, 4.0])
Y = np.array([2.0, 4.0, 6.0, 8.0])


def test_mot_batch_duy_nhat_bang_full_batch():
    # B = n: chỉ có 1 nhóm nên thứ tự xáo không ảnh hưởng.
    # Tại w = 0: sai số = [-2,-4,-6,-8], nhân x = [-2,-8,-18,-32], grad = 2*mean = -30
    # w = 0 - 0.01*(-30) = 0.3
    w = mot_epoch(X, Y, 0.0, 0.01, 4, np.random.default_rng(3))
    assert np.isclose(w, 0.3), f"với B = n phải ra 0.3 (một bước full-batch), nhận {w}"


def test_hai_mini_batch_theo_seed():
    # Mỗi seed cho một thứ tự xáo khác nhau, nên kết quả khác nhau.
    # Ba giá trị này tính sẵn từ ba thứ tự tương ứng.
    ket_qua = {0: 0.56, 1: 0.575, 4: 0.5558}
    for seed, mong_doi in ket_qua.items():
        w = mot_epoch(X, Y, 0.0, 0.01, 2, np.random.default_rng(seed))
        assert np.isclose(w, mong_doi), f"seed {seed}: cần {mong_doi}, nhận {w}"


def test_co_cap_nhat_giua_epoch():
    # Nếu tính cả hai gradient tại w đầu epoch rồi mới cập nhật, seed 1 sẽ ra 0.3 chứ không phải 0.575.
    w = mot_epoch(X, Y, 0.0, 0.01, 2, np.random.default_rng(1))
    assert not np.isclose(w, 0.3), "w phải được cập nhật NGAY sau mỗi nhóm, không dồn tới cuối epoch"
    assert np.isclose(w, 0.575), f"seed 1 cần 0.575, nhận {w}"


def test_nhom_cuoi_bi_le_van_duoc_dung():
    # n = 6, B = 4 → nhóm 2 chỉ có 2 mẫu. Mẫu x = 100 có ảnh hưởng rất lớn,
    # nên bỏ nhóm lẻ sẽ cho kết quả khác hẳn.
    x6 = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 100.0])
    w = mot_epoch(x6, 2 * x6, 0.0, 1e-5, 4, np.random.default_rng(2))
    assert np.isclose(w, 0.100594975), f"cần 0.100594975 (dùng đủ 6 mẫu), nhận {w}"


def test_tra_ve_float():
    w = mot_epoch(X, Y, 0.0, 0.01, 2, np.random.default_rng(0))
    assert isinstance(w, float), f"cần trả về float, nhận {type(w).__name__}"
