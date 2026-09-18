---
tieu_de: "Tự cài đặt quy tắc broadcasting"
khai_niem: vector-ma-tran
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cách chắc chắn nhất để không bao giờ đoán nhầm shape nữa: tự viết lại quy tắc broadcasting.

Viết `shape_broadcast(a, b)` nhận hai tuple shape, trả về tuple shape kết quả, hoặc `None` nếu hai shape **không** broadcasting được với nhau.

Quy tắc của NumPy, so từ **phải sang trái**:

1. Shape ngắn hơn được thêm `1` vào **bên trái** cho đủ số chiều.
2. Với mỗi cặp chiều: bằng nhau thì giữ nguyên; có một bên bằng 1 thì lấy bên kia.
3. Ngược lại → không broadcasting được.

| a | b | kết quả |
|---|---|---|
| `(3, 2)` | `(2,)` | `(3, 2)` |
| `(3, 2)` | `(3,)` | `None` |
| `(3, 2)` | `(3, 1)` | `(3, 2)` |
| `(2,)` | `(2, 1)` | `(2, 2)` |
| `(4, 1, 3)` | `(5, 3)` | `(4, 5, 3)` |
| `()` | `(2, 5)` | `(2, 5)` |

Chỉ dùng Python thuần — **không** gọi `np.broadcast_shapes` (test sẽ so kết quả của bạn với nó). Dòng thứ hai của bảng là dòng đáng nhớ nhất: cộng một số cho mỗi mẫu thì shape phải là `(n, 1)`, không phải `(n,)`.
