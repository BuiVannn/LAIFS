GOC = "/root/.cache/huggingface/hub"


def test_tach_repo_id_co_to_chuc():
    assert tach_repo_id("Helsinki-NLP/opus-mt-vi-en") == ("Helsinki-NLP", "opus-mt-vi-en"), (
        f"nhan {tach_repo_id('Helsinki-NLP/opus-mt-vi-en')}"
    )
    assert tach_repo_id("facebook/nllb-200-distilled-600M") == ("facebook", "nllb-200-distilled-600M")


def test_tach_repo_id_khong_co_to_chuc():
    assert tach_repo_id("gpt2") == (None, "gpt2"), (
        f"ten khong co dau '/' thi to chuc la None, nhan {tach_repo_id('gpt2')}"
    )


def test_tach_repo_id_bat_dau_vao_hong():
    for xau in ("", "   ", "a/b/c", "/opus-mt-vi-en", "Helsinki-NLP/"):
        loi = None
        try:
            tach_repo_id(xau)
        except ValueError as e:
            loi = e
        assert loi is not None, f"repo_id {xau!r} phai raise ValueError"


def test_thu_muc_repo_model():
    kq = thu_muc_repo("Helsinki-NLP/opus-mt-vi-en")
    assert kq == "models--Helsinki-NLP--opus-mt-vi-en", f"nhan {kq!r}"


def test_thu_muc_repo_khong_to_chuc_chi_co_hai_phan():
    kq = thu_muc_repo("gpt2")
    assert kq == "models--gpt2", f"khong co to chuc thi khong duoc them '--' thua, nhan {kq!r}"


def test_thu_muc_repo_dataset_va_space():
    assert thu_muc_repo("glue", loai="dataset") == "datasets--glue", f"nhan {thu_muc_repo('glue', loai='dataset')!r}"
    kq = thu_muc_repo("dalle-mini/dalle-mini", loai="space")
    assert kq == "spaces--dalle-mini--dalle-mini", f"nhan {kq!r}"


def test_loai_la_so_it_khong_phai_so_nhieu_trong_thu_muc():
    loi = None
    try:
        thu_muc_repo("gpt2", loai="models")
    except ValueError as e:
        loi = e
    assert loi is not None, "loai chi nhan 'model' / 'dataset' / 'space' (so it), phai raise ValueError voi 'models'"


def test_duong_dan_file_day_du():
    kq = duong_dan_file(GOC, "Helsinki-NLP/opus-mt-vi-en", "abc123", "config.json")
    assert kq == GOC + "/models--Helsinki-NLP--opus-mt-vi-en/snapshots/abc123/config.json", f"nhan {kq!r}"


def test_duong_dan_file_khong_bi_hai_dau_gach_cheo():
    kq = duong_dan_file(GOC + "/", "gpt2", "main", "tokenizer.json")
    assert "//" not in kq.replace("://", ""), f"goc co dau '/' thua phai duoc cat, nhan {kq!r}"
    assert kq == GOC + "/models--gpt2/snapshots/main/tokenizer.json", f"nhan {kq!r}"


def test_duong_dan_file_revision_rong():
    loi = None
    try:
        duong_dan_file(GOC, "gpt2", "", "config.json")
    except ValueError as e:
        loi = e
    assert loi is not None, "revision rong phai raise ValueError"


def test_don_cache():
    repos = [
        {"repo_id": "facebook/nllb-200-distilled-600M", "byte": 2_460_000_000},
        {"repo_id": "Helsinki-NLP/opus-mt-vi-en", "byte": 310_000_000},
        {"repo_id": "gpt2", "byte": 550_000_000},
    ]
    kq = don_cache(repos, giu=["Helsinki-NLP/opus-mt-vi-en"])
    assert kq["byte_giai_phong"] == 3_010_000_000, f"xoa nllb + gpt2, nhan {kq['byte_giai_phong']}"
    assert kq["byte_con_lai"] == 310_000_000, f"nhan {kq['byte_con_lai']}"
    assert kq["repo_xoa"] == ["facebook/nllb-200-distilled-600M", "gpt2"], (
        f"danh sach xoa phai sap xep, nhan {kq['repo_xoa']}"
    )


def test_don_cache_giu_het_va_giu_mot_ten_khong_co_that():
    repos = [{"repo_id": "gpt2", "byte": 10}, {"repo_id": "a/b", "byte": 20}]
    kq = don_cache(repos, giu=["gpt2", "a/b"])
    assert kq == {"byte_giai_phong": 0, "byte_con_lai": 30, "repo_xoa": []}, f"nhan {kq}"
    kq2 = don_cache(repos, giu=["khong/ton-tai"])
    assert kq2["byte_giai_phong"] == 30 and kq2["repo_xoa"] == ["a/b", "gpt2"], f"nhan {kq2}"
