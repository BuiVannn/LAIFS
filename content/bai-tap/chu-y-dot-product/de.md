---
tieu_de: Chú ý dot-product bằng NumPy
khai_niem: attention
do_kho: 2
trang_thai: nhap
---

Cài cơ chế **chú ý dot-product**: điểm tương hợp → softmax → vector ngữ cảnh.

## 1. `softmax(x, axis=-1)`

Softmax **ổn định số**: trừ đi giá trị lớn nhất theo trục trước khi lấy `exp`.

$$
\text{softmax}(x)_i = \frac{e^{x_i - \max x}}{\sum_j e^{x_j - \max x}}
$$

- `x`: mảng NumPy bất kỳ
- `axis`: trục lấy tổng (mặc định trục cuối)
- Trả về mảng cùng shape với `x`, tổng theo `axis` bằng 1

Không trừ max thì `softmax(np.array([1000.0, 1001.0]))` cho `nan` vì $e^{1000}$ tràn số. Trừ max xong kết quả vẫn **y hệt** về mặt toán học (tử và mẫu cùng chia cho $e^{\max x}$).

## 2. `chu_y(H, s)`

- `H`: shape `(T, k)` — hàng thứ `j` là trạng thái mã hoá $h_j$ của từ nguồn thứ `j`
- `s`: shape `(k,)` — trạng thái giải mã hiện tại (câu truy vấn)

Các bước:

1. Điểm: $e_j = h_j \cdot s$ → vector shape `(T,)`
2. Trọng số: $\alpha = \text{softmax}(e)$ → shape `(T,)`, tổng bằng 1
3. Ngữ cảnh: $c = \sum_j \alpha_j h_j$ → shape `(k,)`

Trả về **tuple** `(alpha, c)`.

**Ví dụ** (nguồn "con mèo đen", đang sinh từ đích `the`):

```python
import numpy as np
H = np.array([[ 2.0,  0.0],    # con
              [ 0.0,  2.0],    # mèo
              [-1.5, -1.5]])   # đen
alpha, c = chu_y(H, np.array([1.5, 0.0]))
# điểm  = [3.0, 0.0, -2.25]
# alpha ≈ [0.9478, 0.0472, 0.0050]   (tổng = 1)
# c     ≈ [1.8882, 0.0869]           (gần như bằng h_con)
```

Để ý: `c` có shape `(k,)` giống một trạng thái mã hoá, nhưng được tính **lại cho từng bước giải mã** — khác hẳn vector ngữ cảnh cố định của seq2seq.
