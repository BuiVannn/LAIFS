---
tieu_de: Hồi quy tuyến tính bằng nghiệm đóng
khai_niem: hoi-quy-tuyen-tinh
do_kho: 2
trang_thai: nhap
---

Dữ liệu gồm ma trận `X` shape `(n, d)` (n mẫu, d đặc trưng) và vector `y` shape `(n,)`.

**1.** Viết hàm `du_doan(X, w, b)` trả về vector dự đoán $\hat{\mathbf{y}} = X\mathbf{w} + b$, shape `(n,)`. Không dùng vòng lặp: dùng phép nhân ma trận `@`.

**2.** Viết hàm `nghiem_dong(X, y)` tìm `w`, `b` làm MSE nhỏ nhất bằng công thức nghiệm đóng (normal equation):

1. Thêm một cột toàn số 1 vào **cuối** `X` để gộp `b` vào: `Xb` có shape `(n, d + 1)`
2. Giải hệ phương trình $(X_b^\top X_b)\,\boldsymbol{\theta} = X_b^\top \mathbf{y}$ để tìm $\boldsymbol{\theta}$ (shape `(d + 1,)`)
3. `w` là `d` phần tử đầu của $\boldsymbol{\theta}$, `b` là phần tử cuối

Trả về tuple `(w, b)`: `w` là mảng numpy shape `(d,)`, `b` kiểu `float`.

**Gợi ý:** `np.hstack`, `np.ones`, `np.linalg.solve(A, v)` (giải $A\theta = v$, ổn định hơn tính nghịch đảo bằng `np.linalg.inv`).

**Ví dụ tính tay:** $x = [1, 2, 3]$, $y = [2, 2, 5]$ cho $w = 1.5$, $b = 0$:

```python
X = np.array([[1.0], [2.0], [3.0]])
w, b = nghiem_dong(X, np.array([2.0, 2.0, 5.0]))
# w ≈ array([1.5]), b ≈ 0.0
du_doan(X, w, b)
# array([1.5, 3. , 4.5])
```
