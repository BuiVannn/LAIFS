---
tieu_de: Thuật toán học perceptron
khai_niem: perceptron
do_kho: 2
trang_thai: nhap
---

Cài perceptron và thuật toán học của nó bằng numpy.

**1.** Viết `du_doan(X, w, b)`:

- `X`: mảng shape `(n, d)`, mỗi hàng một điểm dữ liệu
- `w`: mảng shape `(d,)`, `b`: số thực
- Trả về mảng số nguyên shape `(n,)`: `1` nếu $z = \mathbf{w} \cdot \mathbf{x} + b \ge 0$, ngược lại `0`

**2.** Viết `huan_luyen_perceptron(X, y, lr=1.0, so_epoch=100)`:

1. Khởi tạo `w = np.zeros(d)`, `b = 0.0`
2. Mỗi epoch, duyệt **lần lượt từng điểm theo thứ tự** `i = 0, 1, ..., n-1`:
   - tính $\hat{y}_i$ cho điểm đó (với `w`, `b` hiện tại)
   - cập nhật $\mathbf{w} \leftarrow \mathbf{w} + \eta\,(y_i - \hat{y}_i)\,\mathbf{x}_i$ và $b \leftarrow b + \eta\,(y_i - \hat{y}_i)$
3. Nếu trọn một epoch **không có lần sửa nào** thì dừng sớm
4. Trả về tuple `(w, b)`

**Ví dụ:** cổng AND, sau đúng 1 epoch (xem bảng tính tay trong bài học):

```python
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([0, 0, 0, 1])
huan_luyen_perceptron(X, y, lr=1.0, so_epoch=1)
# (array([1., 1.]), 0.0)
```

**Gợi ý:** vòng ngoài theo epoch, vòng trong theo từng điểm là đủ; không cần vector hoá phần học.
