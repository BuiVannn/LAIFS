import numpy as np

BINH_PHUONG = lambda w: 2 * w   # L(w) = w²


def test_bon_buoc_tinh_tay():
    d = chay_rmsprop(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 4)
    mong_doi = [1.0, 0.683772, 0.498871, 0.369181, 0.272825]
    got = [float(a[0]) for a in d]
    assert np.allclose(got, mong_doi, atol=1e-6), f"cần {mong_doi}, nhận {got}"


def test_buoc_dau_khong_phu_thuoc_do_lon_gradient():
    # s khởi tạo 0 → bước 1 luôn dài eta/sqrt(1-beta) = 0.3162, dù gradient to hay bé
    for k in (1000.0, 0.01):
        d = chay_rmsprop(lambda w: k * w, np.array([1.0]), 0.1, 0.9, 1)
        buoc = 1.0 - float(d[1][0])
        assert np.isclose(buoc, 0.3162277660, atol=1e-5), \
            f"với gradient hệ số {k}, bước đầu cần 0.31623, nhận {buoc}"


def test_do_dai_danh_sach():
    d = chay_rmsprop(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 5)
    assert len(d) == 6, f"T = 5 phải trả về 6 phần tử, nhận {len(d)}"
    assert np.isclose(float(d[0][0]), 1.0), "phần tử đầu phải là w0"


def test_tung_tham_so_co_thang_do_rieng():
    # Hai chiều có gradient chênh nhau 50 lần nhưng bước đầu phải bằng nhau
    g = lambda w: np.array([2 * w[0], 100 * w[1]])
    d = chay_rmsprop(g, np.array([1.0, 1.0]), 0.1, 0.9, 1)
    assert np.allclose(d[1], [0.6837722, 0.6837722], atol=1e-6), \
        f"hai chiều phải đi bước bằng nhau, nhận {d[1]}"


def test_khong_bi_alias():
    d = chay_rmsprop(BINH_PHUONG, np.array([1.0]), 0.1, 0.9, 3)
    assert not np.isclose(float(d[0][0]), float(d[1][0])), \
        "các phần tử trong danh sách đang cùng trỏ vào một mảng — nhớ dùng w.copy()"
