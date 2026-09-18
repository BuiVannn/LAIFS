import numpy as np


def test_log_softmax_gia_tri_co_ban():
    kq = log_softmax(np.array([2.0, 1.0, 0.1]))
    assert np.allclose(kq, [-0.4170300163, -1.4170300163, -2.3170300163]), f"nhan {kq}"
    assert np.allclose(np.exp(kq), [0.659001, 0.242433, 0.098566], atol=1e-6), "exp(log_softmax) phai ra softmax"
    assert np.isclose(np.exp(kq).sum(), 1.0), "exp cua ket qua phai cong lai bang 1"


def test_log_softmax_logit_khong_lo():
    kq = log_softmax(np.array([1000.0, 1001.0, 1002.0]))
    assert np.all(np.isfinite(kq)), f"tran so: nhan {kq} — hay tru max truoc khi lay exp"
    assert np.allclose(kq, [-2.4076059644, -1.4076059644, -0.4076059644]), f"nhan {kq}"
    # Cong hang so vao MOI logit khong duoc lam doi ket qua
    assert np.allclose(kq, log_softmax(np.array([0.0, 1.0, 2.0]))), "log_softmax phai bat bien voi phep cong hang so"


def test_log_softmax_giu_duoc_gia_tri_rat_am():
    # Day la diem khac biet voi np.log(softmax(z)): cach ngay tho cho -inf
    kq = log_softmax(np.array([0.0, -1000.0]))
    assert np.all(np.isfinite(kq)), f"phai ra [0, -1000] chu khong phai -inf, nhan {kq}"
    assert np.allclose(kq, [0.0, -1000.0]), f"nhan {kq}"


def test_log_softmax_khoang_cach_lon_chi_tru_max_moi_song():
    kq = log_softmax(np.array([0.0, 900.0, 1000.0]))
    assert np.all(np.isfinite(kq)), f"tran so: nhan {kq} — phai tru np.max, khong phai np.min"
    assert np.isclose(kq[2], 0.0, atol=1e-12) and kq[0] < -999, f"nhan {kq}"


def test_log_softmax_theo_truc_2_chieu():
    A = np.array([[2.0, 1.0, 0.1], [1000.0, 1001.0, 1002.0]])
    kq = log_softmax(A, axis=-1)
    assert np.shape(kq) == (2, 3), f"phai giu nguyen shape (2,3), nhan {np.shape(kq)}"
    assert np.allclose(np.exp(kq).sum(axis=-1), 1.0), f"tong theo hang phai bang 1, nhan {np.exp(kq).sum(axis=-1)}"
    assert np.allclose(kq[1], [-2.4076059644, -1.4076059644, -0.4076059644]), f"nhan {kq[1]}"
    cot = log_softmax(A, axis=0)
    assert np.allclose(np.exp(cot).sum(axis=0), 1.0), "axis=0 thi tong theo COT phai bang 1"


def test_cross_entropy_mot_mau():
    L = cross_entropy_tu_logits(np.array([[2.0, 1.0, 0.1]]), [0])
    assert np.isclose(L, 0.4170300163), f"-ln(0.659001) = 0.41703, nhan {L}"
    L2 = cross_entropy_tu_logits(np.array([[2.0, 1.0, 0.1]]), [2])
    assert np.isclose(L2, 2.3170300163), f"nhan {L2}"


def test_cross_entropy_la_trung_binh_khong_phai_tong():
    Z = np.array([[2.0, 1.0, 0.1], [2.0, 1.0, 0.1]])
    L = cross_entropy_tu_logits(Z, [0, 2])
    assert np.isclose(L, (0.4170300163 + 2.3170300163) / 2), f"phai lay TRUNG BINH tren N mau, nhan {L}"
    mot = cross_entropy_tu_logits(np.array([[2.0, 1.0, 0.1]]), [0])
    hai = cross_entropy_tu_logits(Z, [0, 0])
    assert np.isclose(mot, hai), f"lap lai cung mot mau thi loss trung binh khong doi: {mot} vs {hai}"


def test_cross_entropy_logit_cuc_doan_van_huu_han():
    Z = np.array([[0.0, -1000.0], [1000.0, 1001.0]])
    L = cross_entropy_tu_logits(Z, [1, 0])
    assert np.isfinite(L), f"phai huu han (500.66) chu khong phai inf, nhan {L}"
    assert np.isclose(L, (1000.0 + 1.3132616875) / 2), f"nhan {L}"


def test_du_doan_dung_thi_loss_gan_0():
    Z = np.array([[20.0, 0.0, 0.0], [0.0, 20.0, 0.0]])
    assert cross_entropy_tu_logits(Z, [0, 1]) < 1e-8, "logit lech rat xa va doan dung thi loss gan 0"
