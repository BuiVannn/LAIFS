---
tieu_de: Huấn luyện hồi quy logistic bằng gradient descent
khai_niem: hoi-quy-logistic
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cài hồi quy logistic đầy đủ: sigmoid ổn định số, hàm mất mát, vòng lặp huấn luyện, và dự đoán theo ngưỡng.

## 1. `sigmoid(z)`

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

Phải **ổn định số**: `sigmoid(-1000.0)` không được sinh cảnh báo tràn (test bật `np.errstate(over="raise")`). Mẹo: tính `e = np.exp(-np.abs(z))` — số mũ luôn $\le 0$ nên `e` nằm trong $(0, 1]$, không bao giờ tràn. Sau đó chọn nhánh:

| | công thức | vì sao đúng |
|---|---|---|
| $z < 0$ | `e / (1 + e)` | lúc này $e = e^{z}$, và $\dfrac{e^{z}}{1+e^{z}} = \sigma(z)$ |
| $z \ge 0$ | `1 / (1 + e)` | lúc này $e = e^{-z}$, đúng định nghĩa |

Gợi ý: `np.where(z < 0, ..., ...)` làm cả hai nhánh cùng lúc mà không cần vòng lặp.

## 2. `mat_mat(X, y, w, b)`

Cross-entropy nhị phân **trung bình** trên các mẫu:

$$
L = -\frac{1}{n}\sum_{i=1}^{n}\Big[\, y_i \ln \hat{y}_i + (1 - y_i)\ln(1 - \hat{y}_i) \,\Big], \qquad \hat{y}_i = \sigma(\mathbf{w}\cdot\mathbf{x}_i + b)
$$

- `X`: shape `(n, d)` · `y`: shape `(n,)` gồm 0 và 1 · `w`: shape `(d,)` · `b`: số thực
- Trả về một `float`

## 3. `huan_luyen_logistic(X, y, lr, so_buoc)`

1. Khởi tạo `w = np.zeros(X.shape[1])`, `b = 0.0`
2. Lặp `so_buoc` lần, mỗi lần cập nhật **đồng thời** `w` và `b` bằng đạo hàm rút gọn:

$$
\frac{\partial L}{\partial \mathbf{w}} = \frac{1}{n} X^{\top}(\hat{\mathbf{y}} - \mathbf{y}), \qquad \frac{\partial L}{\partial b} = \frac{1}{n}\sum_i (\hat{y}_i - y_i)
$$

3. Trả về tuple `(w, b)`

## 4. `du_doan(X, w, b, nguong=0.5)`

Trả về mảng **số nguyên** shape `(n,)`: `1` nếu $\hat{y}_i \ge$ `nguong`, ngược lại `0`. Chú ý dùng $\ge$ (bằng đúng ngưỡng thì tính là lớp 1).

## Ví dụ kiểm chứng

Dữ liệu: số giờ ôn bài `x = [1, 2, 3, 4]`, kết quả `y = [0, 0, 1, 1]`.

```python
import numpy as np
X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([0.0, 0.0, 1.0, 1.0])

mat_mat(X, y, np.zeros(1), 0.0)            # 0.6931472  (= ln 2, moi p = 0.5)
huan_luyen_logistic(X, y, 1.0, 1)          # (array([0.5]), 0.0)
huan_luyen_logistic(X, y, 1.0, 2)          # (array([0.2348779]), -0.2629724)
huan_luyen_logistic(X, y, 0.5, 2000)       # (array([5.7987967]), -14.3119719)
```

Với mô hình cuối, biên quyết định nằm ở $-b/w = 2.4681$ giờ: ôn trên chừng đó thì mô hình đoán "đỗ".
