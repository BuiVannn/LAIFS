---
tieu_de: "Lớp tuyến tính chạy cả batch"
khai_niem: nhan-ma-tran
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Giờ dùng `@` thật sự, và dựng đúng cái mà mọi framework deep learning làm.

**1. `lop_tuyen_tinh(X, W, b)`** — một lớp fully-connected chạy cho cả batch một lần:

$$
Z = X W^\top + \mathbf{b}
$$

- `X` shape `(n, d_vao)`: n mẫu, mỗi mẫu một **hàng**
- `W` shape `(d_ra, d_vao)`: quy ước của sách và của `torch.nn.Linear`
- `b` shape `(d_ra,)`: một bias cho mỗi neuron ra, broadcasting vào từng hàng
- trả về shape `(n, d_ra)`

Viết `X @ W` sẽ báo lỗi shape. Hãy đọc kỹ thông báo lỗi rồi tự suy ra `.T` phải đặt ở đâu.

**2. `mlp_xuoi(X, tham_so)`** — xâu chuỗi nhiều lớp. `tham_so` là danh sách các cặp `(W, b)`. Giữa các lớp dùng ReLU `max(0, z)`; lớp **cuối cùng** thì **không** kích hoạt (đây là quy ước chuẩn: lớp ra để nguyên cho hồi quy, hoặc để softmax/cross-entropy xử lý sau).

Gợi ý: `np.maximum(0, Z)` làm ReLU theo từng phần tử.

**Ví dụ**: `X = [[1, 2, 3], [4, 5, 6]]`, `W = [[1, 0, -1], [0.5, 0.5, 0.5]]`, `b = [1, -1]` cho `lop_tuyen_tinh(X, W, b) = [[-1, 2], [-1, 6.5]]`.
