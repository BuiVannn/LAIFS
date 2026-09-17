"""Kiểm tra mọi bài tập: solution.py phải đạt hết test, starter.py phải trượt ít nhất 1 test.

Chạy: npm run check:bai-tap   (cần python3 + numpy)
"""
import json
import pathlib
import sys

GOC = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(GOC / "public"))
from runner import chay  # noqa: E402

loi = 0
for thu_muc in sorted((GOC / "content" / "bai-tap").iterdir()):
    if not thu_muc.is_dir():
        continue
    tests = (thu_muc / "tests.py").read_text()
    for file, can_dat in (("solution.py", True), ("starter.py", False)):
        kq = json.loads(chay((thu_muc / file).read_text(), tests))
        dat_het = kq["loi"] is None and kq["tests"] and all(t["dat"] for t in kq["tests"])
        ok = dat_het == can_dat
        loi += not ok
        print(f"{'OK ' if ok else 'SAI'} {thu_muc.name}/{file}: {sum(t['dat'] for t in kq['tests'])}/{len(kq['tests'])} test đạt"
              + (f" — {kq['loi']}" if kq["loi"] else ""))
        if not ok:
            for t in kq["tests"]:
                if not t["dat"]:
                    print("    ", t["ten"], t["loi"])
sys.exit(1 if loi else 0)
