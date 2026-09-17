import math

import numpy as np

_TU = ["vua", "hoàng hậu", "đàn ông", "đàn bà", "mèo"]
_E = np.array([[4.4, 2.2], [3.6, 3.8], [3.0, 1.0], [2.2, 2.6], [-1.2, 3.4]])


def test_cosine_co_ban():
    assert math.isclose(cosine(np.array([1.0, 0.0]), np.array([1.0, 0.0])), 1.0, abs_tol=1e-9)
    assert math.isclose(cosine(np.array([1.0, 0.0]), np.array([0.0, 1.0])), 0.0, abs_tol=1e-9)
    assert math.isclose(cosine(np.array([1.0, 0.0]), np.array([-1.0, 0.0])), -1.0, abs_tol=1e-9)


def test_cosine_khong_doi_khi_nhan_do_dai():
    a, b = np.array([1.0, 2.0]), np.array([3.0, -1.0])
    assert math.isclose(cosine(a, b), cosine(10 * a, b), abs_tol=1e-9), "cosin chỉ phụ thuộc góc, không phụ thuộc độ dài"


def test_cosine_vector_khong():
    assert cosine(np.zeros(3), np.array([1.0, 2.0, 3.0])) == 0.0


def test_cosine_vua_dan_ong():
    assert math.isclose(cosine(_E[0], _E[2]), 0.98994949, abs_tol=1e-6), f"nhận {cosine(_E[0], _E[2])}"


def test_lang_gieng_cua_vua():
    kq = lang_gieng(_E, _TU, "vua", 2)
    assert [t for t, _ in kq] == ["đàn ông", "hoàng hậu"], f"nhận {kq}"
    assert math.isclose(kq[0][1], 0.98994949, abs_tol=1e-6), f"nhận {kq}"


def test_lang_gieng_khong_tra_ve_chinh_no():
    kq = lang_gieng(_E, _TU, "mèo", 4)
    assert len(kq) == 4 and "mèo" not in [t for t, _ in kq], f"nhận {kq}"


def test_lang_gieng_giam_dan():
    c = [x for _, x in lang_gieng(_E, _TU, "vua", 4)]
    assert all(c[i] >= c[i + 1] for i in range(len(c) - 1)), f"phải giảm dần, nhận {c}"


def test_tuong_tu_vua_hoang_hau():
    kq = tuong_tu(_E, _TU, "đàn ông", "vua", "đàn bà")
    assert kq[0][0] == "hoàng hậu", f"nhận {kq}"
    assert math.isclose(kq[0][1], 1.0, abs_tol=1e-9), f"cosin phải đúng bằng 1.0, nhận {kq}"


def test_tuong_tu_bo_qua_ba_tu_dau_vao():
    kq = tuong_tu(_E, _TU, "đàn ông", "vua", "đàn bà", k=2)
    assert not ({t for t, _ in kq} & {"đàn ông", "vua", "đàn bà"}), f"nhận {kq}"
