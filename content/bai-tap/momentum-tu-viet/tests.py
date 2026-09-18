import numpy as np

BINH_PHUONG = lambda w: 2 * w   # L(w) = w²


def test_bon_buoc_tinh_tay():
    d = chay_momentum(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 4)
    mong_doi = [1.0, 0.8, 0.46, 0.062, -0.3086]
    got = [float(a[0]) for a in d]
    assert np.allclose(got, mong_doi), f"cần {mong_doi}, nhận {got}"


def test_do_dai_danh_sach():
    d = chay_momentum(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 7)
    assert len(d) == 8, f"T = 7 phải trả về 8 phần tử (kể cả điểm xuất phát), nhận {len(d)}"
    assert np.isclose(float(d[0][0]), 1.0), "phần tử đầu phải là w0"


def test_beta_0_thanh_sgd_thuong():
    # beta = 0 thì v = g, momentum trở lại đúng SGD: w nhân 0.8 mỗi bước
    d = chay_momentum(BINH_PHUONG, np.array([1.0]), 0.1, 0.0, 3)
    got = [float(a[0]) for a in d]
    assert np.allclose(got, [1.0, 0.8, 0.64, 0.512]), f"với beta = 0 cần [1, 0.8, 0.64, 0.512], nhận {got}"


def test_nhieu_chieu():
    # L = w0² + 2·w1², gradient = (2·w0, 4·w1)
    g = lambda w: np.array([2 * w[0], 4 * w[1]])
    d = chay_momentum(g, np.array([2.0, 1.0]), 0.1, 0.9, 2)
    assert np.allclose(d[1], [1.6, 0.6]), f"bước 1 cần [1.6, 0.6], nhận {d[1]}"
    assert np.allclose(d[2], [0.92, 0.0]), f"bước 2 cần [0.92, 0.0], nhận {d[2]}"


def test_khong_bi_alias():
    d = chay_momentum(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 3)
    assert not np.isclose(float(d[0][0]), float(d[1][0])), \
        "các phần tử trong danh sách đang cùng trỏ vào một mảng — nhớ dùng w.copy()"
