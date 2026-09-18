import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0]])  # so gio on bai
Y = np.array([0.0, 0.0, 1.0, 1.0])  # 1 = do


def test_sigmoid_on_dinh_so():
    with np.errstate(over="raise"):
        kq = sigmoid(np.array([-1000.0, 0.0, 1000.0]))
    assert np.allclose(kq, [0.0, 0.5, 1.0]), f"nhan {kq}"
    assert np.isclose(sigmoid(np.array([1.2]))[0], 0.7685247835), f"sigmoid(1.2) = {sigmoid(np.array([1.2]))}"


def test_mat_mat_luc_khoi_tao():
    # w = 0, b = 0 -> moi p = 0.5 -> loss = -ln(0.5) = ln 2
    L = mat_mat(X, Y, np.zeros(1), 0.0)
    assert np.isclose(L, 0.6931471806), f"loss phai la ln 2 = 0.693147, nhan {L}"


def test_mat_mat_la_trung_binh_khong_phai_tong():
    # Nhan doi so mau (lap lai chinh no) thi loss trung binh KHONG doi
    L1 = mat_mat(X, Y, np.array([0.5]), 0.0)
    L2 = mat_mat(np.vstack([X, X]), np.concatenate([Y, Y]), np.array([0.5]), 0.0)
    assert np.isclose(L1, 0.6539203), f"loss tai w = 0.5, b = 0 phai la 0.6539203, nhan {L1}"
    assert np.isclose(L1, L2), f"loss phai lay TRUNG BINH tren cac mau: {L1} vs {L2}"


def test_mot_buoc_khop_vi_du_tinh_tay():
    w, b = huan_luyen_logistic(X, Y, lr=1.0, so_buoc=1)
    assert np.shape(w) == (1,), f"w phai co shape (1,), nhan {np.shape(w)}"
    assert np.isclose(w[0], 0.5), f"sau 1 buoc w phai la 0.5 (gradient = -0.5), nhan {w[0]}"
    assert np.isclose(b, 0.0), f"sau 1 buoc b phai van la 0 (gradient = 0), nhan {b}"


def test_hai_buoc_khop_vi_du_tinh_tay():
    w, b = huan_luyen_logistic(X, Y, lr=1.0, so_buoc=2)
    assert np.isclose(w[0], 0.2348779, atol=1e-6), f"sau 2 buoc w phai la 0.2348779, nhan {w[0]}"
    assert np.isclose(b, -0.2629724, atol=1e-6), f"sau 2 buoc b phai la -0.2629724, nhan {b}"


def test_huan_luyen_du_lau_thi_loss_giam():
    w, b = huan_luyen_logistic(X, Y, lr=0.5, so_buoc=2000)
    assert np.isclose(w[0], 5.7987967, atol=1e-4), f"w = {w[0]}"
    assert np.isclose(b, -14.3119719, atol=1e-4), f"b = {b}"
    assert mat_mat(X, Y, w, b) < 0.03, "loss phai giam ro so voi ln 2 = 0.693"
    assert np.isclose(-b / w[0], 2.4680934, atol=1e-4), "bien quyet dinh z = 0 phai o x = 2.468"


def test_nhieu_dac_trung():
    rng = np.random.default_rng(0)
    Xm = rng.normal(size=(60, 2))
    ym = (Xm @ np.array([2.0, -1.0]) + 0.5 > 0).astype(float)
    w, b = huan_luyen_logistic(Xm, ym, lr=0.5, so_buoc=3000)
    assert np.shape(w) == (2,), f"w phai co shape (2,) khi X co 2 cot, nhan {np.shape(w)}"
    assert (du_doan(Xm, w, b) == ym).mean() == 1.0, "du lieu tach duoc hoan hao thi phai dat 100% dung"
    assert w[0] > 0 > w[1], f"dau cua trong so phai khop huong that (2, -1), nhan {w}"


def test_du_doan_dung_nguong():
    # z = 0 -> p = 0.5 dung bang nguong: quy uoc lay lop 1 (dung >=, khong phai >)
    assert np.all(du_doan(np.zeros((2, 1)), np.zeros(1), 0.0) == 1), "p = 0.5 dung bang nguong 0.5 thi du doan lop 1"
    # p = sigmoid(0.2) = 0.549834 -> vuot nguong 0.5 nhung khong vuot nguong 0.55
    x1 = np.array([[1.0]])
    assert du_doan(x1, np.array([0.2]), 0.0)[0] == 1, "voi nguong mac dinh 0.5 thi p = 0.5498 -> lop 1"
    assert du_doan(x1, np.array([0.2]), 0.0, nguong=0.55)[0] == 0, "nang nguong len 0.55 thi p = 0.5498 -> lop 0"
    kq = du_doan(X, np.array([5.7987967]), -14.3119719)
    assert np.array_equal(kq, [0, 0, 1, 1]), f"nhan {kq}"
