# Chạy code người học + các hàm test_* trong tests.py.
# Dùng chung cho trình duyệt (Pyodide worker) và scripts/kiem_tra_bai_tap.py.
import contextlib
import io
import json
import re
import traceback

# Gợi ý tiếng Việt cho các lỗi Python hay gặp nhất với người mới
GOI_Y = [
    (r"NotImplementedError", "Bạn chưa viết code: thay dòng `raise NotImplementedError` bằng lời giải của mình."),
    (r"name '(\w+)' is not defined", "Chưa có `{0}`. Kiểm tra lỗi gõ tên, hoặc bạn quên định nghĩa/`import` nó."),
    (r"operands could not be broadcast|could not be broadcast together", "Lỗi shape: hai mảng không khớp kích thước. In `.shape` của từng mảng ra xem."),
    (r"shapes \(.*?\) and \(.*?\) not aligned", "Nhân ma trận sai chiều: `(a, b) @ (b, c)` mới hợp lệ. Có thể bạn thiếu `.T`."),
    (r"IndexError", "Chỉ số vượt ngoài mảng. Nhớ chỉ số chạy từ 0 tới len(x) − 1."),
    (r"ZeroDivisionError|divide by zero", "Chia cho 0. Với số học ma trận, thường do mẫu số là tổng bằng 0 hoặc mảng rỗng."),
    (r"'NoneType' object", "Một hàm trả về `None`: nhiều khả năng bạn quên `return`."),
    (r"IndentationError|expected an indented block", "Lỗi thụt lề: Python bắt buộc thụt lề đều nhau (dùng 4 dấu cách)."),
    (r"SyntaxError", "Lỗi cú pháp: kiểm tra dấu ngoặc, dấu hai chấm cuối dòng `def`/`for`/`if`."),
    (r"TypeError: .*takes \d+ positional argument", "Số tham số truyền vào hàm không khớp với lúc định nghĩa."),
    (r"overflow encountered", "Tràn số: hàm mũ với số lớn. Với sigmoid/softmax, hãy trừ giá trị lớn nhất trước khi mũ."),
    (r"RecursionError", "Đệ quy vô hạn: hàm tự gọi chính nó mà không có điều kiện dừng."),
]


def goi_y_loi(text: str):
    for mau, y in GOI_Y:
        m = re.search(mau, text)
        if m:
            return y.format(*m.groups()) if m.groups() else y
    return None


def kiem_tra_gradient(ham_loss, ham_grad, x, eps=1e-5, sai_so=1e-6):
    """So gradient giải tích với sai phân trung tâm (dùng chung cho các bài deep learning).

    Trả về (dat, chenh_lech_tuong_doi_lon_nhat).
    """
    import numpy as np

    x = np.array(x, dtype=float)
    g = np.array(ham_grad(x), dtype=float)
    so = np.zeros_like(x)
    it = np.nditer(x, flags=["multi_index"])
    while not it.finished:
        i = it.multi_index
        cu = x[i]
        x[i] = cu + eps
        tren = ham_loss(x)
        x[i] = cu - eps
        duoi = ham_loss(x)
        x[i] = cu
        so[i] = (tren - duoi) / (2 * eps)
        it.iternext()
    chenh = float(np.max(np.abs(g - so) / np.maximum(1e-8, np.abs(g) + np.abs(so))))
    return chenh <= sai_so, chenh


def chay(code, tests):
    out = io.StringIO()
    ns = {"__name__": "bai_lam", "kiem_tra_gradient": kiem_tra_gradient}
    ket_qua = []
    with contextlib.redirect_stdout(out):
        try:
            exec(code, ns)
            exec(tests, ns)
        except Exception:
            loi = traceback.format_exc(limit=-1)
            return json.dumps({"loi": loi, "goi_y": goi_y_loi(loi), "stdout": out.getvalue(), "tests": []})
        for ten, ham in list(ns.items()):
            if ten.startswith("test_") and callable(ham):
                try:
                    ham()
                    ket_qua.append({"ten": ten, "dat": True})
                except Exception as e:
                    mo_ta = f"{type(e).__name__}: {e}"
                    ket_qua.append({"ten": ten, "dat": False, "loi": mo_ta, "goi_y": goi_y_loi(mo_ta)})
    return json.dumps({"loi": None, "goi_y": None, "stdout": out.getvalue(), "tests": ket_qua})
