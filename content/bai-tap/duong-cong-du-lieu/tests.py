# dot-bien-bo-qua: đổi >= thành >, đổi <= thành < — tại đúng đầu mút, nội suy cho cùng kết quả
import math

# Số thật: Koehn & Knowles 2017 (arXiv:1706.03872), Figure 3, Anh->Tay Ban Nha, he NMT.
CO = [376660, 753320, 1506641, 3013281, 6026563, 12053125,
      24106250, 48212500, 96425000, 192850000, 385700000]
BLEU = [1.6, 7.2, 11.9, 14.7, 18.2, 22.4, 25.7, 27.4, 29.2, 30.3, 31.1]


def test_vi_du_trong_de():
    kq = loi_ich_gap_doi([1.6, 7.2, 11.9])
    assert len(kq) == 2, f"can 2 phan tu, nhan {len(kq)}"
    assert all(math.isclose(a, b, abs_tol=1e-9) for a, b in zip(kq, [5.6, 4.7])), f"nhan {kq}"


def test_loi_ich_giam_dan_o_cuoi_duong_cong():
    g = loi_ich_gap_doi(BLEU)
    assert len(g) == 10, f"can 10 muc tang, nhan {len(g)}"
    assert math.isclose(g[0], 5.6, abs_tol=1e-9), f"lan gap doi dau tien: nhan {g[0]}"
    assert math.isclose(g[-1], 0.8, abs_tol=1e-9), f"lan gap doi cuoi: nhan {g[-1]}"
    assert g[0] > 5 * g[-1], "lan gap doi dau phai loi hon han lan cuoi"


def test_mot_phan_tu_thi_khong_co_lan_gap_doi_nao():
    assert loi_ich_gap_doi([10.0]) == []


def test_noi_suy_tai_dung_moc_do():
    for i, n in enumerate(CO):
        got = noi_suy(CO, BLEU, n)
        assert math.isclose(got, BLEU[i], abs_tol=1e-6), f"tai {n}: nhan {got}, can {BLEU[i]}"


def test_noi_suy_giua_hai_moc_tren_thang_log():
    k = [1_000_000, 2_000_000, 4_000_000]
    d = [10.0, 16.0, 20.0]
    giua = math.sqrt(1_000_000 * 2_000_000)  # trung diem tren thang log
    got = noi_suy(k, d, giua)
    assert math.isclose(got, 13.0, abs_tol=1e-6), f"nhan {got}, can 13.0"
    got = noi_suy(k, d, math.sqrt(2_000_000 * 4_000_000))
    assert math.isclose(got, 18.0, abs_tol=1e-6), f"nhan {got}, can 18.0"


def test_khong_ngoai_suy_ra_ngoai_khoang():
    assert math.isclose(noi_suy(CO, BLEU, 1000), 1.6, abs_tol=1e-9)
    assert math.isclose(noi_suy(CO, BLEU, 10 ** 12), 31.1, abs_tol=1e-9)


def test_noi_suy_don_dieu_tang():
    truoc = -1.0
    for e in range(6, 9):
        for m in (1, 3, 6):
            n = m * 10 ** e
            got = noi_suy(CO, BLEU, n)
            assert got >= truoc - 1e-9, f"diem phai khong giam khi n tang: {n} -> {got}"
            truoc = got
