---
tieu_de: Entropy, KL và cross-entropy — kiểm đẳng thức CE = H(p) + KL(p‖q)
khai_niem: cross-entropy
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Ba đại lượng, một đẳng thức. Cài cả ba bằng numpy rồi để test chứng minh đẳng thức giúp bạn.

Với hai phân phối rời rạc $p, q$ trên cùng $K$ lớp (dùng **logarit tự nhiên**, đơn vị là *nat*):

$$
H(p) = -\sum_k p_k \ln p_k
\qquad
H(p, q) = -\sum_k p_k \ln q_k
\qquad
D_{KL}(p \,\Vert\, q) = \sum_k p_k \ln \frac{p_k}{q_k}
$$

Viết bốn hàm:

1. `entropy(p)` — nhận vector 1 chiều, trả về một số.
2. `cross_entropy(p, q)` — hai vector 1 chiều, trả về một số.
3. `kl(p, q)` — hai vector 1 chiều, trả về một số.
4. `cross_entropy_batch(P, Q)` — `P`, `Q` shape `(n, K)`; trả về cross-entropy **trung bình trên n hàng**. Đây chính là hàm loss dùng khi huấn luyện.

**Cái bẫy duy nhất**: nhãn thật thường là one-hot, tức là có $p_k = 0$. Khi đó `0 * np.log(0)` cho `nan` chứ không phải `0`. Quy ước toán học là $0 \ln 0 = 0$ (giới hạn khi $p \to 0$). Hãy chỉ tính trên các vị trí $p_k > 0$, ví dụ bằng mặt nạ boolean:

```python
kq = np.zeros_like(x)
m = x > 0
kq[m] = x[m] * np.log(y[m])
```

Đừng "sửa" bằng cách cộng epsilon vào $p$ — nó làm sai giá trị và che mất bản chất.

**Ví dụ để tự dò**: `p = [0.5, 0.3, 0.2]`, `q = [0.7, 0.2, 0.1]` cho `entropy ≈ 1.029653`, `cross_entropy ≈ 1.121688`, `kl ≈ 0.092035`. Với nhãn one-hot `p = [1, 0, 0]` và cùng `q` thì `entropy = 0` và `cross_entropy = kl = −ln 0.7 ≈ 0.356675`.
