---
tieu_de: Cài BLEU từ đầu
khai_niem: danh-gia-dich
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Cài BLEU đúng như công thức trong bài học. Câu đã tách từ sẵn bằng khoảng trắng, dùng `.split()` là đủ.

**1.** `precision_ngram(ban_dich, tham_chieu, n)`

Trả về tuple `(khop, tong)` — số $n$-gram của `ban_dich` khớp với `tham_chieu` **sau khi clipping**, và tổng số $n$-gram của `ban_dich`.

Clipping: mỗi $n$-gram chỉ được tính tối đa bằng số lần nó xuất hiện trong `tham_chieu`. Nếu `ban_dich` ngắn hơn $n$ từ thì `tong = 0`.

```python
precision_ngram("trên trên trên trên trên trên trên",
                "con mèo đang ngồi trên tấm thảm", 1)   # (1, 7)
```

**2.** `brevity_penalty(do_dai_ban_dich, do_dai_tham_chieu)`

$$
\text{BP} = \begin{cases} 1 & c > r \\[4pt] e^{\,1 - r/c} & c \le r \end{cases}
$$

Trường hợp $c = 0$ trả về `0.0`.

**3.** `bleu(ban_dich, tham_chieu, n_max=4)`

Trả về điểm BLEU trên **thang 100**:

$$
\text{BLEU} = 100 \cdot \text{BP} \cdot \exp\!\left( \frac{1}{n_{\max}} \sum_{n=1}^{n_{\max}} \log p_n \right)
$$

Nếu có bất kỳ $p_n$ nào bằng 0 (hoặc `tong` bằng 0) thì trả về `0.0` — đừng để `log(0)` làm chương trình chết.

**Ví dụ** (đúng các con số tính tay trong bài học, tham chiếu là `chính phủ đã công bố kế hoạch mới vào sáng thứ hai`):

```python
bleu("vào sáng thứ hai chính phủ đã công bố kế hoạch mới", REF)  # 83.45
bleu("chính phủ đã thông báo kế hoạch mới vào sáng thứ hai", REF)  # 63.40
bleu("chính phủ đã công bố kế hoạch mới vào sáng thứ ba", REF)     # 90.36
bleu("chính phủ đã công bố kế hoạch mới", REF)                     # 60.65
```

Để ý bản dịch sai ngày (`thứ ba`) được điểm **cao nhất**. Đó không phải lỗi cài đặt — đó là điểm mù của BLEU.
