---
tieu_de: MSE, MAE và điểm ngoại lai
khai_niem: ham-mat-mat
do_kho: 1
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết ba hàm, đầu vào là các mảng numpy 1 chiều cùng độ dài. Không dùng vòng lặp.

**1.** `mse(y, y_hat)`: trả về $\frac{1}{n}\sum (y_i - \hat{y}_i)^2$

**2.** `mae(y, y_hat)`: trả về $\frac{1}{n}\sum \lvert y_i - \hat{y}_i \rvert$

**3.** `ty_le_tang(y, y_ngoai_lai, y_hat)`: `y_ngoai_lai` là `y` nhưng có vài giá trị bị nhập sai. Trả về tuple `(tang_mse, tang_mae)`, trong đó

- `tang_mse = mse(y_ngoai_lai, y_hat) / mse(y, y_hat)`
- `tang_mae = mae(y_ngoai_lai, y_hat) / mae(y, y_hat)`

Cả ba hàm trả về `float`.

**Ví dụ** (bảng tính tay trong bài học):

```python
y = np.array([3.0, 5.0, 4.0, 8.0])
y_hat = np.array([2.5, 5.5, 4.0, 6.0])
mse(y, y_hat)   # 1.125
mae(y, y_hat)   # 0.75

y_ngoai_lai = np.array([3.0, 5.0, 4.0, 16.0])
ty_le_tang(y, y_ngoai_lai, y_hat)   # (22.333..., 3.666...)
```

Để ý: cùng một điểm ngoại lai, MSE tăng gấp hơn 22 lần còn MAE chỉ gấp khoảng 3.7 lần.
