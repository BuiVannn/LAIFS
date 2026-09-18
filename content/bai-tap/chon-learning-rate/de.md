---
tieu_de: Thử nhiều learning rate
khai_niem: learning-rate
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết hàm `chon_learning_rate(ham_loss, gradient, w0, cac_lr, so_buoc)`:

- `ham_loss(w)`: nhận mảng numpy `w`, trả về loss (một số)
- `gradient(w)`: nhận `w`, trả về gradient (mảng cùng shape với `w`)
- `w0`: mảng numpy, điểm xuất phát
- `cac_lr`: danh sách các learning rate cần thử
- `so_buoc`: số bước gradient descent cho mỗi learning rate

Với **mỗi** `lr`, chạy gradient descent `so_buoc` bước từ `w0` ($\mathbf{w} \leftarrow \mathbf{w} - \eta \nabla L$), rồi tính loss cuối cùng. Nếu loss cuối không hữu hạn (`nan` hoặc `inf`, do phân kỳ) thì ghi là `np.inf`.

Trả về tuple `(lr_tot_nhat, loss_cuoi)`:

- `loss_cuoi`: dict `{lr: loss cuối cùng}`
- `lr_tot_nhat`: learning rate có loss cuối nhỏ nhất

**Lưu ý:** mỗi learning rate phải xuất phát lại từ `w0`. Đừng sửa trực tiếp `w0` (dùng `w = w0.copy()` hoặc `w = w - ...` thay vì `w -= ...`).

**Ví dụ:** $L(\mathbf{w}) = w_1^2 + w_2^2$ thì $\nabla L = 2\mathbf{w}$:

```python
lr, loss = chon_learning_rate(
    lambda w: np.sum(w ** 2), lambda w: 2 * w,
    np.array([3.0, -4.0]), [0.01, 0.1, 1.5], 20)
# lr == 0.1
# loss[0.01] ≈ 11.14 (quá chậm), loss[0.1] ≈ 0.0033, loss[1.5] rất lớn (phân kỳ)
```
