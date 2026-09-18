---
tieu_de: Batch norm lượt ngược, kiểm bằng gradient số
khai_niem: batch-norm
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết `batch_norm_nguoc(dY, X, gamma, eps=1e-5)` trả về tuple `(dX, dgamma, dbeta)`.

`dY` là $\partial L/\partial Y$ shape `(n, d)`, `X` là đầu vào của lớp shape `(n, d)`, `gamma` shape `(d,)`. Hàm tự tính lại $\mu$, $\sigma^2$, $\hat{x}$ từ `X` (chế độ train).

Hai gradient dễ:

$$
\frac{\partial L}{\partial \gamma} = \sum_{i} \frac{\partial L}{\partial y_i}\,\hat{x}_i,
\qquad
\frac{\partial L}{\partial \beta} = \sum_{i} \frac{\partial L}{\partial y_i}
$$

(tổng theo `axis=0`, kết quả shape `(d,)` giống `gamma`).

Gradient khó là $\partial L/\partial X$. Vì $\mu$ và $\sigma^2$ phụ thuộc **mọi** mẫu, gradient của một mẫu chảy sang các mẫu khác. Đặt $g = \gamma \odot \partial L/\partial Y$ và $s = \sqrt{\sigma^2 + \epsilon}$:

$$
\frac{\partial L}{\partial x_i} = \frac{1}{n\,s}\left( n\,g_i - \sum_{k} g_k - \hat{x}_i \sum_{k} g_k\,\hat{x}_k \right)
$$

**Kiểm nhanh bằng tay**: cột 1 của `X = [[1],[3],[4],[5],[7]]` có $\mu = 4$, $s = 2$, $\hat{x} = (-1.5, -0.5, 0, 0.5, 1.5)$. Với `gamma = [2]` và `dY = [[1],[0],[0],[0],[0]]` thì `dgamma = [-1.5]`, `dbeta = [1]`, và

$$
\frac{\partial L}{\partial X} = (0.35,\; -0.35,\; -0.2,\; -0.05,\; 0.25)
$$

Hai bất biến luôn đúng, dùng để tự dò lỗi: $\sum_i \partial L/\partial x_i = 0$ và $\sum_i (\partial L/\partial x_i)\,\hat{x}_i = 0$.

Test sẽ so kết quả của bạn với **gradient số** bằng hàm có sẵn `kiem_tra_gradient(ham_loss, ham_grad, x)`.
