---
tieu_de: Cosine similarity và láng giềng gần nhất
khai_niem: embedding
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cho một **bảng embedding** nhỏ: `E` shape `(V, d)` (mỗi **hàng** là vector của một từ) và `tu` là danh sách `V` từ, `tu[i]` ứng với hàng `E[i]`.

**1.** `cosine(a, b)` — độ tương đồng cosin giữa hai vector 1 chiều:

$$\cos(a, b) = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert}$$

Nếu một trong hai vector có độ dài 0 thì trả về `0.0` (tránh chia cho 0).

**2.** `lang_gieng(E, tu, muc_tieu, k)` — trả về danh sách `k` cặp `(từ, cosin)` gần `muc_tieu` nhất, **không tính chính nó**, sắp xếp cosin giảm dần. `muc_tieu` là một chuỗi có trong `tu`.

**3.** `tuong_tu(E, tu, a, b, c, k=1)` — phép loại suy "a với b như c với ?": tính vector $v = E_b - E_a + E_c$ rồi trả về `k` từ có cosin với $v$ lớn nhất, **bỏ qua** cả ba từ `a`, `b`, `c`. Trả về danh sách cặp `(từ, cosin)`.

Dùng numpy; `np.linalg.norm`, `E @ v`, `np.argsort` sẽ tiện. Không cần vòng lặp qua từng hàng ở câu 2 và 3.

**Ví dụ** (đúng bảng dùng trong phần trực quan hoá của bài):

```python
tu = ["vua", "hoàng hậu", "đàn ông", "đàn bà", "mèo"]
E = np.array([[4.4, 2.2], [3.6, 3.8], [3.0, 1.0], [2.2, 2.6], [-1.2, 3.4]])

cosine(E[0], E[2])            # 0.9899…  (vua – đàn ông)
lang_gieng(E, tu, "vua", 2)   # [('đàn ông', 0.9899…), ('hoàng hậu', 0.9398…)]
tuong_tu(E, tu, "đàn ông", "vua", "đàn bà")   # [('hoàng hậu', 1.0)]
```

Để ý: «vua» gần «đàn ông» hơn gần «hoàng hậu». Cosin chỉ đo **góc**, và trong bảng này hướng "hoàng gia" lẫn với hướng "giới tính" — phép loại suy ở câu 3 mới tách được hai hướng đó ra.
