---
tieu_de: Đạo hàm số bằng sai phân trung tâm
khai_niem: dao-ham
do_kho: 1
trang_thai: nhap
---

Viết hàm `dao_ham_so(f, x, h=1e-5)` xấp xỉ đạo hàm $f'(x)$ bằng **sai phân trung tâm**:

$$
f'(x) \approx \frac{f(x + h) - f(x - h)}{2h}
$$

- `f`: một hàm Python nhận một số và trả về một số
- `x`: điểm cần tính đạo hàm
- `h`: khoảng nhích nhỏ

Trả về một số (`float`).

**Ví dụ:**

```python
dao_ham_so(lambda x: x ** 2, 3.0)            # ≈ 6.0
dao_ham_so(lambda x: x ** 3, 2.0, h=0.1)     # ≈ 12.01 (sai phân tiến sẽ ra 12.61)
```
