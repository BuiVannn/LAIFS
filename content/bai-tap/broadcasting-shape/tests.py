import numpy as np

BANG = [
    ((3, 2), (2,), (3, 2)),
    ((3, 2), (3,), None),
    ((3, 2), (3, 1), (3, 2)),
    ((2,), (2, 1), (2, 2)),
    ((4, 1, 3), (5, 3), (4, 5, 3)),
    ((), (2, 5), (2, 5)),
    ((7,), (7,), (7,)),
    ((1, 1), (8, 9), (8, 9)),
    ((2, 3, 4), (2, 1, 4), (2, 3, 4)),
    ((5, 4), (4, 5), None),
]


def test_bang_trong_de_bai():
    for a, b, mong in BANG:
        nhan = shape_broadcast(a, b)
        assert nhan == mong, f"shape_broadcast({a}, {b}) cần {mong}, nhận {nhan}"


def test_doi_cho_a_b_van_the():
    # Broadcasting đối xứng: đổi chỗ hai shape phải cho cùng kết quả
    for a, b, mong in BANG:
        nhan = shape_broadcast(b, a)
        assert nhan == mong, f"shape_broadcast({b}, {a}) cần {mong} (đối xứng), nhận {nhan}"


def test_khop_voi_numpy():
    rng = np.random.default_rng(2)
    for _ in range(300):
        a = tuple(int(v) for v in rng.integers(1, 4, size=int(rng.integers(0, 4))))
        b = tuple(int(v) for v in rng.integers(1, 4, size=int(rng.integers(0, 4))))
        try:
            mong = np.broadcast_shapes(a, b)
        except ValueError:
            mong = None
        nhan = shape_broadcast(a, b)
        assert nhan == mong, f"shape_broadcast({a}, {b}) cần {mong}, nhận {nhan}"
