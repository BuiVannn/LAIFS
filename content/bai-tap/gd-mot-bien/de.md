---
tieu_de: Gradient descent một biến
khai_niem: gradient-descent
do_kho: 1
trang_thai: nhap
---

Viết hàm `gradient_descent(dao_ham, w0, lr, so_buoc)` chạy gradient descent cho hàm một biến.

- `dao_ham`: một hàm Python, nhận `w` và trả về đạo hàm $L'(w)$
- `w0`: giá trị khởi đầu
- `lr`: learning rate $\eta$
- `so_buoc`: số bước cập nhật

Mỗi bước cập nhật: $w \leftarrow w - \eta \cdot L'(w)$

Trả về **danh sách tất cả các giá trị của w**, gồm cả `w0`, tức là có `so_buoc + 1` phần tử.

**Ví dụ:** với $L(w) = w^2$ thì $L'(w) = 2w$:

```python
gradient_descent(lambda w: 2 * w, w0=2.5, lr=0.1, so_buoc=2)
# [2.5, 2.0, 1.6]
```
