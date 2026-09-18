import numpy as np

H = np.array([[2.0, 4.0, 6.0, 8.0]])


def test_eval_tra_ve_y_nguyen():
    rng = np.random.default_rng(0)
    ra = dropout_xuoi(H, 0.5, rng, False)
    assert np.array_equal(ra, H), f"lúc đánh giá phải trả về h y nguyên, nhận {ra}"


def test_mat_na_dung_theo_rng():
    # Cùng hạt giống thì mặt nạ phải trùng: rng.random(h.shape) < p
    mong_doi = H * (np.random.default_rng(3).random(H.shape) < 0.5) / 0.5
    ra = dropout_xuoi(H, 0.5, np.random.default_rng(3), True)
    assert np.allclose(ra, mong_doi), f"cần {mong_doi}, nhận {ra} — nhớ chia cho p"


def test_gia_tri_song_bi_phong_len():
    ra = dropout_xuoi(H, 0.5, np.random.default_rng(3), True)
    song = ra != 0
    assert np.allclose(ra[song], 2 * H[song]), \
        f"với p = 0.5, mỗi giá trị sống phải là h/0.5 = gấp đôi h, nhận {ra} so với h = {H}"


def test_ky_vong_khong_doi_giua_train_va_eval():
    rng = np.random.default_rng(7)
    lo = np.repeat(H, 200000, axis=0)
    for p in (0.5, 0.8, 0.9):
        tb = dropout_xuoi(lo, p, rng, True).mean(axis=0)
        assert np.allclose(tb, H[0], atol=0.05), \
            f"p = {p}: kỳ vọng đầu ra lúc train phải bằng h lúc eval {H[0]}, nhận {np.round(tb, 4)} — thiếu phép chia cho p?"


def test_ty_le_tat_dung_va_mat_na_doc_lap_tung_phan_tu():
    rng = np.random.default_rng(11)
    lo = np.ones((4000, 50))
    ra = dropout_xuoi(lo, 0.8, rng, True)
    assert abs((ra == 0).mean() - 0.2) < 0.01, f"p = 0.8 phải tắt khoảng 20%, nhận {(ra == 0).mean():.4f}"
    so_kieu_hang = len({r.tobytes() for r in (ra == 0)})
    assert so_kieu_hang > 3000, \
        f"mỗi mẫu trong batch phải có mặt nạ RIÊNG, nhận {so_kieu_hang} kiểu hàng khác nhau trên 4000 mẫu"


def test_p_bang_1_khong_tat_gi():
    ra = dropout_xuoi(H, 1.0, np.random.default_rng(1), True)
    assert np.allclose(ra, H), f"p = 1.0 (giữ hết) phải trả về h y nguyên, nhận {ra}"
