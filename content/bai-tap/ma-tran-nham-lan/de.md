---
tieu_de: Ma trận nhầm lẫn và precision/recall/F1
khai_niem: danh-gia-mo-hinh
do_kho: 2
trang_thai: nhap
---

Cài lại toàn bộ bộ thước đo phân loại nhị phân từ số 0, **kể cả trường hợp mẫu số bằng 0**. Nhãn là mảng numpy chỉ chứa 0 và 1.

**1.** `ma_tran(y, y_hat)` — trả về tuple bốn số nguyên `(tp, fp, fn, tn)`.

**2.** `thuoc_do(tp, fp, fn, tn)` — trả về tuple `(accuracy, precision, recall, f1)`:

- $\text{accuracy} = (TP+TN)/n$
- $\text{precision} = TP/(TP+FP)$, trả về `None` khi $TP+FP = 0$
- $\text{recall} = TP/(TP+FN)$, trả về `None` khi $TP+FN = 0$
- $F_1 = 2PR/(P+R)$, trả về `0.0` khi precision hoặc recall là `None` hoặc bằng 0

Trả `None` chứ **không** lặng lẽ gán 0: "chưa từng báo dương lần nào" là một thất bại hoàn toàn khác với "báo dương nhưng sai".

**3.** `f_beta(p, r, beta)` — trả về $(1+\beta^2)\dfrac{PR}{\beta^2 P + R}$, hoặc `0.0` nếu mẫu số bằng 0.

**Ví dụ** (đúng bảng tính tay trong bài học):

```python
y     = np.array([1] * 10 + [0] * 90)
y_hat = np.array([1] * 6 + [0] * 4 + [1] * 3 + [0] * 87)

ma_tran(y, y_hat)                       # (6, 3, 4, 87)
thuoc_do(6, 3, 4, 87)                   # (0.93, 0.6667, 0.6, 0.6316)
thuoc_do(0, 0, 10, 90)                  # (0.90, None, 0.0, 0.0)  ← mô hình luôn nói "âm"
f_beta(0.6667, 0.6, 2)                  # 0.6123
```
