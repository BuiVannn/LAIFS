---
tieu_de: Cài RMSProp từ đầu
khai_niem: optimizer
do_kho: 2
trang_thai: nhap
---

Cài **RMSProp**. Viết hàm `chay_rmsprop(grad, w0, lr, beta, T, eps=1e-8)`, cùng dạng với bài momentum:

- Khởi tạo `s` bằng **mảng 0** cùng shape với `w`.
- Mỗi bước, với $g$ là gradient tại $w$:

$$
s \leftarrow \beta\, s + (1 - \beta)\, g^2
\qquad
w \leftarrow w - \eta \cdot \frac{g}{\sqrt{s} + \varepsilon}
$$

- Mọi phép toán là **theo từng phần tử**: mỗi tham số có $s$ riêng nên có độ dài bước riêng.
- Trả về danh sách `T + 1` mảng như bài momentum.

**Kiểm tra nhanh:** với $L(w) = w^2$, `w0 = [1.0]`, `lr = 0.1`, `beta = 0.9`, bốn bước đầu ra **0.683772 → 0.498871 → 0.369181 → 0.272825**.

**Điều đáng chú ý nhất:** bước ĐẦU tiên luôn dài đúng $\eta/\sqrt{1-\beta} = 0.3162$, **bất kể** gradient lớn hay nhỏ. Lý do: $s_1 = (1-\beta)g^2$ nên $\sqrt{s_1} = \sqrt{1-\beta}\,|g|$, và $g$ bị triệt tiêu. Đây là vì $s$ khởi tạo bằng 0 nên bị kéo về 0 ở các bước đầu — đúng vấn đề mà hiệu chỉnh thiên lệch của Adam sinh ra để chữa.
