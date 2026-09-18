---
tieu_de: "Chuẩn L2 và chuẩn hoá từng hàng"
khai_niem: vector-ma-tran
do_kho: 1
trang_thai: nhap
---

Cho ma trận `X` shape `(n, d)`: mỗi **hàng** là một mẫu, mỗi **cột** là một đặc trưng. Viết hai hàm.

**1. `chuan_hang(X)`** — trả về chuẩn L2 của từng hàng, shape `(n,)`:

$$
\|\mathbf{x}_i\|_2 = \sqrt{\sum_{j} X_{ij}^2}
$$

**2. `chuan_hoa_hang(X)`** — chia mỗi hàng cho chuẩn của chính nó, trả về mảng **cùng shape** `(n, d)`. Sau khi chuẩn hoá, mọi hàng đều có chuẩn bằng 1 (đây là bước bắt buộc trước khi tính cosine similarity giữa các embedding).

Hai chú ý:

- Gộp trục nào thì trục đó **biến mất**. Muốn mỗi hàng một số thì gộp trục 1.
- Muốn chia lại `(n, d)` cho kết quả vừa tính, mẫu số phải có shape `(n, 1)` chứ không phải `(n,)` — dùng `keepdims=True`. Thiếu nó, NumPy báo `operands could not be broadcast together`.

Chỉ dùng NumPy thuần. Giả sử không có hàng nào toàn số 0.

**Ví dụ**: với `X = [[3, 4], [1, 0]]` thì `chuan_hang(X) = [5., 1.]` và `chuan_hoa_hang(X) = [[0.6, 0.8], [1., 0.]]`.
