---
tieu_de: Softmax có nhiệt độ và hai giới hạn của nó
khai_niem: softmax
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Núm "temperature" khi dùng LLM sinh văn bản chính là tham số $\tau$ trong công thức này. Bài tập kiểm chứng bằng code hai giới hạn $\tau \to 0$ và $\tau \to \infty$.

## 1. `softmax_nhiet_do(z, tau=1.0, axis=-1)`

$$
\text{softmax}(\mathbf{z}/\tau)_i = \frac{e^{z_i/\tau}}{\sum_k e^{z_k/\tau}}
$$

- Chia cho `tau` **trước**, rồi mới trừ max theo `axis` và lấy `exp` (trừ max sau khi chia thì mới chặn được tràn số khi `tau` rất nhỏ).
- Kết quả giữ nguyên shape của `z`, tổng theo `axis` bằng 1.

**Trường hợp `tau == 0`** phải xử lý riêng, không được chia cho 0: trả về one-hot tại vị trí lớn nhất theo `axis`. Nếu nhiều vị trí cùng đạt max thì chia đều cho chúng (ví dụ `[5, 5, 1]` cho `[0.5, 0.5, 0]`).

## 2. `entropy(p, axis=-1)`

$$
H(\mathbf{p}) = -\sum_i p_i \ln p_i
$$

Quy ước $0 \ln 0 = 0$. Mẹo tránh `log(0)`: thay các $p_i = 0$ bằng 1 trước khi lấy logarit, vì $0 \cdot \ln 1 = 0$ vẫn đúng.

Entropy đo độ "phẳng" của phân phối: bằng 0 khi one-hot, và lớn nhất bằng $\ln K$ khi phân bố đều.

## Ví dụ kiểm chứng

Với `z = [2.0, 1.0, 0.1]` (K = 3, nên $\ln K = 1.0986$):

| `tau` | kết quả | entropy |
|---|---|---|
| 0 | `[1, 0, 0]` | 0 |
| 0.5 | `[0.863777, 0.116900, 0.019323]` | 0.4537 |
| 1.0 | `[0.659001, 0.242433, 0.098566]` | 0.8467 |
| 2.0 | `[0.501688, 0.304289, 0.194023]` | 1.0262 |
| $10^{6}$ | `[0.3333, 0.3333, 0.3333]` | → 1.0986 |

Cột entropy **tăng đơn điệu** theo `tau`: đó chính là phát biểu định lượng của câu "τ nhỏ thì nhọn, τ lớn thì phẳng". Bộ test kiểm tra đúng tính chất này.

## Vì sao phải trừ max SAU khi chia cho tau

Với `tau = 1e-6` và `z = [2, 1, 0.1]`, sau khi chia ta có `z/tau = [2e6, 1e6, 1e5]`. Lấy `exp` thẳng là tràn ngay. Trừ max trước khi chia cũng không cứu được (`[0, -1, -1.9] / 1e-6 = [0, -1e6, -1.9e6]` thì lại tràn dưới, may là ra 0 nên vẫn đúng — nhưng thứ tự "chia rồi mới trừ max" mới là cách an toàn trong mọi trường hợp, kể cả khi `tau` lớn).

## Liên hệ

Trong sinh văn bản: `tau` nhỏ cho câu chữ an toàn, lặp lại, luôn chọn từ dễ đoán nhất; `tau` lớn cho câu chữ đa dạng nhưng dễ lạc đề. Ở `tau = 0` thì mô hình thành hoàn toàn tất định — đó là lý do các thư viện sinh văn bản xử lý `tau = 0` bằng `argmax` chứ không chia cho 0.
