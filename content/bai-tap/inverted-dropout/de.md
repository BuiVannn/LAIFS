---
tieu_de: Inverted dropout đúng chuẩn
khai_niem: dropout
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết hàm `dropout_xuoi(h, p, rng, huan_luyen)` — một lượt xuôi qua lớp dropout.

- `h`: mảng numpy kích hoạt, shape `(B, d)` (B mẫu trong batch).
- `p`: **xác suất GIỮ** một neuron (`p = 0.8` nghĩa là tắt 20%).
- `rng`: một `np.random.Generator`.
- `huan_luyen`: `True` lúc huấn luyện, `False` lúc đánh giá.

Quy tắc:

1. Nếu `huan_luyen` là `False`: trả về `h` **y nguyên**, không tắt gì, không nhân chia gì.
2. Nếu `huan_luyen` là `True`:
   - Sinh mặt nạ Bernoulli **độc lập cho từng phần tử**: `mat_na = rng.random(h.shape) < p`.
   - Trả về `h * mat_na / p`.

Phép chia cho `p` chính là phần "inverted": nó làm kỳ vọng đầu ra không đổi,

$$
\mathbb{E}\!\left[\tilde{h}_i\right] = p \cdot \frac{h_i}{p} + (1 - p)\cdot 0 = h_i
$$

nên lúc đánh giá **không phải sửa gì cả**. Nếu quên chia cho `p`, đầu ra lúc huấn luyện nhỏ hơn lúc đánh giá khoảng `p` lần, và mọi lớp phía sau nhận đầu vào lệch thang.

**Gợi ý:** `rng.random(h.shape)` trả về mảng cùng shape với `h`, các số đều trong $[0, 1)$. So sánh với `p` cho mảng boolean; nhân mảng boolean với mảng số thì `True` thành 1, `False` thành 0. Đừng sinh mặt nạ shape `(d,)` rồi phát tán cho cả batch — như vậy mọi mẫu trong batch bị tắt cùng một bộ neuron.
