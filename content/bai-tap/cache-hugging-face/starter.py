LOAI_HOP_LE = {"model": "models", "dataset": "datasets", "space": "spaces"}


def tach_repo_id(repo_id):
    # "Helsinki-NLP/opus-mt-vi-en" -> ("Helsinki-NLP", "opus-mt-vi-en")
    # "gpt2"                       -> (None, "gpt2")
    # rong, co 2 dau "/" tro len, hoac co phan rong ("a/") -> raise ValueError
    raise NotImplementedError


def thu_muc_repo(repo_id, loai="model"):
    # loai ngoai LOAI_HOP_LE -> raise ValueError
    # Noi bang "--": <models|datasets|spaces>[--<to_chuc>]--<ten>
    raise NotImplementedError


def duong_dan_file(goc, repo_id, revision, ten_file, loai="model"):
    # revision rong -> raise ValueError
    # Bo dau "/" thua o cuoi `goc`, roi ghep:
    #   <goc>/<thu_muc_repo>/snapshots/<revision>/<ten_file>
    raise NotImplementedError


def don_cache(repos, giu):
    # repos: list dict {"repo_id": str, "byte": int}; giu: cac repo_id muon giu lai
    # tra ve dict: byte_giai_phong, byte_con_lai, repo_xoa (list da sorted)
    raise NotImplementedError
