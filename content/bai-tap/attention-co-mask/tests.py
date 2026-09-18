import numpy as np

QKV = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])


def test_gia_tri_tinh_tay():
    ra, w = attention(QKV, QKV, QKV, mask_nhan_qua=True)
    mong_doi_w = np.array([[1.0, 0.0, 0.0], [0.3302, 0.6698, 0.0], [0.2483, 0.2483, 0.5035]])
    mong_doi_ra = np.array([[1.0, 0.0], [0.3302, 0.6698], [0.7517, 0.7517]])
    assert np.allclose(w, mong_doi_w, atol=1e-4), f"trọng số cần ≈\n{mong_doi_w}\nnhận\n{np.round(w, 4)}"
    assert np.allclose(ra, mong_doi_ra, atol=1e-4), f"ra cần ≈\n{mong_doi_ra}\nnhận\n{np.round(ra, 4)}"


def test_shape_va_moi_hang_cong_bang_1():
    rng = np.random.default_rng(0)
    Q, K, V = rng.normal(size=(5, 4)), rng.normal(size=(5, 4)), rng.normal(size=(5, 3))
    ra, w = attention(Q, K, V)
    assert np.shape(w) == (5, 5), f"trọng số cần shape (5, 5), nhận {np.shape(w)}"
    assert np.shape(ra) == (5, 3), f"ra cần shape (5, 3) giống V, nhận {np.shape(ra)}"
    assert np.allclose(w.sum(axis=1), 1), f"mỗi HÀNG phải cộng bằng 1, nhận tổng {np.round(w.sum(axis=1), 4)}"


def test_mask_che_dung_tam_giac_tren():
    rng = np.random.default_rng(1)
    Q, K, V = rng.normal(size=(6, 4)), rng.normal(size=(6, 4)), rng.normal(size=(6, 4))
    _, w = attention(Q, K, V, mask_nhan_qua=True)
    tren = np.triu(np.ones((6, 6), dtype=bool), k=1)
    assert np.allclose(w[tren], 0), f"ô phía trên đường chéo phải bằng 0, nhận {np.round(w[tren], 4)}"
    assert (w[~tren] > 0).all(), "ô từ đường chéo trở xuống phải khác 0 (chỉ tương lai mới bị che)"


def test_khong_nhin_duoc_tuong_lai():
    # Đổi hẳn K, V của các token phía sau: kết quả của token phía trước phải y nguyên
    rng = np.random.default_rng(2)
    Q, K, V = rng.normal(size=(5, 4)), rng.normal(size=(5, 4)), rng.normal(size=(5, 4))
    ra_goc, _ = attention(Q, K, V, mask_nhan_qua=True)
    K2, V2 = K.copy(), V.copy()
    K2[3:] = rng.normal(size=(2, 4)) * 10
    V2[3:] = rng.normal(size=(2, 4)) * 10
    ra_moi, _ = attention(Q, K2, V2, mask_nhan_qua=True)
    assert np.allclose(ra_goc[:3], ra_moi[:3]), (
        "sửa token 4, 5 mà đầu ra của token 1-3 đổi theo → mask nhân quả chưa đúng:\n"
        f"  trước: {np.round(ra_goc[:3], 4)}\n  sau:   {np.round(ra_moi[:3], 4)}"
    )
    assert not np.allclose(ra_goc[4], ra_moi[4]), "token cuối PHẢI đổi khi K, V phía sau đổi"


def test_tat_mask_thi_nhin_het():
    ra, w = attention(QKV, QKV, QKV, mask_nhan_qua=False)
    assert (w > 0).all(), f"không mask thì mọi ô đều dương, nhận\n{np.round(w, 4)}"
    assert np.allclose(w.sum(axis=1), 1)
    _, w_mask = attention(QKV, QKV, QKV, mask_nhan_qua=True)
    assert np.allclose(w[-1], w_mask[-1], atol=1e-4), "hàng CUỐI không có ô nào bị che nên phải giống hệt khi bật mask"
    assert not np.allclose(w[0], w_mask[0], atol=1e-4), "hàng ĐẦU phải khác nhau giữa có mask và không mask"


def test_ma_hoa_vi_tri():
    PE = ma_hoa_vi_tri(4, 4)
    assert np.shape(PE) == (4, 4), f"cần shape (4, 4), nhận {np.shape(PE)}"
    mong_doi = np.array([
        [0.0, 1.0, 0.0, 1.0],
        [0.8415, 0.5403, 0.0100, 1.0000],
        [0.9093, -0.4161, 0.0200, 0.9998],
        [0.1411, -0.9900, 0.0300, 0.9996],
    ])
    assert np.allclose(PE, mong_doi, atol=1e-4), f"cần ≈\n{mong_doi}\nnhận\n{np.round(PE, 4)}"


def test_ma_hoa_vi_tri_nam_trong_khoang():
    PE = ma_hoa_vi_tri(50, 16)
    assert np.shape(PE) == (50, 16)
    assert PE.min() >= -1 and PE.max() <= 1, "sin/cos luôn nằm trong [-1, 1]"
    assert abs(PE[:, 0] - PE[:, 2]).max() > 0.5, "các cặp chiều phải dùng tần số KHÁC nhau"


def test_on_dinh_so_voi_diem_lon():
    # Điểm rất lớn: chỉ TRỪ max mới an toàn; cộng max hay trừ min đều làm exp tràn
    Q = np.array([[0.0, 0.0], [300.0, 300.0]])
    K = np.array([[0.0, 0.0], [300.0, 300.0]])
    V = np.array([[1.0, 0.0], [0.0, 1.0]])
    ra, A = attention(Q, K, V)
    assert np.all(np.isfinite(ra)) and np.all(np.isfinite(A)), (
        f"tràn số với điểm lớn: A = {A} — hãy trừ điểm lớn nhất theo hàng trước khi exp"
    )
    assert np.allclose(A.sum(axis=1), 1), f"mỗi hàng vẫn phải cộng lại bằng 1, nhận {A.sum(axis=1)}"
