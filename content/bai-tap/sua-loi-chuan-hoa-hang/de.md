---
tieu_de: "Sửa lỗi: chuẩn hoá theo hàng mà trừ theo cột"
khai_niem: doc-loi-python
do_kho: 3
trang_thai: nhap
---

Bài **sửa lỗi** thứ hai, khó hơn: hàm trong ô soạn thảo có **ba** lỗi, và trên dữ liệu thử ban đầu nó chạy trót lọt không kêu ca gì.

## Chuyện đã xảy ra

Cần chuẩn hoá **từng hàng** của ma trận `X` (mỗi hàng là một mẫu): trừ trung bình của chính hàng đó, rồi chia cho độ lệch chuẩn của chính hàng đó. Người viết thử trên một ma trận `3×3`, in ra thấy "trông hợp lý", và đẩy code đi.

Ma trận vuông là cái bẫy: khi số hàng bằng số cột, **mọi nhầm lẫn về trục đều hợp lệ về shape**, nên NumPy không ném lỗi nào.

## Yêu cầu: `chuan_hoa_hang(X)`

Trả về mảng **cùng shape với `X`**, trong đó mỗi hàng đã được chuẩn hoá:

$$
Z_{ij} = \frac{X_{ij} - \mu_i}{\sigma_i},
\qquad
\mu_i = \frac{1}{d}\sum_j X_{ij},
\qquad
\sigma_i = \sqrt{\frac{1}{d}\sum_j (X_{ij} - \mu_i)^2}
$$

Ba điều kiện phải đúng:

1. **Đúng trục.** Sau khi chuẩn hoá, **tổng mỗi hàng bằng 0** và **độ lệch chuẩn mỗi hàng bằng 1**. Đây là bất biến để tự kiểm.
2. **Hàng hằng số không sinh `nan`.** Nếu cả hàng bằng nhau thì $\sigma_i = 0$; chia cho 0 trong NumPy **không ném lỗi**, nó trả `nan` rồi để `nan` lan ra. Với hàng như vậy, trả về **một hàng toàn số 0** và giữ mọi giá trị hữu hạn.
3. **Chịu được đầu vào kiểu số nguyên.** `np.array([[1, 2, 3]])` có `dtype=int64`; chia trong mảng nguyên sẽ cắt mất phần thập phân.

```python
X = np.array([[1., 2., 3.],
              [4., 5., 6.],
              [7., 8., 9.]])

np.round(chuan_hoa_hang(X), 4)
# [[-1.2247  0.  1.2247]
#  [-1.2247  0.  1.2247]
#  [-1.2247  0.  1.2247]]
# ba hang giong het nhau, vi ba hang goc chi lech nhau mot hang so

chuan_hoa_hang(X).sum(axis=1)   # [0., 0., 0.]
chuan_hoa_hang(X).std(axis=1)   # [1., 1., 1.]

chuan_hoa_hang(np.array([[5., 5., 5.]]))   # [[0., 0., 0.]]  — khong phai nan
```

## Gợi ý sửa

Ba manh mối, theo đúng thứ tự nên kiểm:

| Manh mối | Cách lộ ra |
|---|---|
| Sai trục | Thử với ma trận **không vuông**, ví dụ `(5, 3)`. Lỗi trục sẽ thành `ValueError` ngay lập tức |
| Thiếu `keepdims=True` | `X.mean(axis=1)` cho `(n,)`, trừ khỏi `(n, d)` thì broadcasting theo **cột** — sai. `keepdims=True` cho `(n, 1)`, trừ đúng theo hàng |
| Chia cho 0 | `np.where(sd == 0, 1.0, sd)` thay mẫu số 0 bằng 1; tử số lúc đó vốn đã bằng 0 nên kết quả là 0 |

## Vì sao bài này đáng làm

Hai trong ba lỗi ở đây **không sinh ra thông báo nào**. Chúng chỉ lộ ra khi bạn kiểm một **bất biến** — ở đây là "tổng mỗi hàng phải bằng 0". Mỗi phép biến đổi dữ liệu đều có một bất biến như thế; tìm ra và kiểm nó là thói quen đáng giá nhất trong việc gỡ lỗi ML.
