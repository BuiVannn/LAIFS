import numpy as np

BINH_PHUONG = lambda w: 2 * w   # L(w) = w²


def test_bon_buoc_tinh_tay():
    d = chay_adam(BINH_PHUONG, np.array([1.0]), 0.1, 4)
    mong_doi = [1.0, 0.9, 0.800412, 0.701586, 0.603939]
    got = [float(a[0]) for a in d]
    assert np.allclose(got, mong_doi, atol=1e-6), f"cần {mong_doi}, nhận {got}"


def test_hieu_chinh_thien_lech_o_buoc_1():
    # Nhờ hiệu chỉnh, bước đầu dài ĐÚNG bằng lr dù gradient to hay bé.
    # Quên hiệu chỉnh thì bước đầu là 3.162 * lr.
    for k in (1000.0, 0.01):
        d = chay_adam(lambda w: k * w, np.array([1.0]), 0.1, 1)
        buoc = 1.0 - float(d[1][0])
        assert np.isclose(buoc, 0.1, atol=1e-5), \
            f"với gradient hệ số {k}, bước đầu cần đúng lr = 0.1, nhận {buoc} — nhiều khả năng thiếu hiệu chỉnh thiên lệch"


def test_hieu_chinh_con_tac_dung_o_buoc_2():
    # Bước 2 vẫn cần hiệu chỉnh (1 - 0.9² và 1 - 0.999²); bỏ đi sẽ lệch rõ.
    d = chay_adam(BINH_PHUONG, np.array([1.0]), 0.1, 2)
    buoc2 = float(d[1][0]) - float(d[2][0])
    assert np.isclose(buoc2, 0.0995879, atol=1e-6), f"bước 2 cần 0.0995879, nhận {buoc2}"


def test_khong_phu_thuoc_thang_do_gradient():
    # Hai chiều gradient chênh 10 lần nhưng Adam đi bước bằng nhau
    g = lambda w: np.array([2 * w[0], 20 * w[1]])
    d = chay_adam(g, np.array([1.0, 1.0]), 0.1, 2)
    assert np.allclose(d[1], [0.9, 0.9], atol=1e-6), f"bước 1 cần [0.9, 0.9], nhận {d[1]}"
    assert np.allclose(d[2], [0.800412, 0.800412], atol=1e-6), f"bước 2 cần [0.800412, 0.800412], nhận {d[2]}"


def test_do_dai_danh_sach_va_khong_alias():
    d = chay_adam(BINH_PHUONG, np.array([1.0]), 0.1, 5)
    assert len(d) == 6, f"T = 5 phải trả về 6 phần tử, nhận {len(d)}"
    assert np.isclose(float(d[0][0]), 1.0), "phần tử đầu phải là w0"
    assert not np.isclose(float(d[0][0]), float(d[1][0])), \
        "các phần tử đang cùng trỏ vào một mảng — nhớ dùng w.copy()"
