---
tieu_de: log_softmax và cross-entropy từ logit thô
khai_niem: on-dinh-so
do_kho: 3
trang_thai: nhap
---

Đây là bài giải thích vì sao `torch.nn.CrossEntropyLoss` nhận **logit chưa chuẩn hoá** chứ không nhận xác suất: bạn sẽ tự cài lại đúng đường đi an toàn đó.

## 1. `log_softmax(z, axis=-1)`

Cách ngây thơ là tính softmax rồi lấy logarit. Nó hỏng, kể cả khi softmax đã trừ max:

```python
z = np.array([0., -1000.])
p = np.exp(z - z.max()); p /= p.sum()   # [1., 0.]  <- phan tu thu hai tran duoi ve dung 0
np.log(p)                                # [0., -inf]
```

Thông tin "lớp thứ hai có log-xác suất −1000" bị mất sạch, và `-inf` sẽ biến thành `nan` ở bước sau.

Cách đúng là **không bao giờ đi qua $p$**:

$$
\ln p_i = \ln\frac{e^{z_i}}{\sum_k e^{z_k}} = z_i - \ln\sum_k e^{z_k} = z_i - \operatorname{LSE}(\mathbf{z})
$$

Cài hai dòng, vẫn nhớ trừ max bên trong:

1. `s = z - np.max(z, axis=axis, keepdims=True)`
2. `return s - np.log(np.sum(np.exp(s), axis=axis, keepdims=True))`

Kết quả giữ **nguyên shape** của `z` (khác `logsumexp`, vốn bỏ đi một chiều).

## 2. `cross_entropy_tu_logits(Z, nhan)`

- `Z`: shape `(N, K)` — logit thô, mỗi hàng một mẫu
- `nhan`: shape `(N,)` — chỉ số lớp đúng của từng mẫu (số nguyên, từ 0 tới K−1)
- Trả về một `float`: **trung bình** của $-\ln p_{c}$ trên N mẫu, với $c$ là lớp đúng của mẫu đó

Bốc phần tử của lớp đúng ở từng hàng: `lp[np.arange(len(nhan)), nhan]`.

## Ví dụ kiểm chứng

```python
log_softmax(np.array([2., 1., 0.1]))
# [-0.4170300163, -1.4170300163, -2.3170300163]
# exp cua no = [0.659001, 0.242433, 0.098566], cong lai bang 1

log_softmax(np.array([1000., 1001., 1002.]))
# [-2.4076059644, -1.4076059644, -0.4076059644]   (y het log_softmax([0., 1., 2.]))

log_softmax(np.array([0., -1000.]))
# [0., -1000.]           <- day la diem khac biet, cach ngay tho cho [0., -inf]

cross_entropy_tu_logits(np.array([[2., 1., 0.1]]), [0])   # 0.4170300163
cross_entropy_tu_logits(np.array([[2., 1., 0.1]]), [2])   # 2.3170300163
cross_entropy_tu_logits(np.array([[0., -1000.], [1000., 1001.]]), [1, 0])   # 500.6566308438
```

Dòng cuối là bài kiểm tra thật sự: mẫu đầu có loss đúng 1000 (mô hình gán log-xác suất −1000 cho lớp đúng), mẫu sau có loss $\ln(1 + e) = 1.3132616875$. Trung bình là 500.6566. Cách ngây thơ cho `inf`.

## Vì sao phần thập phân hay lặp lại

Để ý 0.4076059644 xuất hiện ở nhiều chỗ: đó là $\ln(1 + e^{-1} + e^{-2})$. Cộng cùng một hằng số vào mọi logit chỉ dịch `z` và `LSE(z)` đi cùng một lượng, nên hiệu $z_i - \operatorname{LSE}(\mathbf{z})$ không đổi. Đây là tính bất biến của softmax, nhìn từ không gian log.
