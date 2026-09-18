---
tieu_de: Bộ lọc corpus song ngữ
khai_niem: du-lieu-song-ngu
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết bộ lọc rẻ tiền cho một corpus song ngữ crawl về — đúng những luật chạy đầu tiên trong thực tế.

**1.** `chuan_hoa(cau)`

Trả về chuỗi đã chuẩn hoá để so sánh: hạ hết chữ hoa, gộp mọi khoảng trắng liên tiếp thành một dấu cách, rồi bỏ các ký tự `. , ! ? ; :` và dấu cách ở **hai đầu** chuỗi.

```python
chuan_hoa("  Chào   buổi sáng!! ")   # "chào buổi sáng"
```

**2.** `loc_corpus(cap_cau, tap_test, ti_le_toi_da=3.0)`

- `cap_cau`: danh sách các tuple `(nguon, dich)`
- `tap_test`: danh sách các tuple `(nguon, dich)` của tập test, không được lọt vào tập huấn luyện

Trả về tuple `(giu_lai, thong_ke)`:

- `giu_lai`: danh sách các cặp được giữ, **nguyên bản** (không chuẩn hoá) và **giữ nguyên thứ tự**
- `thong_ke`: `dict` đếm số cặp bị loại theo từng lý do, với đúng 5 khoá dưới đây (khoá nào không có cặp nào bị loại thì giá trị bằng 0)

Duyệt từng cặp theo thứ tự, kiểm tra **đúng thứ tự** sau đây và dừng ở lý do đầu tiên khớp:

| Khoá | Loại khi |
|---|---|
| `"rong"` | một trong hai vế sau khi chuẩn hoá là chuỗi rỗng |
| `"trung_nhau"` | hai vế sau khi chuẩn hoá giống hệt nhau (menu, mã sản phẩm, tên riêng chưa dịch) |
| `"ti_le_do_dai"` | số từ của vế dài chia cho số từ của vế ngắn **lớn hơn** `ti_le_toi_da` |
| `"ro_ri_test"` | vế nguồn **hoặc** vế đích (đã chuẩn hoá) trùng với vế nguồn / vế đích tương ứng của một cặp trong `tap_test` |
| `"trung_lap"` | cặp `(nguồn chuẩn hoá, đích chuẩn hoá)` đã xuất hiện ở một cặp được giữ trước đó |

Số từ đếm bằng `.split()` trên chuỗi đã chuẩn hoá.

**Ví dụ:**

```python
CAP = [
    ("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
    ("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
    ("Please sign here.", "   "),
    ("OK", "ok"),
    ("Yes.", "Vâng ạ, tôi hoàn toàn đồng ý với anh về chuyện này."),
    ("He didn't say anything.", "Anh ấy không nói gì cả."),
    ("Good morning.", "Chào buổi sáng."),
]
TEST = [("He didn't say anything.", "Anh ta chẳng nói gì.")]

giu, tk = loc_corpus(CAP, TEST)
# giu == [("The meeting was postponed.", "Cuộc họp đã bị hoãn."),
#         ("Good morning.", "Chào buổi sáng.")]
# tk == {"rong": 1, "trung_nhau": 1, "ti_le_do_dai": 1, "ro_ri_test": 1, "trung_lap": 1}
```

Bảy cặp vào, hai cặp ra. Tỉ lệ này không hề phóng đại so với dữ liệu crawl thật.
