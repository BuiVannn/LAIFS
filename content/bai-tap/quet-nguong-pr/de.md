---
tieu_de: Quét ngưỡng, đường precision–recall và ROC-AUC
khai_niem: danh-gia-mo-hinh
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Mô hình thật xuất ra **điểm**, không xuất ra 0/1. Bài này dựng lại đường precision–recall bằng cách quét ngưỡng, rồi tính ROC-AUC bằng đúng định nghĩa đếm cặp.

`diem` là mảng điểm trong $[0, 1]$, `y` là mảng nhãn 0/1 cùng độ dài.

**1.** `du_doan_theo_nguong(diem, t)` — trả về mảng 0/1: bằng 1 khi `diem >= t` (chú ý: **lớn hơn hoặc bằng**).

**2.** `duong_pr(diem, y, nguong)` — `nguong` là mảng các ngưỡng. Trả về tuple hai mảng numpy `(P, R)` cùng độ dài với `nguong`. Khi mẫu số bằng 0 thì phần tử tương ứng là `np.nan`.

**3.** `nguong_tot_nhat(diem, y, nguong)` — trả về tuple `(t, f1)`: ngưỡng cho $F_1$ cao nhất và giá trị $F_1$ đó. Ngưỡng có precision hoặc recall không xác định (hoặc bằng 0) thì coi $F_1 = 0$. Nếu nhiều ngưỡng hoà nhau, lấy ngưỡng đầu tiên trong `nguong`.

**4.** `roc_auc(diem, y)` — tính theo định nghĩa: tỉ lệ cặp (mẫu dương, mẫu âm) mà mẫu dương được chấm **cao hơn**, cặp hoà điểm tính **nửa điểm**.

$$
\text{AUC} = \frac{1}{|P||N|}\sum_{i \in P}\sum_{j \in N}\Big[\mathbb{1}(s_i > s_j) + \tfrac{1}{2}\mathbb{1}(s_i = s_j)\Big]
$$

**Ví dụ** (đúng bảng quét ngưỡng trong bài học):

```python
diem = np.array([0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10])
y    = np.array([1,    0,    1,    1,    0,    0,    1,    0,    0,    0])

P, R = duong_pr(diem, y, diem)
P[3], R[3]                       # 0.75, 0.75      (tại ngưỡng 0.70)
P[0], R[0]                       # 1.00, 0.25      (tại ngưỡng 0.95)
nguong_tot_nhat(diem, y, diem)   # (0.70, 0.75)    — không phải 0.5!
roc_auc(diem, y)                 # 0.7916666...    = 19 / 24
```
