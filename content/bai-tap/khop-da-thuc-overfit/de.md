---
tieu_de: Khớp đa thức và nhìn thấy quá khớp
khai_niem: overfitting
do_kho: 2
trang_thai: nhap
---

Cho bốn mảng numpy một chiều: `x_train`, `y_train` (tập huấn luyện) và `x_val`, `y_val` (tập validation).

Viết hàm `khop_da_thuc(x_train, y_train, x_val, y_val, bac)`:

1. Dựng ma trận Vandermonde của `x_train` cho đa thức bậc `bac` bằng `np.vander(x_train, bac + 1)` (cột hệ số giảm dần bậc).
2. Giải bình phương tối thiểu bằng `np.linalg.lstsq(..., rcond=None)[0]` để lấy vector hệ số.
3. Dùng `np.polyval` để dự đoán trên **cả hai** tập, rồi tính MSE của từng tập:

$$
\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}\left(\hat{y}_i - y_i\right)^2
$$

4. Trả về tuple `(mse_train, mse_val)` kiểu `float`.

Sau khi đạt test, hãy tự chạy thử với bậc 1, 3, 7, 9 trên một tập nhỏ và để ý: `mse_train` chỉ có giảm, còn `mse_val` giảm tới một bậc nào đó rồi **quay đầu đi lên**. Chỗ quay đầu chính là ranh giới giữa vừa khéo và quá khớp.

**Gợi ý:** `np.linalg.lstsq` trả về một tuple 4 phần tử, phần tử `[0]` mới là nghiệm. Với `bac + 1` bằng đúng số điểm huấn luyện, đa thức đi qua từng điểm một, `mse_train` sẽ đúng bằng 0.
