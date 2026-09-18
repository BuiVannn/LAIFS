import numpy as np

PI = np.array([3, 7, 0, 9, 4, 1, 8, 2, 6, 5])
X = np.array([[1.0, 0], [2, 1], [3, 0], [4, 1], [5, 0],
              [5, 0], [1, 0], [6, 1], [7, 0], [8, 1]])


def test_chia_vi_du_trong_de():
    tr, va, te = chia(PI, (0.6, 0.2, 0.2))
    assert list(tr) == [3, 7, 0, 9, 4, 1], f"train cần [3,7,0,9,4,1], nhận {list(tr)}"
    assert list(va) == [8, 2], f"val cần [8,2], nhận {list(va)}"
    assert list(te) == [6, 5], f"test cần [6,5], nhận {list(te)}"


def test_chia_khong_mat_mau_va_khong_giao_nhau():
    for n, tl in ((10, (0.6, 0.2, 0.2)), (13, (0.7, 0.15, 0.15)), (100, (0.8, 0.1, 0.1))):
        p = np.arange(n)
        tr, va, te = chia(p, tl)
        assert len(tr) + len(va) + len(te) == n, f"n = {n}: tổng ba tập phải bằng {n}, nhận {len(tr) + len(va) + len(te)}"
        assert len(set(tr) | set(va) | set(te)) == n, f"n = {n}: ba tập phải rời nhau và phủ hết"
        assert len(tr) > len(va) and len(tr) > len(te), f"n = {n}: train phải là tập lớn nhất"


def test_chia_giu_thu_tu_cua_pi():
    tr, va, te = chia(PI, (0.6, 0.2, 0.2))
    assert list(tr) + list(va) + list(te) == list(PI), "ba tập ghép lại phải ra đúng pi ban đầu"


def test_trung_lap_vi_du_trong_de():
    assert trung_lap(X, [3, 7, 0, 9, 4, 1], [6, 5]) == [5, 6], f"cần [5, 6], nhận {trung_lap(X, [3, 7, 0, 9, 4, 1], [6, 5])}"


def test_trung_lap_khong_co_gi_trung():
    assert trung_lap(X, [0, 1, 2], [3, 7]) == [], "không có hàng nào trùng thì phải trả về danh sách rỗng"


def test_trung_lap_so_sanh_noi_dung_khong_phai_chi_so():
    A, B = [0], [6]
    assert set(A) & set(B) == set(), "hai tập chỉ số này KHÔNG giao nhau"
    assert trung_lap(X, A, B) == [6], "nhưng hàng 6 trùng nội dung hàng 0, phải bị bắt"


def test_k_fold_vi_du_trong_de():
    fold = k_fold(PI, 5)
    assert len(fold) == 5, f"k = 5 phải cho 5 cặp, nhận {len(fold)}"
    tr, va = fold[0]
    assert list(va) == [3, 7], f"val vòng 1 cần [3,7], nhận {list(va)}"
    assert list(tr) == [0, 9, 4, 1, 8, 2, 6, 5], f"train vòng 1 cần [0,9,4,1,8,2,6,5], nhận {list(tr)}"
    assert list(fold[4][1]) == [6, 5], f"val vòng 5 cần [6,5], nhận {list(fold[4][1])}"


def test_k_fold_moi_mau_lam_val_dung_mot_lan():
    dem = {}
    for tr, va in k_fold(PI, 5):
        assert set(tr) & set(va) == set(), "train và val trong cùng một vòng không được giao nhau"
        assert len(tr) + len(va) == len(PI), "train + val mỗi vòng phải phủ hết dữ liệu"
        for i in va:
            dem[int(i)] = dem.get(int(i), 0) + 1
    assert dem == {int(i): 1 for i in PI}, f"mỗi mẫu phải làm val đúng 1 lần, nhận {dem}"
