---
tieu_de: Cài hàm kích hoạt và đạo hàm
khai_niem: ham-kich-hoat
do_kho: 2
trang_thai: nhap
---

Cài các hàm kích hoạt và đạo hàm của chúng. Mọi hàm nhận một **mảng numpy** `x` (shape bất kỳ) và trả về mảng **cùng shape**, tính từng phần tử.

| Hàm | Công thức |
|---|---|
| `sigmoid(x)` | $\sigma(x) = \dfrac{1}{1 + e^{-x}}$ |
| `dao_ham_sigmoid(x)` | $\sigma(x)\,(1 - \sigma(x))$ |
| `tanh(x)` | được dùng `np.tanh` |
| `dao_ham_tanh(x)` | $1 - \tanh^2(x)$ |
| `relu(x)` | $\max(0, x)$ |
| `dao_ham_relu(x)` | `1.0` nếu $x > 0$, ngược lại `0.0` (quy ước tại 0 lấy 0) |

**Yêu cầu quan trọng:** `sigmoid` phải **ổn định số**: với `x = -1000` hay `x = 1000` không được sinh cảnh báo tràn số (overflow). Test sẽ bật chế độ biến cảnh báo tràn số thành lỗi.

**Gợi ý:**

- Viết thẳng `1 / (1 + np.exp(-x))` sẽ tràn khi `x` rất âm. Tách hai nhánh: $x \ge 0$ dùng $\frac{1}{1+e^{-x}}$, $x < 0$ dùng $\frac{e^{x}}{1+e^{x}}$.
- Cẩn thận: `np.where(dieu_kien, A, B)` vẫn tính **cả** `A` và `B` trên toàn mảng, nên vẫn tràn. Hãy tạo mảng kết quả rồi gán theo mặt nạ: `kq[mat_na] = ...` với `x[mat_na]`.
- Bắt đầu bằng `x = np.asarray(x, dtype=float)`.
