---
tieu_de: Đếm tham số và shape của MLP
khai_niem: mlp
do_kho: 1
trang_thai: nhap
---

Kiến trúc MLP được cho bằng danh sách số neuron mỗi lớp, ví dụ `[2, 3, 1]` (2 đầu vào, 3 neuron ẩn, 1 đầu ra).

Quy ước: lớp từ $n$ neuron sang $m$ neuron có $W$ shape `(m, n)` và $\mathbf{b}$ shape `(m,)`.

**1.** `dem_tham_so(kien_truc)`: trả về tổng số tham số (trọng số + bias), kiểu `int`.

**2.** `khoi_tao(kien_truc, seed=0)`: trả về danh sách các cặp `(W, b)`, mỗi cặp cho một lớp liền kề:

- `W`: số ngẫu nhiên nhỏ, dùng `rng = np.random.default_rng(seed)` và `rng.normal(0, 0.1, size=...)`
- `b`: toàn số 0

**3.** `chuoi_shape(kien_truc, so_mau)`: khi đưa một batch `so_mau` mẫu (mỗi mẫu một hàng) qua mạng, trả về danh sách shape của dữ liệu tại mỗi lớp, **kể cả lớp vào**.

**Ví dụ:**

```python
dem_tham_so([2, 3, 1])            # 13
[(W.shape, b.shape) for W, b in khoi_tao([2, 3, 1])]
# [((3, 2), (3,)), ((1, 3), (1,))]
chuoi_shape([2, 3, 1], so_mau=5)  # [(5, 2), (5, 3), (5, 1)]
```

**Gợi ý:** `zip(kien_truc[:-1], kien_truc[1:])` cho các cặp (số neuron lớp trước, lớp sau).
