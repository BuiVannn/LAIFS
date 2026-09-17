---
tieu_de: Mô phỏng back-translation
khai_niem: dich-may-it-tai-nguyen
do_kho: 2
trang_thai: nhap
---

Bạn có 20 nghìn cặp câu Việt–Mường thật và 200 nghìn câu tiếng Mường **đơn ngữ**. Hãy dựng đúng quy trình back-translation và đo xem dữ liệu phình ra bao nhiêu, và bao nhiêu phần trong đó là rác.

Ở bài này "mô hình ngược" chỉ là một hàm Python bất kỳ do người gọi truyền vào (`mo_hinh_nguoc(cau) -> str`), nên kết quả hoàn toàn xác định, không cần huấn luyện gì.

### 1. `sinh_cap_gia(don_ngu, mo_hinh_nguoc)`

Nhận danh sách câu đơn ngữ **phía đích** và một mô hình dịch ngược. Trả về danh sách cặp `(nguon_gia, dich_that)`.

Chú ý thứ tự: câu người viết đứng ở **phía đích**, câu máy sinh đứng ở **phía nguồn**. Đó chính là điều làm back-translation an toàn.

```python
sinh_cap_gia(["măn khảu", "tê nhà"], lambda c: c.upper())
# [("MĂN KHẢU", "măn khảu"), ("TÊ NHÀ", "tê nhà")]
```

### 2. `loc_theo_ti_le_dai(cap, min_ti=0.5, max_ti=2.0)`

Bộ lọc rẻ tiền nhưng hiệu quả nhất trong thực tế: bỏ những cặp mà số **từ** hai phía lệch nhau quá xa (dấu hiệu mô hình ngược bị hỏng, lặp vô hạn hoặc trả về rỗng).

Với mỗi cặp `(nguon, dich)`, tính `ti = số_từ(nguon) / số_từ(dich)` (tách từ bằng `.split()`). Giữ cặp khi `min_ti <= ti <= max_ti`. **Bỏ** cặp nếu một trong hai phía không có từ nào.

Trả về danh sách cặp còn giữ, theo đúng thứ tự cũ.

### 3. `tron_du_lieu(song_ngu, cap_gia, lap_that=1)`

Ghép dữ liệu thật với dữ liệu giả. `lap_that` là số lần lặp lại dữ liệu thật (một kỹ thuật thường dùng để dữ liệu giả không lấn át dữ liệu thật).

Trả về một tuple `(du_lieu, ti_le_gia)`:

- `du_lieu`: danh sách gồm `song_ngu` lặp `lap_that` lần, rồi tới `cap_gia`
- `ti_le_gia`: tỉ lệ cặp giả trong tổng số, tức `len(cap_gia) / len(du_lieu)`. Nếu `du_lieu` rỗng thì trả về `0.0`.

```python
that = [("a", "b")]
gia = [("c", "d"), ("e", "f")]
tron_du_lieu(that, gia, lap_that=1)
# ([("a","b"), ("c","d"), ("e","f")], 0.666...)
tron_du_lieu(that, gia, lap_that=4)
# 4 cặp thật + 2 cặp giả -> ti_le_gia = 2/6 = 0.333...
```

Sau khi làm xong, thử trả lời: với 20 000 cặp thật và 200 000 cặp giả, phải đặt `lap_that` bằng bao nhiêu để dữ liệu giả chiếm không quá một nửa?
