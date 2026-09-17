---
tieu_de: Lan truyền xuôi cho cả batch
khai_niem: lan-truyen-xuoi
do_kho: 2
trang_thai: nhap
---

Viết lượt xuôi cho mạng 1 lớp ẩn (sigmoid) và lớp ra tuyến tính, tính **cả batch cùng lúc** bằng numpy.

**1.** `sigmoid(z)`: trả về $\sigma(z) = \dfrac{1}{1 + e^{-z}}$, áp cho từng phần tử của mảng.

**2.** `lan_truyen_xuoi(X, W1, b1, W2, b2)`:

| Tham số | Shape | Ý nghĩa |
|---|---|---|
| `X` | `(n, d)` | batch n mẫu, mỗi **hàng** là một mẫu có d đặc trưng |
| `W1`, `b1` | `(k, d)`, `(k,)` | lớp ẩn k neuron |
| `W2`, `b2` | `(m, k)`, `(m,)` | lớp ra m đầu ra |

Tính:

$$Z_1 = X W_1^\top + b_1 \qquad H = \sigma(Z_1) \qquad \hat{Y} = H W_2^\top + b_2$$

Trả về tuple `(Y_hat, cache)`, trong đó `Y_hat` có shape `(n, m)` và `cache` là dict `{"X": X, "Z1": Z1, "H": H}` (lượt ngược sẽ cần).

**Không dùng vòng lặp `for` qua các mẫu.** Toán tử `@` là nhân ma trận, `.T` là chuyển vị.

**Ví dụ** (mạng mẫu trong bài):

```python
X = np.array([[1.0, 2.0]])
W1 = np.array([[0.2, -0.1], [0.5, 0.25]]); b1 = np.zeros(2)
W2 = np.array([[1.0, -1.0]]);             b2 = np.array([0.5])
Y_hat, cache = lan_truyen_xuoi(X, W1, b1, W2, b2)
# cache["H"] ≈ [[0.5, 0.7311]],  Y_hat ≈ [[0.2689]]
```
