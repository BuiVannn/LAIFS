---
tieu_de: Batch norm lượt xuôi, train và eval
khai_niem: batch-norm
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Viết `batch_norm_xuoi(X, gamma, beta, tb_chay, ps_chay, huan_luyen, momentum=0.9, eps=1e-5)`.

`X` shape `(n, d)`: `n` mẫu, `d` đặc trưng. `gamma`, `beta`, `tb_chay` (trung bình chạy), `ps_chay` (phương sai chạy) đều shape `(d,)`.

Hàm trả về **tuple** `(Y, tb_chay_moi, ps_chay_moi)`.

**Khi `huan_luyen=True`:**

$$
\mu = \frac{1}{n}\sum_i x_i, \qquad \sigma^2 = \frac{1}{n}\sum_i (x_i - \mu)^2
$$

tính theo **cột** (`axis=0`), rồi cập nhật thống kê chạy:

$$
\mu_r \leftarrow m\,\mu_r + (1-m)\,\mu, \qquad \sigma_r^2 \leftarrow m\,\sigma_r^2 + (1-m)\,\sigma^2
$$

**Khi `huan_luyen=False`:** dùng thẳng `tb_chay`, `ps_chay` làm $\mu$, $\sigma^2$ và **không** cập nhật chúng. Đây là phần dễ sai nhất: lúc eval tuyệt đối không được nhìn thống kê của batch hiện tại.

**Cả hai chế độ:**

$$
\hat{x} = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}}, \qquad y = \gamma\,\hat{x} + \beta
$$

**Ví dụ** (đúng bảng tính tay trong bài học). Với
`X = [[1,100],[3,300],[4,400],[5,500],[7,700]]`, `gamma = [2, 0.5]`, `beta = [1, -1]`,
`tb_chay = [0,0]`, `ps_chay = [1,1]`, `huan_luyen=True`:

- cột 1 của `Y` là `[-2, 0, 1, 2, 4]`, cột 2 là `[-1.75, -1.25, -1, -0.75, -0.25]`
- `tb_chay_moi = [0.4, 40]`, `ps_chay_moi = [1.3, 4000.9]`

Và với `huan_luyen=False`, `tb_chay = [4, 400]`, `ps_chay = [4, 40000]`, một mẫu duy nhất `X = [[5, 500]]` cho `Y = [[2, -0.75]]`. Nếu bạn cài sai và vẫn dùng thống kê batch, kết quả sẽ ra đúng `beta = [1, -1]` với **mọi** đầu vào.

Gợi ý: `np.mean(X, axis=0)` và `np.var(X, axis=0)` (numpy chia cho `n`, đúng như batch norm cần).
