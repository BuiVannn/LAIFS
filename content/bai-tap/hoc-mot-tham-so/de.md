---
tieu_de: Học một tham số từ dữ liệu
khai_niem: ml-la-gi
do_kho: 1
trang_thai: nhap
---

Dựng đủ ba mảnh ghép của một bài toán ML nhỏ nhất: mô hình, hàm mất mát, và bước "học".

Mô hình là $f_w(x) = w \cdot x$, hàm mất mát là MSE. Đầu vào là mảng numpy 1 chiều. Không dùng vòng lặp.

**1.** `du_doan(w, x)`: trả về mảng $w \cdot x$.

**2.** `mat_mat(w, x, y)`: trả về $\frac{1}{n}\sum_i (w x_i - y_i)^2$, kiểu `float`.

**3.** `hoc(x, y)`: trả về giá trị $w$ làm `mat_mat` nhỏ nhất, kiểu `float`. Cho đạo hàm bằng 0 sẽ ra nghiệm đóng

$$
w^\star = \frac{\sum_i x_i y_i}{\sum_i x_i^2}
$$

**Ví dụ** (đúng bảng tính tay trong bài học):

```python
x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([2.1, 3.9, 6.2, 7.8])
hoc(x, y)             # 1.99   (= 59.7 / 30)
mat_mat(1.99, x, y)   # 0.02425
mat_mat(2.10, x, y)   # 0.1150
du_doan(1.99, 5.0)    # 9.95
```

Để ý: `mat_mat` tại nghiệm học được phải nhỏ hơn tại mọi giá trị $w$ khác — đó chính là ý nghĩa của chữ "học".
