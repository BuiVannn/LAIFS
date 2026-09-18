---
tieu_de: Hồi quy tuyến tính bằng gradient descent
khai_niem: gradient-descent
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cho dữ liệu `x`, `y` (mảng numpy 1 chiều). Tìm `w`, `b` để đường thẳng $\hat{y} = wx + b$ khớp dữ liệu nhất, bằng cách tối thiểu hoá hàm mất mát MSE:

$$L(w, b) = \frac{1}{n}\sum_{i=1}^{n} (w x_i + b - y_i)^2$$

Viết hàm `hoi_quy_gd(x, y, lr, so_buoc)`:

1. Khởi tạo `w = 0.0`, `b = 0.0`
2. Lặp `so_buoc` lần, mỗi lần tính gradient rồi cập nhật **đồng thời** cả `w` và `b`:

$$\frac{\partial L}{\partial w} = \frac{2}{n}\sum (w x_i + b - y_i)\, x_i \qquad \frac{\partial L}{\partial b} = \frac{2}{n}\sum (w x_i + b - y_i)$$

3. Trả về tuple `(w, b)` kiểu `float`

**Gợi ý:** dùng phép toán vector của numpy (`np.mean`, nhân mảng), không cần vòng lặp qua từng điểm dữ liệu.
