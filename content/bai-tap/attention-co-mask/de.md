---
tieu_de: Self-attention có mask nhân quả
khai_niem: transformer
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cài lõi của một khối Transformer bằng NumPy thuần.

**1.** `attention(Q, K, V, mask_nhan_qua=True)` với `Q`, `K` shape `(n, d_k)` và `V` shape `(n, d_v)`. Trả về cặp `(ra, trong_so)`:

$$
A = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) \qquad \mathrm{ra} = A \cdot V
$$

($A$ chính là `trong_so` trả về.)

- `trong_so` shape `(n, n)`, softmax theo **từng hàng** (mỗi hàng cộng lại bằng 1), `ra` shape `(n, d_v)`.
- Khi `mask_nhan_qua=True`: trước khi softmax, đặt các ô **phía trên đường chéo** (token $i$ nhìn token $j > i$, tức là nhìn tương lai) thành `-np.inf`. Vì $e^{-\infty} = 0$, các ô đó nhận trọng số đúng bằng 0 còn các ô còn lại trong hàng **vẫn cộng thành 1**.
- Nhớ trừ giá trị lớn nhất của mỗi hàng trước khi `np.exp` cho khỏi tràn số.

**2.** `ma_hoa_vi_tri(n, d)`: trả về ma trận positional encoding shape `(n, d)` (`d` chẵn), với

$$
PE(pos, 2i) = \sin\!\left(\frac{pos}{10000^{2i/d}}\right)
\qquad
PE(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)
$$

Chiều chẵn dùng sin, chiều lẻ dùng cos, và **cặp** chiều $(2i, 2i+1)$ dùng chung một tần số.

**Ví dụ** (ba token *I · eat · rice*, $d_k = 2$, $Q = K = V = [[1,0],[0,1],[1,1]]$, có mask):

```python
trong_so ≈ [[1.0000, 0.0000, 0.0000],
            [0.3302, 0.6698, 0.0000],
            [0.2483, 0.2483, 0.5035]]
ra       ≈ [[1.0000, 0.0000],
            [0.3302, 0.6698],
            [0.7517, 0.7517]]

ma_hoa_vi_tri(2, 4) ≈ [[0.0000, 1.0000, 0.0000, 1.0000],
                       [0.8415, 0.5403, 0.0100, 1.0000]]
```

Test sẽ kiểm tra cả bằng **hành vi**: sửa các hàng phía sau của `K` và `V` mà kết quả của những token phía trước vẫn không đổi thì mask mới thật sự đúng.

**Gợi ý:** `np.triu(np.ones((n, n), dtype=bool), k=1)` cho đúng phần tam giác trên (không kể đường chéo); `PE[:, 0::2]` là các cột chẵn.
