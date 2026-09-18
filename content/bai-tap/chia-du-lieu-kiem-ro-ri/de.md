---
tieu_de: Chia train/val/test và kiểm rò rỉ
khai_niem: train-val-test
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Chia dữ liệu thì dễ; kiểm xem có rò rỉ không mới là phần hay bị bỏ qua. Bài này cài cả hai.

**1.** `chia(pi, ti_le)` — `pi` là mảng chỉ số đã xáo trộn, `ti_le` là tuple `(p_train, p_val, p_test)`. Trả về tuple ba mảng `(train, val, test)`, cắt **liên tiếp** theo đúng thứ tự của `pi`. Số mẫu val và test lấy phần nguyên của `n * p`, phần còn lại dồn hết cho train (nên tổng luôn đúng bằng `n`).

**2.** `trung_lap(X, A, B)` — `X` là mảng 2 chiều, mỗi hàng một mẫu; `A`, `B` là hai mảng chỉ số. Trả về **danh sách đã sắp xếp** các chỉ số `i` thuộc `B` mà hàng `X[i]` **trùng nội dung** với ít nhất một hàng của `A`. Đây là phép kiểm rò rỉ thật sự — hai tập chỉ số không giao nhau vẫn có thể trùng nội dung.

**3.** `k_fold(pi, k)` — trả về danh sách `k` tuple `(train, val)`. Cắt `pi` thành `k` đoạn liên tiếp gần bằng nhau; mỗi đoạn làm val đúng một vòng, phần còn lại (giữ nguyên thứ tự của `pi`) làm train.

**Ví dụ** (đúng bảng tính tay trong bài học):

```python
pi = np.array([3, 7, 0, 9, 4, 1, 8, 2, 6, 5])
chia(pi, (0.6, 0.2, 0.2))
# (array([3, 7, 0, 9, 4, 1]), array([8, 2]), array([6, 5]))

X = np.array([[1., 0], [2, 1], [3, 0], [4, 1], [5, 0],
              [5, 0], [1, 0], [6, 1], [7, 0], [8, 1]])
trung_lap(X, [3, 7, 0, 9, 4, 1], [6, 5])   # [5, 6]  ← dòng 6 sao chép dòng 0, dòng 5 sao chép dòng 4

k_fold(pi, 5)[0]
# (array([0, 9, 4, 1, 8, 2, 6, 5]), array([3, 7]))
```
