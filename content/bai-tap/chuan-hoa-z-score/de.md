---
tieu_de: "Chuẩn hoá z-score đúng quy trình"
khai_niem: ky-vong-phuong-sai
do_kho: 1
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Chuẩn hoá từng **cột** (mỗi cột là một đặc trưng) về kỳ vọng 0, độ lệch chuẩn 1:

$$
z = \frac{x - \mu}{\sigma}
$$

Điểm mấu chốt của bài này không phải công thức mà là **quy trình**: thống kê $\mu, \sigma$ chỉ được tính **một lần trên tập huấn luyện**, rồi dùng lại y nguyên cho tập kiểm thử và cho dữ liệu mới. Tính lại trên tập kiểm thử là rò rỉ thông tin — điểm đánh giá đẹp giả và mô hình hỏng khi lên production.

**1. `hoc_thong_ke(X_train)`** — trả về tuple `(mu, sigma)`, mỗi cái shape `(d,)`: trung bình và độ lệch chuẩn của **từng cột**. Dùng `ddof=0` (mặc định của NumPy).

**2. `ap_dung(X, mu, sigma)`** — trả về mảng cùng shape `(n, d)` đã chuẩn hoá. Phải chạy được với `X` chỉ có **một** hàng (dự đoán từng mẫu một khi lên production).

**Ví dụ**: một cột `[2, 4, 4, 4, 5, 5, 7, 9]` có `mu = 5`, `sigma = 2`, và sau chuẩn hoá thành `[-1.5, -0.5, -0.5, -0.5, 0, 0, 1, 2]`.
