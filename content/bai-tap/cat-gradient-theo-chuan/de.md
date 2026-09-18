---
tieu_de: Gradient clipping theo chuẩn toàn cục
khai_niem: gradient-bien-mat
do_kho: 2
trang_thai: nhap
---

Cách chữa gradient bùng nổ: trước khi cập nhật, nếu gradient quá dài thì **co lại, giữ nguyên hướng**.

Viết hai hàm.

**1. `chuan_toan_cuc(gs)`** — `gs` là danh sách mảng numpy (mỗi mảng là gradient của một tham số, shape khác nhau). Trả về một **số**: chuẩn của toàn bộ gradient khi gộp mọi mảng thành một vector duy nhất.

$$
\lVert g \rVert = \sqrt{\sum_{\text{moi mang}} \sum_{\text{moi phan tu}} g_i^2}
$$

**2. `cat_gradient(gs, nguong)`** — trả về danh sách mảng MỚI (không sửa `gs` tại chỗ):

$$
g \leftarrow \begin{cases}
g & \text{khi } \lVert g \rVert \le c \\[4pt]
\dfrac{c}{\lVert g \rVert}\, g & \text{khi } \lVert g \rVert > c
\end{cases}
$$

Ba điều dễ sai:

- Chuẩn tính trên **toàn bộ** gradient gộp lại, không phải từng mảng riêng. Cắt riêng từng mảng sẽ làm lệch hướng tổng.
- Hệ số co áp cho **mọi** mảng như nhau. Nhờ vậy hướng của vector gộp không đổi, chỉ độ dài bị chặn.
- Chuẩn bằng 0 (mọi gradient đều 0) không được gây chia cho 0.

**Ví dụ**: `gs = [np.array([6., 8.])]`, `nguong = 5` → chuẩn là 10, hệ số co là 0.5, kết quả `[[3., 4.]]`, chuẩn mới đúng bằng 5.

Nếu `nguong = 20` thì chuẩn 10 đã dưới ngưỡng, trả về `[[6., 8.]]` y nguyên.
