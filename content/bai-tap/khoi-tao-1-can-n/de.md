---
tieu_de: "Khởi tạo 1/√d và phương sai qua các lớp"
khai_niem: ky-vong-phuong-sai
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Đo tận mắt hiện tượng đã dẫn trong bài: phương sai của tổng $d$ biến độc lập thì **cộng lại**, nên mỗi lớp tuyến tính nhân độ lệch chuẩn của activation với hệ số $\sqrt{d_{\text{in}}}\,\sigma_w$. Hệ số đó khác 1 bao nhiêu thì sau $L$ lớp lệch đi luỹ thừa $L$ lần.

**1. `khoi_tao(kich_thuoc, rng, sigma_w=None)`**

`kich_thuoc` là danh sách `[d0, d1, ..., dL]`. Trả về danh sách `L` ma trận, ma trận thứ $i$ có shape `(d[i+1], d[i])` (quy ước `(d_ra, d_vao)`).

- `sigma_w=None` → mỗi lớp dùng $\sigma_w = 1/\sqrt{d_{\text{in}}}$ với $d_{\text{in}}$ **của chính lớp đó**
- `sigma_w` là số → mọi lớp dùng đúng số đó

Lấy số ngẫu nhiên bằng `rng.normal(scale=..., size=...)` (`rng` là một `np.random.Generator` được truyền vào, để kết quả lặp lại được).

**2. `std_qua_lop(X, Ws)`**

Chạy `X` qua các lớp tuyến tính **không kích hoạt**: `H = H @ W.T` cho từng `W`. Trả về **danh sách** độ lệch chuẩn của activation: phần tử 0 là `X.std()`, phần tử $i$ là std sau lớp thứ $i$. Danh sách có `len(Ws) + 1` phần tử.

Sau đó bạn sẽ thấy: với khởi tạo mặc định, danh sách gần như phẳng ở mức 1; với `sigma_w=0.2` và `d=100`, nó là 1, 2, 4, 8, ... tức $2^i$.

**Ví dụ**: `kich_thuoc=[100, 100]`, `sigma_w=None` cho `std_qua_lop` ≈ `[1.0, 1.0]`; còn `sigma_w=0.2` cho ≈ `[1.0, 2.0]`.
