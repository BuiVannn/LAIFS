import numpy as np


def _loss(X, Ws, kich_hoat):
    A = np.asarray(X, dtype=float)
    for W in Ws:
        Z = A @ W
        A = np.maximum(Z, 0) if kich_hoat == "relu" else 1 / (1 + np.exp(-Z))
    return float(A.mean())


def _chuan_so(X, Ws, kich_hoat, h=1e-6):
    kq = []
    for l in range(len(Ws)):
        g = np.zeros_like(Ws[l])
        for i in np.ndindex(Ws[l].shape):
            cu = Ws[l][i]
            Ws[l][i] = cu + h
            tren = _loss(X, Ws, kich_hoat)
            Ws[l][i] = cu - h
            duoi = _loss(X, Ws, kich_hoat)
            Ws[l][i] = cu
            g[i] = (tren - duoi) / (2 * h)
        kq.append(float(np.linalg.norm(g)))
    return kq


def _mang(so_lop, d, std, seed):
    rng = np.random.default_rng(seed)
    X = rng.normal(size=(8, d))
    return X, [rng.normal(size=(d, d)) * std for _ in range(so_lop)]


def test_do_dai_va_thu_tu():
    X, Ws = _mang(4, 3, 0.8, 21)
    kq = chuan_gradient_theo_lop(X, Ws, "relu")
    assert len(kq) == 4, f"phải trả về đúng {len(Ws)} số, nhận {len(kq)}"
    assert all(np.isfinite(v) for v in kq), f"có giá trị không hữu hạn: {kq}"


def test_khop_gradient_so_sigmoid():
    X, Ws = _mang(3, 4, 0.9, 22)
    kq = chuan_gradient_theo_lop(X, [W.copy() for W in Ws], "sigmoid")
    can = _chuan_so(X, Ws, "sigmoid")
    assert np.allclose(kq, can, rtol=1e-4, atol=1e-12), \
        f"sigmoid: chuẩn gradient lệch với gradient số.\n  của bạn: {np.round(kq, 8)}\n  gradient số: {np.round(can, 8)}"


def test_khop_gradient_so_relu():
    X, Ws = _mang(3, 4, 0.9, 23)
    kq = chuan_gradient_theo_lop(X, [W.copy() for W in Ws], "relu")
    can = _chuan_so(X, Ws, "relu")
    assert np.allclose(kq, can, rtol=1e-4, atol=1e-12), \
        f"relu: chuẩn gradient lệch với gradient số.\n  của bạn: {np.round(kq, 8)}\n  gradient số: {np.round(can, 8)}"


def test_sigmoid_20_lop_gradient_bien_mat():
    d = 16
    X, Ws = _mang(20, d, np.sqrt(1.0 / d), 24)
    kq = chuan_gradient_theo_lop(X, Ws, "sigmoid")
    assert kq[0] < kq[-1] * 1e-8, \
        f"20 lớp sigmoid: chuẩn lớp 1 ({kq[0]:.3e}) phải nhỏ hơn lớp 20 ({kq[-1]:.3e}) ít nhất 10⁸ lần"
    assert kq[0] < kq[10] < kq[-1], f"chuẩn phải tăng dần từ lớp 1 tới lớp 20, nhận {[f'{v:.2e}' for v in kq]}"


def test_relu_khoi_tao_he_giu_duoc_gradient():
    d = 16
    X, Ws = _mang(20, d, np.sqrt(2.0 / d), 25)
    kq = chuan_gradient_theo_lop(X, Ws, "relu")
    ti_le = kq[0] / kq[-1]
    assert 0.01 < ti_le < 100, \
        f"ReLU + khởi tạo He: tỉ lệ lớp 1 / lớp 20 phải nằm trong (0.01, 100), nhận {ti_le:.3e}"
    assert min(kq) > 1e-4, f"mọi lớp phải có chuẩn gradient đáng kể, nhỏ nhất là {min(kq):.3e}"
