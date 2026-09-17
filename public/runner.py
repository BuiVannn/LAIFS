# Chạy code người học + các hàm test_* trong tests.py.
# Dùng chung cho trình duyệt (Pyodide worker) và scripts/kiem_tra_bai_tap.py.
import contextlib
import io
import json
import traceback


def chay(code, tests):
    out = io.StringIO()
    ns = {"__name__": "bai_lam"}
    ket_qua = []
    with contextlib.redirect_stdout(out):
        try:
            exec(code, ns)
            exec(tests, ns)
        except Exception:
            return json.dumps({"loi": traceback.format_exc(limit=-1), "stdout": out.getvalue(), "tests": []})
        for ten, ham in list(ns.items()):
            if ten.startswith("test_") and callable(ham):
                try:
                    ham()
                    ket_qua.append({"ten": ten, "dat": True})
                except Exception as e:
                    ket_qua.append({"ten": ten, "dat": False, "loi": f"{type(e).__name__}: {e}"})
    return json.dumps({"loi": None, "stdout": out.getvalue(), "tests": ket_qua})
