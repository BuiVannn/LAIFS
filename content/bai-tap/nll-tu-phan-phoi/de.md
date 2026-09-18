---
tieu_de: Từ phân phối ra hàm mất mát (NLL Bernoulli và Gauss)
khai_niem: hop-ly-cuc-dai
do_kho: 2
trang_thai: nhap
---

Bài này chứng minh bằng code điều mà bài học nói bằng lời: **MSE và cross-entropy không ai chọn bừa, chúng rơi ra từ hợp lý cực đại**.

Viết bốn hàm, tất cả nhận mảng numpy 1 chiều:

**1. `nll_bernoulli(y, p)`** — negative log-likelihood **trung bình** khi coi mỗi $y_i \in \{0, 1\}$ là một phép thử Bernoulli với xác suất $p_i$:

$$
\text{NLL} = -\frac{1}{n}\sum_i \big[\, y_i \ln p_i + (1 - y_i)\ln(1 - p_i) \,\big]
$$

Đây đúng là công thức binary cross-entropy.

**2. `nll_gauss(y, mu, sigma)`** — NLL trung bình khi coi $y_i \sim \mathcal{N}(\mu_i, \sigma^2)$ ($\sigma$ là một số, chung cho mọi điểm):

$$
\text{NLL} = \frac{1}{n}\sum_i \left[ \frac{1}{2}\ln(2\pi\sigma^2) + \frac{(y_i - \mu_i)^2}{2\sigma^2} \right]
$$

Số hạng đầu **không phụ thuộc $\mu$**, số hạng sau là MSE chia $2\sigma^2$. Nên tối thiểu NLL theo $\mu$ chính là tối thiểu MSE.

**3. `mle_bernoulli(y)`** — trả về $\hat{p}$ làm NLL nhỏ nhất. Nghiệm đóng: tỉ lệ số 1.

**4. `mle_gauss(y)`** — trả về tuple `(mu_hat, var_hat)`. Nghiệm đóng: trung bình mẫu, và phương sai chia cho $n$ (**không** phải $n-1$).

Gợi ý: `np.log`, `np.mean`. Không dùng vòng `for`.

**Ví dụ để tự dò**: với `y = [1, 0, 1]`, `p = [0.9, 0.2, 0.4]` thì `nll_bernoulli ≈ 0.414932`. Với `y = [2, 4, 4, 4, 5, 5, 7, 9]` thì `mle_gauss` cho `(5.0, 4.0)`, và `nll_gauss(y, 5.0, 2.0) ≈ 2.112086`.
