import numpy as np


def test_chua_khop_hai_duong_cung_cao_va_phang():
    train = np.array([1.20, 0.95, 0.88, 0.85, 0.84])
    val = np.array([1.25, 1.00, 0.92, 0.90, 0.89])
    assert chan_doan(train, val) == ("chua-khop", 4), f"nhận {chan_doan(train, val)}"


def test_qua_khop_val_quay_dau():
    train = np.array([0.90, 0.50, 0.28, 0.12, 0.04, 0.01])
    val = np.array([0.95, 0.58, 0.40, 0.44, 0.61, 0.83])
    assert chan_doan(train, val) == ("qua-khop", 2), f"nhận {chan_doan(train, val)}"


def test_vua_kheo_hai_duong_sat_nhau():
    train = np.array([0.90, 0.45, 0.30, 0.26, 0.25])
    val = np.array([0.94, 0.49, 0.33, 0.29, 0.28])
    assert chan_doan(train, val) == ("vua-kheo", 4), f"nhận {chan_doan(train, val)}"


def test_nghi_du_lieu_val_thap_hon_train():
    train = np.array([0.90, 0.60, 0.42, 0.35, 0.32])
    val = np.array([0.70, 0.40, 0.22, 0.15, 0.12])
    assert chan_doan(train, val) == ("nghi-du-lieu", 4), f"nhận {chan_doan(train, val)}"


def test_val_hoi_thap_hon_train_van_chua_dang_ngo():
    # val nhỏ hơn train 0.02 < nguong_hoi = 0.05 → chỉ là dao động, KHÔNG phải nghi-du-lieu
    train = np.array([0.90, 0.55, 0.32, 0.30])
    val = np.array([0.92, 0.56, 0.31, 0.28])
    assert chan_doan(train, val) == ("vua-kheo", 3), f"nhận {chan_doan(train, val)}"


def test_luat_1_uu_tien_hon_luat_2():
    # train còn cao (0.84 > 0.5) NHƯNG val thấp hơn hẳn → phải báo nghi-du-lieu trước
    train = np.array([1.20, 0.95, 0.84])
    val = np.array([1.00, 0.72, 0.60])
    assert chan_doan(train, val)[0] == "nghi-du-lieu", f"nhận {chan_doan(train, val)}"


def test_epoch_dung_va_kieu_du_lieu():
    train = np.array([0.90, 0.50, 0.28, 0.12, 0.04])
    val = np.array([0.95, 0.58, 0.31, 0.30, 0.66])
    nhan, epoch = chan_doan(train, val)
    assert epoch == 3, f"val thấp nhất ở epoch 3, nhận {epoch}"
    assert isinstance(nhan, str) and isinstance(epoch, int), "cần trả về (str, int) thuần Python"


def test_nguong_tuy_chinh():
    train = np.array([0.90, 0.70, 0.62])
    val = np.array([0.95, 0.75, 0.68])
    assert chan_doan(train, val, nguong_cao=0.5)[0] == "chua-khop"
    assert chan_doan(train, val, nguong_cao=0.9)[0] == "vua-kheo"
