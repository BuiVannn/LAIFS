---
tieu_de: Cài Adam có hiệu chỉnh thiên lệch
khai_niem: optimizer
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cài **Adam** đầy đủ, **kể cả hai dòng hiệu chỉnh thiên lệch** — đó là phần dễ quên nhất và cũng là phần bộ test soi kỹ nhất.

Viết `chay_adam(grad, w0, lr, T, b1=0.9, b2=0.999, eps=1e-8)`:

- Khởi tạo `m` và `v` bằng **mảng 0** cùng shape với `w`.
- Ở bước thứ $t$ (đếm từ **1**, không phải 0):

$$
m \leftarrow \beta_1 m + (1-\beta_1) g
\qquad
v \leftarrow \beta_2 v + (1-\beta_2) g^2
$$

$$
\hat m = \frac{m}{1 - \beta_1^{\,t}}
\qquad
\hat v = \frac{v}{1 - \beta_2^{\,t}}
\qquad
w \leftarrow w - \eta \cdot \frac{\hat m}{\sqrt{\hat v} + \varepsilon}
$$

- Trả về danh sách `T + 1` mảng như hai bài trước.

**Kiểm tra nhanh:** với $L(w) = w^2$, `w0 = [1.0]`, `lr = 0.1`, mặc định còn lại, bốn bước đầu ra **0.9 → 0.800412 → 0.701586 → 0.603939**.

**Dấu hiệu nhận biết code đúng:** bước **đầu tiên** của Adam luôn dài **đúng bằng `lr`**, bất kể gradient lớn hay nhỏ. Vì $\hat m_1 = g$ và $\hat v_1 = g^2$, nên bước $= \eta g/|g| = \pm\eta$. Nếu bạn quên hiệu chỉnh, bước đầu sẽ dài $\eta(1-\beta_1)/\sqrt{1-\beta_2} = 3.162\,\eta$ — sai hơn 3 lần, và bộ test sẽ bắt được.

**Chú ý:** `t` phải bắt đầu từ 1. Nếu bắt đầu từ 0 thì $1 - \beta^0 = 0$ và bạn chia cho 0.
