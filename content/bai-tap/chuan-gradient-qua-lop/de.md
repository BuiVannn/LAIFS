---
tieu_de: Đo chuẩn gradient qua 20 lớp, sigmoid vs ReLU
khai_niem: gradient-bien-mat
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết `chuan_gradient_theo_lop(X, Ws, kich_hoat)` để **nhìn thấy** gradient tắt dần bằng số thật.

Mạng: `X` shape `(n, d)`, `Ws` là danh sách $L$ ma trận vuông shape `(d, d)`. Không có bias.

$$
A_0 = X, \qquad Z_l = A_{l-1} W_l, \qquad A_l = f(Z_l) \quad (l = 1 \dots L)
$$

`kich_hoat` là `"sigmoid"` hoặc `"relu"`. Loss là **trung bình mọi phần tử** của $A_L$, nên

$$
\frac{\partial L}{\partial A_L} = \frac{1}{n \cdot d}\; \text{(ma trận toàn số đó)}
$$

Lượt ngược, chạy từ $l = L$ về $l = 1$:

$$
dZ_l = dA_l \odot f'(Z_l), \qquad
\frac{\partial L}{\partial W_l} = A_{l-1}^\top\, dZ_l, \qquad
dA_{l-1} = dZ_l\, W_l^\top
$$

Hàm trả về **danh sách $L$ số**: chuẩn Frobenius $\lVert \partial L/\partial W_l \rVert$ theo thứ tự lớp 1 → lớp $L$ (`np.linalg.norm`).

Đạo hàm cần dùng: $\sigma'(z) = a(1-a)$ với $a = \sigma(z)$; $\text{ReLU}'(z) = 1$ nếu $z > 0$, bằng 0 nếu không.

**Kỳ vọng** (test sẽ kiểm): với 20 lớp sigmoid và trọng số khởi tạo nhỏ, chuẩn ở lớp 1 nhỏ hơn lớp 20 cả chục bậc mười. Với ReLU và khởi tạo He ($\sigma = \sqrt{2/d}$), mọi lớp cùng cỡ độ lớn. In danh sách ra và tự nhìn hai dãy số đó cạnh nhau — đó là toàn bộ nội dung bài học này.

Gợi ý: lưu lại các $Z_l$ và $A_l$ ở lượt xuôi rồi mới chạy ngược; danh sách chuẩn gom theo chiều ngược nên nhớ đảo lại trước khi trả về.
