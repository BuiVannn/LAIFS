---
tieu_de: Lan truyền ngược và kiểm tra bằng gradient số
khai_niem: lan-truyen-nguoc
do_kho: 3
trang_thai: nhap
---

Mạng giống bài lan truyền xuôi: lớp ẩn sigmoid, lớp ra tuyến tính. Hàm `lan_truyen_xuoi` đã được viết sẵn trong starter. Loss là bình phương sai số **trung bình trên batch**:

$$L = \frac{1}{n}\sum_{i=1}^{n}\sum_{j} (\hat{Y}_{ij} - Y_{ij})^2$$

Viết `lan_truyen_nguoc(X, Y, W1, b1, W2, b2)`: chạy lượt xuôi, rồi trả về dict `{"dW1": ..., "db1": ..., "dW2": ..., "db2": ...}`, mỗi phần tử là gradient của $L$ theo tham số tương ứng và **có cùng shape với tham số đó**.

Các bước (X shape `(n, d)`, `n = X.shape[0]`):

$$
\begin{aligned}
\Delta_2 &= \tfrac{2}{n}(\hat{Y} - Y) & dW_2 &= \Delta_2^\top H & db_2 &= \textstyle\sum_{\text{hàng}} \Delta_2 \\
dH &= \Delta_2 W_2 & \Delta_1 &= dH \odot H \odot (1 - H) \\
dW_1 &= \Delta_1^\top X & db_1 &= \textstyle\sum_{\text{hàng}} \Delta_1
\end{aligned}
$$

$\odot$ là nhân từng phần tử (`*` trong numpy); tổng theo hàng là `.sum(axis=0)`.

Test sẽ so sánh kết quả của bạn với **gradient số**: nhích từng tham số một lượng nhỏ $\varepsilon$ và đo loss thay đổi. Nếu lệch, hãy in shape từng biến ra để dò.

**Ví dụ** (mạng mẫu trong bài, `X = [[1, 2]]`, `Y = [[1]]`): `db2 ≈ [-1.4621]`, `dW1 ≈ [[-0.3655, -0.7311], [0.2875, 0.5749]]`.
