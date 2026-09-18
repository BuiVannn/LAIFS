---
tieu_de: Đường cong dữ liệu — chất lượng
khai_niem: tai-nguyen-ngon-ngu
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Bạn có bảng đo thật từ Koehn & Knowles 2017 (arXiv:1706.03872, Figure 3): hệ dịch Anh→Tây Ban Nha huấn luyện trên các phần 1/1024, 1/512, ..., toàn bộ của kho 385.7 triệu từ, mỗi mốc gấp đôi mốc trước.

| Số từ | 0.38M | 0.75M | 1.5M | 3.0M | 6.0M | 12.1M | 24.1M | 48.2M | 96.4M | 192.9M | 385.7M |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BLEU (NMT) | 1.6 | 7.2 | 11.9 | 14.7 | 18.2 | 22.4 | 25.7 | 27.4 | 29.2 | 30.3 | 31.1 |

Viết hai hàm để trả lời câu hỏi thực tế: *"bỏ tiền thu thêm dữ liệu thì được thêm bao nhiêu chất lượng?"*

### 1. `loi_ich_gap_doi(diem)`

Nhận danh sách điểm BLEU theo thứ tự tăng dần của kích thước (mỗi mốc gấp đôi mốc trước), trả về danh sách **mức tăng của mỗi lần gấp đôi**. Danh sách kết quả ngắn hơn đầu vào đúng 1 phần tử.

```python
loi_ich_gap_doi([1.6, 7.2, 11.9])
# [5.6, 4.7]   (7.2 − 1.6 và 11.9 − 7.2)
```

### 2. `noi_suy(kich_thuoc, diem, n)`

Ước lượng điểm BLEU tại một kích thước kho `n` bất kỳ bằng **nội suy tuyến tính trên thang log** (vì trục hoành là thang log — đó là lý do đường cong trông gần thẳng).

- `kich_thuoc`: danh sách kích thước kho, tăng dần
- `diem`: điểm tương ứng, cùng độ dài
- `n`: kích thước cần ước lượng

Với `kich_thuoc[i] <= n <= kich_thuoc[i+1]`:

$$
t = \frac{\ln n - \ln k_i}{\ln k_{i+1} - \ln k_i}, \qquad
\text{BLEU} = d_i + t \cdot (d_{i+1} - d_i)
$$

Nếu `n` nằm **ngoài** khoảng đo được thì trả về điểm ở đầu mút gần nhất (không ngoại suy — ngoại suy đường cong này ra ngoài dữ liệu là cách nhanh nhất để nói sai).

```python
k = [1_000_000, 2_000_000, 4_000_000]
d = [10.0, 16.0, 20.0]
noi_suy(k, d, 2_000_000)   # 16.0
noi_suy(k, d, 1_414_213.6) # 13.0  (đúng giữa 1M và 2M trên thang log)
noi_suy(k, d, 500_000)     # 10.0  (dưới mốc nhỏ nhất → kẹp về đầu mút)
```

Gợi ý: dùng `math.log`. Không cần NumPy.
