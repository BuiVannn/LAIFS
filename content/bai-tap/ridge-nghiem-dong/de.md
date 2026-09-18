---
tieu_de: Ridge (L2) bằng nghiệm dạng đóng
khai_niem: regularization
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Hồi quy ridge tối thiểu hoá hàm mất mát có thêm phần phạt L2:

$$
J(\mathbf{w}) = \lVert X\mathbf{w} - \mathbf{y} \rVert^2 + \lambda \lVert \mathbf{w} \rVert^2
$$

Cho đạo hàm bằng 0 ta được nghiệm dạng đóng:

$$
\mathbf{w} = \left(X^{\top}X + \lambda I\right)^{-1} X^{\top}\mathbf{y}
$$

Viết hàm `ridge(X, y, lam)` với `X` kích thước `(n, d)`, `y` kích thước `(n,)`:

1. Tính $X^{\top}X$ rồi cộng `lam` nhân ma trận đơn vị `np.eye(d)` (với `d = X.shape[1]`).
2. Giải hệ bằng `np.linalg.solve` — **đừng** gọi `np.linalg.inv` rồi nhân, giải hệ vừa nhanh vừa ổn định hơn.
3. Trả về vector `w` kích thước `(d,)`.

Với `lam = 0` hàm phải trả về đúng nghiệm bình phương tối thiểu thông thường.

**Gợi ý:** `X.T @ X` là ma trận `(d, d)`, `X.T @ y` là vector `(d,)`. Cộng `lam * np.eye(d)` chính là "cộng thêm λ vào đường chéo", chỗ này làm ma trận luôn khả nghịch khi $\lambda > 0$ — đó là lý do ridge cứu được cả những bài toán mà bình phương tối thiểu thường bó tay.
