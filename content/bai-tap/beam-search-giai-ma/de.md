---
tieu_de: Giải mã greedy và beam search
khai_niem: dich-may-nmt
do_kho: 2
trang_thai: nhap
---

Mô hình dịch được thay bằng một **bảng xác suất cho sẵn**: `bang` là dict, khoá là tiền tố đã sinh (một `tuple` token, tiền tố rỗng là `()`), giá trị là dict `{token kế tiếp: xác suất}`.

```python
BANG = {
    (): {"I": 0.5, "We": 0.3},
    ("I",): {"am": 0.5, "eat": 0.4},
    ("We",): {"eat": 0.6, "are": 0.4},
    ("I", "am"): {"eating": 0.5, "hungry": 0.3},
    ("I", "eat"): {"rice": 0.9, "bread": 0.1},
    ...
}
```

**1.** `giai_ma_greedy(bang, so_buoc)`: mỗi bước chọn token có xác suất **cao nhất**, lặp `so_buoc` lần. Trả về `(cau, log_prob)` với `cau` là `list` các token và `log_prob` là **tổng** `np.log` của các xác suất đã chọn.

**2.** `beam_search(bang, k, so_buoc)`: giữ `k` tiền tố tốt nhất theo tổng log-xác suất. Mỗi bước:

- mở rộng **mọi** tiền tố đang giữ với **mọi** token kế tiếp có trong bảng;
- chấm điểm `log_prob(tiền tố) + np.log(p)`;
- sắp xếp giảm dần, giữ lại `k` cái đầu.

Trả về `list` các cặp `(cau, log_prob)` **sắp xếp giảm dần theo log_prob**, nhiều nhất `k` phần tử — phần tử đầu tiên là bản dịch được chọn.

**Ví dụ** với bảng đầy đủ trong test (dịch "Tôi ăn cơm"):

```python
giai_ma_greedy(BANG, 3)   # (["I", "am", "eating"], -2.0794)
beam_search(BANG, 2, 3)[0]  # (["I", "eat", "rice"], -1.7148)
beam_search(BANG, 3, 3)[0]  # (["Rice", "is", "eaten"], -1.6094)
```

Greedy khoá vào `am` ở bước 2 (0.5 > 0.4) rồi không quay đầu được; beam `k = 2` giữ song song cả hai nhánh nên bắt được `rice` với xác suất 0.9 ở bước 3. Còn `k = 3` cho thấy mặt trái: nó tìm ra câu có xác suất **cao hơn** nhưng dịch **tệ hơn**.

**Gợi ý:** `max(d.items(), key=lambda kv: kv[1])` cho token xác suất cao nhất; `ung_vien.sort(key=lambda x: -x[1])` để sắp giảm dần. Dùng `tuple` làm tiền tố (khoá dict được), chỉ đổi sang `list` khi trả về.
