---
tieu_de: Lasso (L1) và đếm hệ số bằng 0
khai_niem: regularization
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Phần phạt L1 có trị tuyệt đối nên không có đạo hàm tại 0, không thể chạy gradient descent thẳng. Cách chuẩn là **ISTA** (proximal gradient): mỗi vòng đi một bước gradient cho phần MSE, rồi *kéo về 0* bằng phép **ngưỡng mềm** (soft threshold).

Hàm mất mát:

$$
J(\mathbf{w}) = \frac{1}{n}\lVert X\mathbf{w} - \mathbf{y}\rVert^2 + \lambda \lVert \mathbf{w}\rVert_1
$$

Viết hàm `lasso_ista(X, y, lam, lr, so_buoc)`, khởi tạo `w` bằng vector 0, rồi lặp `so_buoc` lần:

1. Gradient của riêng phần MSE: $\mathbf{g} = \dfrac{2}{n}X^{\top}(X\mathbf{w} - \mathbf{y})$
2. Bước gradient thường: $\mathbf{z} = \mathbf{w} - \eta\,\mathbf{g}$
3. Ngưỡng mềm với ngưỡng $t = \eta\lambda$, áp dụng cho **từng** toạ độ:

$$
\mathbf{w} \leftarrow \operatorname{sign}(\mathbf{z}) \cdot \max\left(\lvert \mathbf{z}\rvert - t,\; 0\right)
$$

Trả về vector `w` kích thước `(d,)`.

Bước 3 là chỗ L1 khác hẳn L2: mọi toạ độ có $\lvert z_j \rvert \le t$ bị **đặt đúng bằng 0**, không phải "gần 0". Sau khi đạt test, thử đếm `(w == 0).sum()` khi tăng dần `lam` để thấy số hệ số bằng 0 tăng theo.

**Gợi ý:** dùng `np.sign` và `np.maximum` (có chữ `um`, khác `np.max`) để làm cả vector một lượt, không cần vòng lặp qua từng toạ độ.
