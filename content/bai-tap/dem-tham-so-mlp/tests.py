# dot-bien-bo-qua: đổi hằng số — độ lệch chuẩn khởi tạo 0.1 hay 0.11 đều hợp lệ
import numpy as np


def test_dem_tham_so():
    for kien_truc, dung in (([2, 3, 1], 13), ([784, 128, 10], 101770), ([3, 4, 4, 2], 46), ([5, 1], 6)):
        kq = dem_tham_so(kien_truc)
        assert kq == dung, f"{kien_truc}: cần {dung} tham số, nhận {kq}. Nhớ cộng cả bias"


def test_khoi_tao_shape():
    lop = khoi_tao([3, 4, 4, 2])
    assert len(lop) == 3, f"mạng 3-4-4-2 có 3 lớp tham số, nhận {len(lop)}"
    dung = [((4, 3), (4,)), ((4, 4), (4,)), ((2, 4), (2,))]
    nhan = [(np.shape(W), np.shape(b)) for W, b in lop]
    assert nhan == dung, f"shape (W, b) cần {dung}, nhận {nhan}"


def test_khoi_tao_gia_tri():
    lop = khoi_tao([10, 50, 3], seed=1)
    assert all(np.all(b == 0) for _, b in lop), "bias phải khởi tạo bằng 0"
    W = lop[0][0]
    assert 0 < np.std(W) < 0.5, f"W phải là số ngẫu nhiên nhỏ (độ lệch chuẩn 0.1), nhận std = {np.std(W):.3f}"
    tong = sum(np.size(W) + np.size(b) for W, b in lop)
    assert tong == dem_tham_so([10, 50, 3]), "tổng số phần tử của các W, b phải bằng dem_tham_so"


def test_chuoi_shape():
    kq = [tuple(s) for s in chuoi_shape([2, 3, 1], 5)]
    assert kq == [(5, 2), (5, 3), (5, 1)], f"cần [(5, 2), (5, 3), (5, 1)], nhận {kq}"
    kq = [tuple(s) for s in chuoi_shape([10, 20, 3], 32)]
    assert kq == [(32, 10), (32, 20), (32, 3)], f"batch 32 qua 10-20-3: nhận {kq}"


def test_shape_khop_phep_nhan_ma_tran():
    # Kiểm tra shape từ khoi_tao đi được qua phép nhân ma trận X @ W.T + b
    X = np.ones((7, 4))
    a = X
    for W, b in khoi_tao([4, 6, 2]):
        a = a @ W.T + b
    assert a.shape == (7, 2), f"batch 7 mẫu qua mạng 4-6-2 phải ra (7, 2), nhận {a.shape}"
