---
tieu_de: Một epoch mini-batch SGD có xáo dữ liệu
khai_niem: sgd-mini-batch
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cài **một epoch** mini-batch gradient descent cho mô hình một tham số $\hat y = wx$ với loss MSE.

Viết hàm `mot_epoch(x, y, w, lr, B, rng)`:

1. **Xáo** thứ tự các mẫu bằng `rng.permutation(len(x))` — đây là bước bắt buộc, không được bỏ qua.
2. Cắt thứ tự đã xáo thành các nhóm liên tiếp cỡ `B` (nhóm cuối có thể ngắn hơn, vẫn phải dùng).
3. Với **từng** nhóm, tính gradient **trên nhóm đó** rồi cập nhật `w` ngay:

$$
\nabla L_{\mathcal{B}}(w) = \frac{2}{|\mathcal{B}|}\sum_{i \in \mathcal{B}} (w x_i - y_i)\, x_i
\qquad
w \leftarrow w - \eta \cdot \nabla L_{\mathcal{B}}(w)
$$

4. Trả về `w` cuối epoch, kiểu `float`.

**Chú ý:** gradient của nhóm sau phải tính tại giá trị `w` **đã cập nhật** ở nhóm trước, không phải tại `w` đầu epoch. Đó chính là điểm mini-batch tiến nhanh hơn full-batch trong cùng một lượt dữ liệu.

**Gợi ý:** dùng chỉ số mảng của numpy (`x[idx]`) và `np.mean`, không cần vòng lặp qua từng mẫu.
