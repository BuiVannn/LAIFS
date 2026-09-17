---
tieu_de: BPE — học merge rồi tách từ mới
khai_niem: tokenization
do_kho: 2
trang_thai: nhap
---

Cài Byte Pair Encoding bằng Python thuần (không numpy, không thư viện ngoài).

## 1. `hoc_merge(dem_tu, so_merge)`

`dem_tu` là dict `{"từ": số_lần_xuất_hiện}`. Mỗi từ khởi đầu được cắt thành **danh sách ký tự**.

Lặp `so_merge` lần, mỗi vòng:

1. Đếm tần suất mọi **cặp ký hiệu liền kề** trong tất cả các từ (cặp trong một từ được cộng `số_lần_xuất_hiện` của từ đó).
2. Lấy cặp có tần suất **cao nhất**, ghi vào danh sách kết quả dưới dạng tuple `(a, b)`.
3. Gộp mọi lần xuất hiện của cặp đó trong mọi từ thành một ký hiệu `a + b`.

Dừng sớm nếu không còn cặp nào. **Hoà tần suất** thì chọn cặp gặp trước khi duyệt các từ theo thứ tự trong `dem_tu`, mỗi từ duyệt từ trái sang phải (dùng `collections.Counter` và duyệt đúng thứ tự đó là tự khớp).

Trả về danh sách các tuple, theo đúng thứ tự học.

## 2. `ap_dung(merges, tu)`

Tách một từ **mới** (chuỗi) bằng bảng merge đã học. Bắt đầu từ danh sách ký tự, rồi lặp:

- Trong tất cả các cặp liền kề đang có, tìm cặp nào nằm trong `merges` với **thứ hạng nhỏ nhất** (học sớm nhất). Nếu có nhiều vị trí cùng thứ hạng đó, gộp vị trí trái nhất.
- Gộp cặp đó, rồi làm lại.
- Dừng khi không cặp liền kề nào có trong `merges`.

Thứ tự này quan trọng: **luôn áp dụng merge học sớm trước**, không phải quét trái sang phải một lượt.

Trả về danh sách các token.

**Ví dụ:**

```python
dem = {"low": 5, "lower": 2, "newest": 6, "widest": 3}
hoc_merge(dem, 4)
# [('e', 's'), ('es', 't'), ('l', 'o'), ('lo', 'w')]

ap_dung([('e', 's'), ('es', 't'), ('l', 'o'), ('lo', 'w')], "lowest")
# ['low', 'est']
```

Từ `lowest` chưa từng xuất hiện trong corpus, nhưng vẫn ghép được từ hai mảnh đã học — đó chính là điều làm BPE không bao giờ gặp từ "lạ hoàn toàn".
