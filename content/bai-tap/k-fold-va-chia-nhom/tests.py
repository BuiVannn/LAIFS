import numpy as np

T = np.array([5, 1, 9, 3, 7])
NHOM = np.array(["A", "A", "B", "B", "B", "C"])


def test_chia_thoi_gian_vi_du_trong_de():
    tr, te = chia_thoi_gian(T, 2)
    assert list(tr) == [1, 3, 0], f"train cần [1,3,0] (mốc 1,3,5), nhận {list(tr)}"
    assert list(te) == [4, 2], f"test cần [4,2] (mốc 7,9 — hai mẫu mới nhất), nhận {list(te)}"


def test_chia_thoi_gian_test_luon_moi_hon_train():
    t = np.array([3.0, 1.0, 4.0, 1.5, 9.0, 2.6, 5.0, 3.5])
    for n_test in (1, 2, 3, 4):
        tr, te = chia_thoi_gian(t, n_test)
        assert len(te) == n_test, f"n_test = {n_test}: test phải có đúng {n_test} mẫu, nhận {len(te)}"
        assert len(tr) + len(te) == len(t), "train + test phải phủ hết dữ liệu"
        assert max(t[tr]) <= min(t[te]), f"n_test = {n_test}: mọi mẫu train phải CŨ hơn mọi mẫu test"


def test_chia_thoi_gian_khong_xao_tron_ngau_nhien():
    t = np.arange(10)
    tr, te = chia_thoi_gian(t, 3)
    assert list(te) == [7, 8, 9], f"dữ liệu đã xếp sẵn theo thời gian thì test là 3 chỉ số cuối, nhận {list(te)}"


def test_chia_theo_nhom_vi_du_trong_de():
    tr, te = chia_theo_nhom(NHOM, ["B"])
    assert list(tr) == [0, 1, 5], f"train cần [0,1,5], nhận {list(tr)}"
    assert list(te) == [2, 3, 4], f"test cần [2,3,4], nhận {list(te)}"


def test_chia_theo_nhom_khong_nhom_nao_nam_ca_hai_ben():
    for chon in (["A"], ["B", "C"], ["A", "C"]):
        tr, te = chia_theo_nhom(NHOM, chon)
        assert set(NHOM[tr]) & set(NHOM[te]) == set(), f"chọn {chon}: một nhóm không được nằm ở cả train lẫn test"
        assert len(tr) + len(te) == len(NHOM), f"chọn {chon}: phải phủ hết dữ liệu"
        assert set(NHOM[te]) == set(chon), f"chọn {chon}: test phải gồm đúng các nhóm được chọn"


def test_cua_so_tien_vi_du_trong_de():
    vong = cua_so_tien(10, 4)
    assert len(vong) == 4, f"k = 4 phải cho 4 vòng, nhận {len(vong)}"
    assert list(vong[0][0]) == [0, 1] and list(vong[0][1]) == [2, 3], f"vòng 1 sai: {vong[0]}"
    assert list(vong[3][0]) == [0, 1, 2, 3, 4, 5, 6, 7] and list(vong[3][1]) == [8, 9], f"vòng 4 sai: {vong[3]}"


def test_cua_so_tien_khong_train_o_tuong_lai():
    for n, k in ((10, 4), (12, 3), (21, 6)):
        for j, (tr, va) in enumerate(cua_so_tien(n, k)):
            assert max(tr) < min(va), f"n={n} k={k} vòng {j}: train chứa mẫu MỚI hơn val — rò rỉ thời gian"
            assert set(tr) & set(va) == set(), f"n={n} k={k} vòng {j}: train và val giao nhau"


def test_cua_so_tien_train_no_dan():
    vong = cua_so_tien(20, 5)
    kich_thuoc = [len(tr) for tr, _ in vong]
    assert kich_thuoc == sorted(kich_thuoc) and kich_thuoc[0] < kich_thuoc[-1], f"train phải nở dần qua các vòng, nhận {kich_thuoc}"
