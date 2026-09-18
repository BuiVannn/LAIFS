import numpy as np


def test_shape():
    W = khoi_tao(784, 128, "he", np.random.default_rng(0))
    assert W.shape == (784, 128), f"shape phải là (n_in, n_out) = (784, 128), nhận {W.shape}"


def test_do_lech_chuan_xavier():
    # 256 -> 256: sqrt(2/512) = 1/16 = 0.0625
    W = khoi_tao(256, 256, "xavier", np.random.default_rng(0))
    assert np.isclose(W.std(), 0.0625, rtol=0.02), f"Xavier 256->256 cần std ≈ 0.0625, nhận {W.std():.5f}"
    assert abs(W.mean()) < 0.002, f"kỳ vọng phải ≈ 0, nhận {W.mean():.5f}"


def test_do_lech_chuan_he():
    # 784 -> 128: He chỉ dùng n_in, sqrt(2/784) = 0.050508 (Xavier ở đây sẽ là 0.0439)
    W = khoi_tao(784, 128, "he", np.random.default_rng(1))
    assert np.isclose(W.std(), 0.050508, rtol=0.02), \
        f"He 784->128 cần std ≈ 0.05051 (chỉ dùng n_in), nhận {W.std():.5f}"


def test_do_lech_chuan_so_cu_the():
    W = khoi_tao(100, 100, 0.01, np.random.default_rng(2))
    assert np.isclose(W.std(), 0.01, rtol=0.05), f"kiểu số 0.01 cần std ≈ 0.01, nhận {W.std():.5f}"


def test_he_giu_phuong_sai_qua_20_lop():
    ps = do_phuong_sai("he")
    assert len(ps) == 20, f"cần 20 giá trị (mỗi lớp một), nhận {len(ps)}"
    assert 1.5 < ps[0] < 2.5, f"lớp 1 với He phải ≈ 2 (= n · 2/n · 1), nhận {ps[0]:.4f}"
    assert 0.3 < ps[19] / ps[0] < 3, f"He phải GIỮ phương sai; tỉ lệ lớp20/lớp1 = {ps[19] / ps[0]:.3g}"


def test_xavier_tat_dan_mot_nua_moi_lop():
    ps = do_phuong_sai("xavier")
    assert 0.7 < ps[0] < 1.4, f"lớp 1 với Xavier phải ≈ 1, nhận {ps[0]:.4f}"
    assert ps[19] / ps[0] < 1e-4, f"Xavier + ReLU phải tắt dần; tỉ lệ lớp20/lớp1 = {ps[19] / ps[0]:.3g}"
    ti_le = [ps[i + 1] / ps[i] for i in range(6)]
    assert all(0.3 < r < 0.8 for r in ti_le), f"mỗi lớp phải còn khoảng một nửa, nhận {[round(r, 3) for r in ti_le]}"


def test_khoi_tao_qua_nho_thi_chet():
    ps = do_phuong_sai(0.01)
    assert ps[19] < 1e-30, f"với std = 0.01 phương sai phải tụt xuống ~1e-38, nhận {ps[19]:.3g}"


def test_dung_relu():
    # Nếu quên ReLU (lớp tuyến tính thuần), He sẽ làm phương sai phình gấp đôi mỗi lớp
    ps = do_phuong_sai("he", L=8)
    assert ps[7] < 20, f"phương sai lớp 8 = {ps[7]:.4g}, quá lớn — có thể bạn quên áp ReLU giữa các lớp"
