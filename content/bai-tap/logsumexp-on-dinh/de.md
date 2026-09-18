---
tieu_de: Cài logsumexp ổn định số
khai_niem: on-dinh-so
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Rất nhiều công thức cần đại lượng $\ln \sum_k e^{z_k}$ — gọi tắt là **log-sum-exp** (LSE). Viết thẳng theo định nghĩa thì hỏng ở **cả hai đầu**:

```python
np.log(np.sum(np.exp(np.array([1000., 1001., 1002.]))))    # inf  (e^1000 tran tren)
np.log(np.sum(np.exp(np.array([-1000., -1001., -1002.])))) # -inf (e^-1000 tran duoi ve 0)
```

## Yêu cầu: `logsumexp(z, axis=-1)`

Dùng phép biến đổi **chính xác** (không phải xấp xỉ) sau, với $m = \max_k z_k$:

$$
\ln\sum_k e^{z_k}
= \ln\left(e^{m}\sum_k e^{z_k - m}\right)
= m + \ln\sum_k e^{z_k - m}
$$

Vì sao an toàn: mọi $z_k - m \le 0$ nên $e^{z_k - m} \in (0, 1]$ — không bao giờ tràn trên. Và số hạng đạt max cho đúng $e^{0} = 1$, nên tổng luôn $\ge 1$: logarit không bao giờ nhận 0.

Ba bước:

1. `m = np.max(z, axis=axis, keepdims=True)` — nhớ `keepdims=True` để trừ được theo đúng trục
2. `kq = m + np.log(np.sum(np.exp(z - m), axis=axis, keepdims=True))`
3. Bỏ trục đã cộng: `np.squeeze(kq, axis=axis)`

- `z`: mảng NumPy bất kỳ · `axis`: trục lấy tổng (mặc định trục cuối)
- Trả về mảng ít hơn đúng một chiều so với `z`

## Ví dụ kiểm chứng

```python
logsumexp(np.array([0., 1., 2.]))              # 2.4076059644
logsumexp(np.array([1000., 1001., 1002.]))     # 1002.4076059644
logsumexp(np.array([-1000., -1001., -1002.]))  # -999.5923940356
logsumexp(np.array([0., 900., 1000.]))         # 1000.0

A = np.array([[0., 1., 2.], [1000., 1001., 1002.]])
logsumexp(A, axis=-1)   # [   2.4076,  1002.4076]
logsumexp(A, axis=0)    # [1000., 1001., 1002.]
```

Để ý ba ví dụ đầu: phần thập phân **giống hệt nhau** (0.4076059644), vì cộng cùng một hằng số vào mọi $z_k$ chỉ làm LSE dịch đi đúng hằng số đó.

## Tự kiểm bằng bất đẳng thức

Kết quả đúng luôn thoả:

$$
\max_k z_k \;\le\; \operatorname{LSE}(\mathbf{z}) \;\le\; \max_k z_k + \ln K
$$

Vế trái vì tổng lớn hơn một số hạng; vế phải vì mọi số hạng đều $\le e^{m}$. Đây cũng là lý do LSE được gọi là "max mềm" cho **giá trị** (còn softmax là max mềm cho **vị trí**).
