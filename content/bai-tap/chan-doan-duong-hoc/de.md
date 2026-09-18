---
tieu_de: Chẩn đoán đường học train/val
khai_niem: overfitting
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cho hai mảng cùng độ dài: `train[i]` và `val[i]` là loss ở epoch `i`. Viết hàm

`chan_doan(train, val, nguong_cao=0.5, nguong_hoi=0.05)`

trả về tuple `(nhan, epoch_dung)` theo đúng thứ tự luật dưới đây (gặp luật nào đúng trước thì dừng):

| # | Điều kiện | `nhan` |
|---|---|---|
| 1 | `min(val) < min(train) - nguong_hoi` | `"nghi-du-lieu"` |
| 2 | `train[-1] > nguong_cao` | `"chua-khop"` |
| 3 | `val[-1] - min(val) > nguong_hoi` | `"qua-khop"` |
| 4 | còn lại | `"vua-kheo"` |

`epoch_dung = int(np.argmin(val))` — epoch có val loss thấp nhất, tức là điểm early stopping.

Ý nghĩa từng luật:

- **Luật 1** bắt tình huống "val dễ hơn train một cách bất thường". Đây gần như luôn là lỗi đường ống dữ liệu (rò rỉ, tập val quá nhỏ hoặc quá dễ, hoặc train đang bị dropout/augmentation làm khó còn val thì không), không phải tin vui.
- **Luật 2**: train loss còn cao thì mô hình chưa học nổi cả tập train, bàn chuyện quá khớp là vô nghĩa.
- **Luật 3**: val đã chạm đáy rồi bò lên — kinh điển của quá khớp.

Trả về `nhan` là chuỗi, `epoch_dung` là `int`.

**Gợi ý:** `np.min`, `np.argmin`; `train[-1]` là phần tử cuối. Nhớ ép `int(...)` vì `np.argmin` trả về kiểu numpy chứ không phải `int` của Python.
