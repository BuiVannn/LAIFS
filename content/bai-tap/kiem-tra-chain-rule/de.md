---
tieu_de: Tính đạo hàm bằng quy tắc chuỗi (xuôi rồi ngược)
khai_niem: chain-rule
do_kho: 2
trang_thai: nhap
---

Cho chuỗi phép tính:

$$
u = x^2, \qquad v = 3u + 1, \qquad L = v^2
$$

Viết hàm `xuoi_nguoc(x)` trả về **bộ hai** `(L, dL_dx)`:

1. **Lượt xuôi:** tính lần lượt `u`, `v`, `L`.
2. **Lượt ngược:** bắt đầu từ `dL_dv = 2 * v`, rồi nhân dần các đạo hàm cục bộ `dv/du` và `du/dx` để ra `dL_dx`.

Không khai triển cả biểu thức bằng tay: hãy làm đúng hai lượt như trên, vì đó là cách lan truyền ngược hoạt động.

`x` có thể là một số **hoặc** một mảng numpy (khi đó tính theo từng phần tử; nếu chỉ dùng `+ - * **` thì code tự chạy được với mảng).

**Ví dụ:**

```python
xuoi_nguoc(2.0)   # (169.0, 312.0)
```

Test sẽ so kết quả của bạn với **đạo hàm số** (sai phân trung tâm), đúng kiểu người ta kiểm tra code gradient trong thực tế.
