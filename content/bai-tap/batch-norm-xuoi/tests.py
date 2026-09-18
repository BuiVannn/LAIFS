import numpy as np

X_MAU = np.array([[1., 100.], [3., 300.], [4., 400.], [5., 500.], [7., 700.]])
GAMMA = np.array([2., 0.5])
BETA = np.array([1., -1.])


def test_train_khop_bang_tinh_tay():
    Y, _, _ = batch_norm_xuoi(X_MAU, GAMMA, BETA, np.zeros(2), np.ones(2), True)
    can = np.array([[-2., -1.75], [0., -1.25], [1., -1.], [2., -0.75], [4., -0.25]])
    assert np.shape(Y) == (5, 2), f"Y cần shape (5, 2), nhận {np.shape(Y)}"
    assert np.allclose(Y, can, atol=1e-4), f"Y cần ≈\n{can}\nnhận\n{np.round(np.asarray(Y), 4)}"


def test_train_chuan_hoa_theo_cot():
    rng = np.random.default_rng(7)
    X = rng.normal(loc=[5., -20., 100.], scale=[0.5, 30., 3.], size=(64, 3))
    Y, _, _ = batch_norm_xuoi(X, np.ones(3), np.zeros(3), np.zeros(3), np.ones(3), True)
    assert np.allclose(np.mean(Y, axis=0), 0, atol=1e-6), \
        f"với gamma=1, beta=0 thì mỗi CỘT của Y phải có trung bình 0, nhận {np.mean(Y, axis=0)}"
    assert np.allclose(np.var(Y, axis=0), 1, atol=1e-4), \
        f"mỗi CỘT của Y phải có phương sai 1, nhận {np.var(Y, axis=0)}"


def test_thong_ke_chay_cap_nhat_dung():
    _, tb, ps = batch_norm_xuoi(X_MAU, GAMMA, BETA, np.zeros(2), np.ones(2), True)
    assert np.allclose(tb, [0.4, 40.]), f"tb_chay cần [0.4, 40] (= 0.9·0 + 0.1·[4, 400]), nhận {tb}"
    assert np.allclose(ps, [1.3, 4000.9]), f"ps_chay cần [1.3, 4000.9] (= 0.9·1 + 0.1·[4, 40000]), nhận {ps}"


def test_thong_ke_chay_theo_momentum_khac():
    _, tb, ps = batch_norm_xuoi(X_MAU, GAMMA, BETA, np.array([2., 200.]), np.array([8., 8.]), True, momentum=0.5)
    assert np.allclose(tb, [3., 300.]), f"với momentum=0.5, tb_chay cần [3, 300], nhận {tb}"
    assert np.allclose(ps, [6., 20004.]), f"với momentum=0.5, ps_chay cần [6, 20004], nhận {ps}"


def test_eval_dung_thong_ke_chay_chu_khong_phai_batch():
    tb = np.array([4., 400.])
    ps = np.array([4., 40000.])
    # batch này có thống kê KHÁC hẳn thống kê chạy
    X = np.array([[5., 500.], [9., 900.], [13., 1300.]])
    Y, tb2, ps2 = batch_norm_xuoi(X, GAMMA, BETA, tb, ps, False)
    can = GAMMA * (X - tb) / np.sqrt(ps + 1e-5) + BETA
    assert np.allclose(Y, can, atol=1e-6), \
        f"eval phải chuẩn hoá bằng tb_chay/ps_chay, không phải thống kê của batch. Cần\n{np.round(can, 4)}\nnhận\n{np.round(np.asarray(Y), 4)}"
    assert np.allclose(tb2, tb) and np.allclose(ps2, ps), "eval KHÔNG được cập nhật thống kê chạy"


def test_eval_mot_mau_van_dung():
    Y, _, _ = batch_norm_xuoi(np.array([[5., 500.]]), GAMMA, BETA,
                              np.array([4., 400.]), np.array([4., 40000.]), False)
    assert np.allclose(Y, [[2., -0.75]], atol=1e-4), \
        f"một mẫu ở chế độ eval cần [[2, -0.75]], nhận {np.round(np.asarray(Y), 4)}. Nếu ra [[1, -1]] (= beta) thì bạn đang dùng thống kê batch."


def test_train_mot_mau_ra_dung_beta_khong_nan():
    Y, _, _ = batch_norm_xuoi(np.array([[5., 500.]]), GAMMA, BETA, np.zeros(2), np.ones(2), True)
    assert np.all(np.isfinite(Y)), f"eps trong căn giữ cho kết quả không thành nan, nhận {Y}"
    assert np.allclose(Y, [BETA], atol=1e-4), \
        f"train với batch 1 mẫu: xhat = 0 nên Y phải đúng bằng beta {BETA}, nhận {np.asarray(Y)}"


def test_dac_trung_hang_so_khong_ra_nan():
    X = np.array([[3., 1.], [3., 2.], [3., 3.]])
    Y, _, _ = batch_norm_xuoi(X, np.ones(2), np.zeros(2), np.zeros(2), np.ones(2), True)
    assert np.all(np.isfinite(Y)), f"cột hằng số có phương sai 0: phải cộng eps TRONG căn, nhận {Y}"
