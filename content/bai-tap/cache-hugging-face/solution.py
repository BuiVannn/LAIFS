LOAI_HOP_LE = {"model": "models", "dataset": "datasets", "space": "spaces"}


def tach_repo_id(repo_id):
    if not isinstance(repo_id, str) or not repo_id.strip():
        raise ValueError("repo_id rong")
    phan = repo_id.split("/")
    if len(phan) > 2 or any(not p for p in phan):
        raise ValueError(f"repo_id khong hop le: {repo_id!r}")
    if len(phan) == 1:
        return (None, phan[0])
    return (phan[0], phan[1])


def thu_muc_repo(repo_id, loai="model"):
    if loai not in LOAI_HOP_LE:
        raise ValueError(f"loai khong hop le: {loai!r}")
    to_chuc, ten = tach_repo_id(repo_id)
    phan = [LOAI_HOP_LE[loai]]
    if to_chuc is not None:
        phan.append(to_chuc)
    phan.append(ten)
    return "--".join(phan)


def duong_dan_file(goc, repo_id, revision, ten_file, loai="model"):
    if not revision:
        raise ValueError("revision rong")
    goc = goc.rstrip("/")
    return f"{goc}/{thu_muc_repo(repo_id, loai)}/snapshots/{revision}/{ten_file}"


def don_cache(repos, giu):
    giu = set(giu)
    con_lai = [r for r in repos if r["repo_id"] in giu]
    xoa = [r for r in repos if r["repo_id"] not in giu]
    return {
        "byte_giai_phong": sum(r["byte"] for r in xoa),
        "byte_con_lai": sum(r["byte"] for r in con_lai),
        "repo_xoa": sorted(r["repo_id"] for r in xoa),
    }
