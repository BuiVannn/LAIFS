"""Quét thư mục PDF ở máy → tạo phiếu tài liệu (chỉ METADATA, không trích nội dung).

Chạy: python3 scripts/quet_pdf.py resources
Cần: poppler (pdfinfo, pdftotext) — `brew install poppler`
File PDF KHÔNG được đưa lên repo (xem .gitignore).
"""
import pathlib
import re
import subprocess
import sys
import unicodedata

GOC = pathlib.Path(__file__).resolve().parent.parent
RA = GOC / "content" / "tai-lieu"


def chay(*args):
    try:
        return subprocess.run(args, capture_output=True, text=True, timeout=120).stdout
    except Exception:
        return ""


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")[:60]


def thong_tin(f: pathlib.Path):
    info = dict(
        re.split(r":\s+", d, maxsplit=1) for d in chay("pdfinfo", str(f)).splitlines() if ":" in d and len(re.split(r":\s+", d, maxsplit=1)) == 2
    )
    ten = (info.get("Title") or "").strip()
    if len(ten) < 4 or ten.lower().endswith(".pdf"):
        ten = re.sub(r"[_.]+", " ", f.stem)
        ten = re.sub(r"\(Z-Library\)|EBooksWorld\.ir|\d{9,}", "", ten).strip(" -")
    return ten, (info.get("Author") or "").strip(), info.get("Pages", "?")


def muc_luc(f: pathlib.Path, so_trang=18):
    """Lấy các dòng trông như mục lục (số chương + tên). Chỉ dùng tên chương làm chỉ dẫn."""
    txt = chay("pdftotext", "-f", "1", "-l", str(so_trang), str(f), "-")
    ds = []
    for d in txt.splitlines():
        d = d.strip()
        m = re.match(r"^(?:Chapter\s+)?(\d{1,2})[.)]?\s+([A-Z][^.]{4,60}?)(?:\s*[.·]{2,}.*)?$", d)
        if m and not m.group(2).isupper():
            ds.append((m.group(1), m.group(2).strip()))
    ra, da = [], set()
    for so, ten in ds:
        if so not in da:
            da.add(so)
            ra.append((so, ten))
    return ra[:20]


def duong_dan(f: pathlib.Path) -> str:
    r = f.resolve()
    return str(r.relative_to(GOC)) if GOC in r.parents else str(r)


def main(thu_muc: str):
    files = sorted(pathlib.Path(thu_muc).rglob("*.pdf"))
    if not files:
        sys.exit(f"Không thấy PDF nào trong {thu_muc}")
    for f in files:
        ten, tac_gia, trang = thong_tin(f)
        id_ = slug(ten) or slug(f.stem)
        dich = RA / f"{id_}.md"
        if dich.exists():
            print(f"bỏ qua (đã có): {id_}")
            continue
        ml = muc_luc(f)
        chuong = "\n".join(f'  - so: "{so}"\n    ten: "{t.replace(chr(34), "")}"\n    khai_niem: []' for so, t in ml)
        dich.write_text(
            f"""---
tieu_de: "{ten.replace('"', '')}"
tac_gia: [{f'"{tac_gia}"' if tac_gia else ''}]
loai: sach
quyen: khong-ro
khai_niem: []
chuong:
{chuong if chuong else "  []"}
file_may: "{duong_dan(f)}"
trang_thai: nhap
---

*{trang} trang. Chưa có ghi chú — viết tóm tắt của riêng bạn ở đây (không chép nguyên văn).*
"""
        )
        print(f"tạo {id_} ({len(ml)} chương đọc được)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "resources")
