import numpy as np

H_NGUON = np.array([[2.0, 0.0], [0.0, 2.0], [-1.5, -1.5]])  # con, mèo, đen


def test_softmax_co_ban():
    p = softmax(np.array([1.0, 2.0, 3.0]))
    assert np.shape(p) == (3,), f"kết quả phải cùng shape với đầu vào, nhận {np.shape(p)}"
    assert np.isclose(p.sum(), 1.0), f"tổng phải bằng 1, nhận {p.sum()}"
    assert np.allclose(p, [0.09003057, 0.24472847, 0.66524096]), f"nhận {p}"


def test_softmax_on_dinh_so():
    p = softmax(np.array([1000.0, 1001.0, 1002.0]))
    assert np.all(np.isfinite(p)), f"tràn số: nhận {p} — hãy trừ max theo axis trước khi exp"
    assert np.allclose(p, [0.09003057, 0.24472847, 0.66524096]), (
        f"cộng cùng một hằng số vào mọi phần tử KHÔNG được làm đổi kết quả, nhận {p}"
    )


def test_softmax_theo_truc():
    A = np.array([[1.0, 2.0, 3.0], [0.0, 0.0, 0.0]])
    p0 = softmax(A, axis=0)
    p1 = softmax(A, axis=1)
    assert np.allclose(p0.sum(axis=0), 1.0), f"axis=0 thì tổng theo cột phải bằng 1, nhận {p0.sum(axis=0)}"
    assert np.allclose(p1.sum(axis=1), 1.0), f"axis=1 thì tổng theo hàng phải bằng 1, nhận {p1.sum(axis=1)}"
    assert np.allclose(p1[1], [1 / 3, 1 / 3, 1 / 3]), f"hàng toàn 0 phải cho phân bố đều, nhận {p1[1]}"


def test_vi_du_trong_de():
    alpha, c = chu_y(H_NGUON, np.array([1.5, 0.0]))
    assert np.shape(alpha) == (3,), f"alpha phải có shape (3,), nhận {np.shape(alpha)}"
    assert np.shape(c) == (2,), f"c phải có shape (2,), nhận {np.shape(c)}"
    assert np.allclose(alpha, [0.94783, 0.04719, 0.00497], atol=1e-4), f"alpha = {alpha}"
    assert np.allclose(c, [1.88822, 0.08694], atol=1e-4), f"c = {c}"


def test_tong_trong_so_luon_bang_1():
    rng = np.random.default_rng(7)
    for _ in range(5):
        H = rng.normal(size=(6, 4)) * 3
        alpha, c = chu_y(H, rng.normal(size=4) * 3)
        assert np.isclose(alpha.sum(), 1.0), f"tổng trọng số chú ý phải bằng 1, nhận {alpha.sum()}"
        assert np.all(alpha >= 0), "mọi trọng số phải không âm"
        assert np.shape(c) == (4,), f"c phải có shape (4,), nhận {np.shape(c)}"


def test_c_la_trung_binh_co_trong_so_cua_H():
    rng = np.random.default_rng(3)
    H = rng.normal(size=(5, 3))
    s = rng.normal(size=3)
    alpha, c = chu_y(H, s)
    assert np.allclose(c, alpha @ H), "c phải bằng tổng alpha_j · h_j (trung bình có trọng số các hàng của H)"


def test_diem_la_tich_vo_huong():
    # h1 vuông góc với s, h2 cùng hướng s -> toàn bộ chú ý dồn về h2
    H = np.array([[0.0, 10.0], [10.0, 0.0]])
    alpha, c = chu_y(H, np.array([5.0, 0.0]))
    assert alpha[1] > 0.999, f"điểm phải là h_j · s, nên hàng 2 thắng áp đảo; nhận alpha = {alpha}"
    assert np.allclose(c, [10.0, 0.0], atol=1e-3), f"c = {c}"
