"""Kiểm định bộ test bằng đột biến: cài lỗi kinh điển vào solution.py rồi xem test có bắt được không.

Chạy: npm run dot-bien            (toàn bộ bài tập)
      npm run dot-bien -- <tên-bài>

Đột biến "sống sót" = test vẫn xanh dù lời giải đã sai → bộ test có lỗ hổng, phải bổ sung test.
KHÔNG ghi đè file: mọi đột biến chỉ nằm trong bộ nhớ.
"""
import json
import pathlib
import re
import sys

GOC = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(GOC / "public"))
from runner import chay  # noqa: E402

# (tên, mẫu tìm, thay bằng) — áp dụng lần lượt từng đột biến một
DOT_BIEN = [
    ("đổi dấu trừ thành cộng", r"(?<![-+*/=<>!])\s-\s", " + "),
    ("mean → sum", r"\bnp\.mean\(", "np.sum("),
    ("sum → mean", r"\bnp\.sum\(", "np.mean("),
    ("đổi trục 0 ↔ 1", r"axis=0", "axis=1"),
    ("đổi trục 1 ↔ 0", r"axis=1", "axis=0"),
    ("bỏ chuyển vị .T", r"\.T\b", ""),
    ("đổi >= thành >", r">=", ">"),
    ("đổi <= thành <", r"<=", "<"),
    ("bỏ nhân learning rate", r"\blr\s*\*\s*", ""),
    ("bỏ hệ số 2", r"\b2\s*\*\s*", ""),
    ("max → min", r"\bnp\.max\(", "np.min("),
    ("bỏ keepdims", r",\s*keepdims=True", ""),
    ("đổi hằng số (×1.1)", r"(?<![\w.])(\d+\.\d+)(?![\w.])", None),  # xử lý riêng
]


def ap_dung(src: str, ten: str, mau: str, thay):
    if thay is None:  # nhân một hằng số thập phân với 1.1
        for m in re.finditer(mau, src):
            cu = float(m.group(1))
            moi_so = cu * 1.1
            if cu == 0 or f"{moi_so:.6g}" == m.group(1):
                continue  # đổi 0.0 → 0 chẳng thay đổi gì
            dong = src[: m.start(1)].rsplit("\n", 1)[-1]
            if dong.lstrip().startswith(("def ", "#")) or "=" in dong.split("(")[-1]:
                continue  # giá trị mặc định của tham số: test thường truyền tay, bỏ qua
            return src[: m.start(1)] + f"{moi_so:.6g}" + src[m.end(1) :]
        return None
    moi, n = re.subn(mau, thay, src, count=1)
    return moi if n else None


def kiem(thu_muc: pathlib.Path):
    tests = (thu_muc / "tests.py").read_text()
    # tests.py có thể khai báo bỏ qua đột biến tương đương về mặt toán:
    #   # dot-bien-bo-qua: <tên đột biến> — <lý do>
    bo_qua = [d.split(":", 1)[1].split("—")[0].strip() for d in tests.splitlines() if d.startswith("# dot-bien-bo-qua:")]
    bo_qua = [x.strip() for m in bo_qua for x in m.split(",")]
    goc = (thu_muc / "solution.py").read_text()
    kq_goc = json.loads(chay(goc, tests))
    if kq_goc["loi"] or not all(t["dat"] for t in kq_goc["tests"]):
        return None, ["lời giải gốc KHÔNG đạt hết test"]
    song_sot, so = [], 0
    for ten, mau, thay in DOT_BIEN:
        if any(ten.startswith(b) for b in bo_qua):
            continue
        moi = ap_dung(goc, ten, mau, thay)
        if moi is None or moi == goc:
            continue
        so += 1
        kq = json.loads(chay(moi, tests))
        if not kq["loi"] and kq["tests"] and all(t["dat"] for t in kq["tests"]):
            dong = next((f"{a.strip()} → {b.strip()}" for a, b in zip(goc.splitlines(), moi.splitlines()) if a != b), "?")
            song_sot.append(f"{ten} [{dong[:90]}]")
    return so, song_sot


def main(loc=None):
    loi = 0
    for thu_muc in sorted((GOC / "content" / "bai-tap").iterdir()):
        if not thu_muc.is_dir() or (loc and loc not in thu_muc.name):
            continue
        if not (thu_muc / "solution.py").exists():
            continue
        so, song_sot = kiem(thu_muc)
        if so is None:
            print(f"SAI {thu_muc.name}: {song_sot[0]}")
            loi += 1
        elif song_sot:
            print(f"HỞ {thu_muc.name}: {len(song_sot)}/{so} đột biến KHÔNG bị bắt → {', '.join(song_sot)}")
            loi += 1
        else:
            print(f"OK  {thu_muc.name}: bắt hết {so} đột biến")
    print("\nCần bổ sung test cho các bài 'HỞ' ở trên." if loi else "\nMọi bộ test đều bắt được đột biến.")
    return 1 if loi else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else None))
