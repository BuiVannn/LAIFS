import numpy as np


def test_chuan_gop_moi_mang():
    gs = [np.array([3., 4.]), np.array([[12.], [0.]])]
    assert np.isclose(chuan_toan_cuc(gs), 13.0), \
        f"chuẩn gộp của [3,4] và [12,0] là √(9+16+144) = 13, nhận {chuan_toan_cuc(gs)}"


def test_vi_du_trong_de():
    ra = cat_gradient([np.array([6., 8.])], 5)
    assert np.allclose(ra[0], [3., 4.]), f"cần [[3, 4]], nhận {[np.asarray(x) for x in ra]}"
    assert np.isclose(chuan_toan_cuc(ra), 5.0), f"chuẩn sau khi cắt phải đúng bằng ngưỡng 5, nhận {chuan_toan_cuc(ra)}"


def test_duoi_nguong_thi_giu_nguyen():
    gs = [np.array([6., 8.]), np.array([0., 0., 0.])]
    ra = cat_gradient(gs, 20)
    for a, b in zip(ra, gs):
        assert np.allclose(a, b), f"chuẩn 10 dưới ngưỡng 20 thì không được đổi gì, nhận {np.asarray(a)} thay vì {b}"


def test_cat_theo_chuan_toan_cuc_chu_khong_tung_mang():
    gs = [np.array([3., 0.]), np.array([0., 4.])]
    ra = cat_gradient(gs, 5)
    # chuẩn gộp đúng bằng 5 nên không phải cắt; cắt riêng từng mảng theo ngưỡng 5 cũng không đổi gì
    assert np.allclose(ra[0], [3., 0.]) and np.allclose(ra[1], [0., 4.]), "chuẩn gộp bằng 5, không được đổi"
    ra2 = cat_gradient(gs, 1)
    assert np.isclose(chuan_toan_cuc(ra2), 1.0), \
        f"chuẩn gộp sau khi cắt phải bằng 1, nhận {chuan_toan_cuc(ra2)} (cắt riêng từng mảng sẽ ra √2)"


def test_giu_nguyen_huong():
    rng = np.random.default_rng(31)
    gs = [rng.normal(size=(4, 3)) * 50, rng.normal(size=7) * 50]
    ra = cat_gradient(gs, 2.0)
    goc = np.concatenate([g.ravel() for g in gs])
    moi = np.concatenate([np.asarray(g).ravel() for g in ra])
    cos = float(goc @ moi / (np.linalg.norm(goc) * np.linalg.norm(moi)))
    assert np.isclose(cos, 1.0, atol=1e-9), f"hướng phải giữ nguyên (cosine = 1), nhận {cos}"
    assert np.isclose(chuan_toan_cuc(ra), 2.0), f"chuẩn sau khi cắt phải bằng 2, nhận {chuan_toan_cuc(ra)}"


def test_gradient_toan_khong_khong_ra_nan():
    ra = cat_gradient([np.zeros(3), np.zeros((2, 2))], 1.0)
    assert all(np.all(np.isfinite(g)) for g in ra), f"chuẩn bằng 0 không được gây chia cho 0, nhận {[np.asarray(g) for g in ra]}"
    assert np.allclose(ra[0], 0) and np.allclose(ra[1], 0), "gradient 0 vẫn phải là 0"


def test_khong_sua_danh_sach_goc():
    gs = [np.array([6., 8.])]
    cat_gradient(gs, 1.0)
    assert np.allclose(gs[0], [6., 8.]), f"không được sửa mảng gốc tại chỗ, gs[0] đã thành {gs[0]}"
