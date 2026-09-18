---
tieu_de: Gradient số của hàm nhiều biến
khai_niem: dao-ham-rieng-gradient
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết hàm `gradient_so(f, x, h=1e-5)` xấp xỉ gradient $\nabla f(x)$ bằng cách nhích **từng phần tử** của `x`:

$$
\frac{\partial f}{\partial x_i} \approx \frac{f(\dots, x_i + h, \dots) - f(\dots, x_i - h, \dots)}{2h}
$$

- `f`: hàm nhận một mảng numpy và trả về **một số**
- `x`: mảng numpy (có thể là vector hoặc ma trận)
- Trả về mảng numpy **cùng shape** với `x`
- **Không được làm thay đổi** mảng `x` truyền vào

**Ví dụ:** $f(x, y) = x^2 + 3y^2$ tại $(1, 2)$:

```python
f = lambda v: v[0] ** 2 + 3 * v[1] ** 2
gradient_so(f, np.array([1.0, 2.0]))   # ≈ array([ 2., 12.])
```

**Gợi ý:** `x.copy()`, vòng lặp qua `range(x.size)`, và `.reshape(-1)` hoặc `np.ndindex(x.shape)` để duyệt được cả ma trận.
