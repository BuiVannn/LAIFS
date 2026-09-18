---
tieu_de: Cài momentum từ đầu
khai_niem: optimizer
do_kho: 2
trang_thai: nhap
---

Cài gradient descent có **momentum**. Viết hàm `chay_momentum(grad, w0, lr, beta, T)`:

- `grad` là một hàm nhận mảng `w` và trả về gradient (cùng shape với `w`).
- `w0` là mảng numpy điểm xuất phát; `T` là số bước.
- Khởi tạo vận tốc `v` bằng **mảng 0** cùng shape với `w`.
- Mỗi bước:

$$
v \leftarrow \beta\, v + g \qquad w \leftarrow w - \eta\, v
$$

- Trả về **danh sách** `T + 1` mảng: vị trí xuất phát và vị trí sau mỗi bước.

**Kiểm tra nhanh lời giải của bạn:** với $L(w) = w^2$ (tức `grad = lambda w: 2*w`), `w0 = [1.0]`, `lr = 0.1`, `beta = 0.9`, bốn bước đầu phải ra **0.8 → 0.46 → 0.062 → −0.3086**. Bước 4 vượt qua đáy sang âm — đó là hiện tượng vọt lố của momentum, không phải lỗi.

**Gợi ý:** dùng `np.zeros_like(w)` cho `v`, và `w.copy()` khi thêm vào danh sách (nếu không, mọi phần tử sẽ cùng trỏ vào một mảng).
