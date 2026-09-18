---
tieu_de: "Nhân ma trận bằng tay, ba góc nhìn"
khai_niem: nhan-ma-tran
do_kho: 1
trang_thai: nhap
---

Cài đặt phép nhân ma trận bằng vòng lặp để thấy rõ chỉ số chạy thế nào. **Không dùng `@`, `np.dot`, `np.matmul`, `np.einsum`** trong ba hàm dưới (test có kiểm).

**1. `tich_vo_huong(u, v)`** — hai vector 1 chiều cùng độ dài, trả về **một số**:

$$
\mathbf{u}\cdot\mathbf{v} = \sum_i u_i v_i
$$

**2. `nhan(A, B)`** — `A` shape `(m, n)`, `B` shape `(n, p)`, trả về `(m, p)` với

$$
C_{ij} = \sum_k A_{ik} B_{kj}
$$

Nếu chiều trong không khớp (`A.shape[1] != B.shape[0]`), `raise ValueError`.

**3. `cot_ket_qua(A, B, j)`** — cùng một phép toán, nhìn theo **góc tổ hợp cột**: cột $j$ của $AB$ là tổ hợp tuyến tính các cột của $A$ với hệ số lấy từ cột $j$ của $B$.

$$
(AB)_{:,j} = \sum_k B_{kj} \, A_{:,k}
$$

Hàm này trả về mảng shape `(m,)` và phải khớp với `nhan(A, B)[:, j]`. Hai công thức nhìn rất khác nhau nhưng cho cùng kết quả — đó chính là bài học của bài này.

**Ví dụ**: `A = [[1, 2, 3], [4, 5, 6]]`, `B = [[1, 0], [0, 1], [1, 1]]` cho `nhan(A, B) = [[4, 5], [10, 11]]` và `cot_ket_qua(A, B, 0) = [4, 10]`.
