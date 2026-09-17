---
tieu_de: Bộ mã hoá RNN cho seq2seq
khai_niem: seq2seq
do_kho: 2
trang_thai: nhap
---

Viết bộ **mã hoá** (encoder) của một mô hình seq2seq bằng NumPy thuần: chạy một RNN tanh qua chuỗi embedding của câu nguồn, lấy trạng thái ẩn cuối cùng làm **vector ngữ cảnh**.

## 1. `buoc_rnn(h, x, Wh, Wx, b)`

Một bước RNN:

$$
h_{\text{moi}} = \tanh(W_h h + W_x x + b)
$$

- `h`: trạng thái ẩn hiện tại, shape `(k,)`
- `x`: embedding của từ đang đọc, shape `(d,)`
- `Wh` shape `(k, k)`, `Wx` shape `(k, d)`, `b` shape `(k,)`
- Trả về mảng shape `(k,)`

## 2. `ma_hoa(X, Wh, Wx, b)`

Chạy `buoc_rnn` lần lượt qua cả câu, bắt đầu từ $h_0 = \mathbf{0}$.

- `X`: shape `(T, d)` — hàng thứ `t` là embedding của từ thứ `t`
- Trả về **tuple** `(H, c)`:
  - `H` shape `(T, k)` — hàng thứ `t` là $h_t$ (KHÔNG chứa $h_0$)
  - `c` shape `(k,)` — vector ngữ cảnh, chính là $h_T$ (trạng thái ẩn cuối)

**Ví dụ** (câu nguồn "con mèo đen", embedding 2 chiều, $W_h = 0.9 I$, $W_x = I$, $b = 0$):

```python
import numpy as np
X = np.array([[1.0, 0.0],    # con
              [0.0, 1.0],    # mèo
              [1.0, 1.0]])   # đen
H, c = ma_hoa(X, 0.9 * np.eye(2), np.eye(2), np.zeros(2))
# H ≈ [[0.7616, 0.0   ],
#      [0.5950, 0.7616],
#      [0.9114, 0.9336]]
# c ≈ [0.9114, 0.9336]
```

Để ý: `c` có shape `(k,)` **bất kể câu dài bao nhiêu từ**. Đó chính là nút thắt ngữ cảnh của seq2seq.
