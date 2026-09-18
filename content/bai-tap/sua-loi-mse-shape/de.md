---
tieu_de: "Sửa lỗi: loss sai gấp trăm lần mà không báo lỗi"
khai_niem: doc-loi-python
do_kho: 2
trang_thai: nhap
---

Đây là bài **sửa lỗi**: code trong ô soạn thảo chạy được, không ném exception nào, và cho ra số sai. Việc của bạn là tìm ra vì sao và sửa cho qua hết test.

## Chuyện đã xảy ra

Một bạn nạp nhãn từ file thành mảng `(n,)`, còn hàm dự đoán của mô hình trả về `(n, 1)` — chuyện rất thường gặp, vì nhiều thư viện trả về cột. Rồi tính:

```python
mse = ((y_that - y_doan) ** 2).mean()
```

Loss in ra 2.375 trong khi sai số thật chỉ 0.025. Không có lỗi nào. Bạn ấy đi chỉnh learning rate suốt hai ngày.

Nguyên nhân: `(n,)` trừ `(n,1)` **không** lỗi. Broadcasting thêm chiều 1 vào bên trái mảng ít chiều hơn, biến `(4,)` thành `(1,4)`, ghép với `(4,1)` cho ra **`(4,4)`**. Chỉ 4 ô trên đường chéo là sai số thật; 12 ô còn lại so nhãn của mẫu này với dự đoán của mẫu khác.

## Yêu cầu

Sửa hai hàm sao cho chúng **đúng dù đầu vào có shape `(n,)` hay `(n,1)`**:

- `mse(y_that, y_doan)` — trả về một **số** (không phải mảng): trung bình bình phương sai số.
- `do_chinh_xac(y_that, y_doan)` — trả về một **số** trong khoảng 0–1: tỉ lệ dự đoán trùng nhãn.

Và cả hai phải **ném lỗi** (`ValueError` hoặc `AssertionError`) khi số mẫu thật sự lệch nhau — ví dụ 4 nhãn nhưng 5 dự đoán. Đó là rào chắn: thà nổ ngay còn hơn trả về một con số sai.

```python
y  = np.array([1.0, 2.0, 3.0, 4.0])            # (4,)
yp = np.array([[1.1], [1.9], [3.2], [3.8]])    # (4, 1)

mse(y, yp)        # ~ 0.025    — khong phai 2.375
mse(yp, y)        # ~ 0.025    — doi cho cung phai ra the
mse(y, y)         # 0.0

do_chinh_xac(np.array([0, 1, 1, 0]), np.array([[0], [1], [0], [0]]))   # 0.75, khong phai 0.5

mse(np.zeros(4), np.zeros(5))   # -> ValueError hoac AssertionError
```

## Gợi ý

Hai công cụ để thống nhất shape:

| Viết | Làm gì |
|---|---|
| `a.ravel()` | Duỗi thành một chiều: `(4,1)` thành `(4,)` |
| `a[:, None]` | Thêm một chiều: `(4,)` thành `(4,1)` |

Chọn **một** quy ước rồi ép cả hai đầu vào về đó — đừng sửa nửa vời. Và nhớ `np.asarray(a, dtype=float)` để mảng số nguyên không cắt mất phần thập phân.

## Tự kiểm

Trước khi bấm chạy test, tự trả lời: `(y_that - y_doan).shape` **phải** bằng bao nhiêu? Nếu bạn không viết ra được con số đó thì chưa sửa xong.
