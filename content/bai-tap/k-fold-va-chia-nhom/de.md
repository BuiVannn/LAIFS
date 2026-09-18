---
tieu_de: Chia theo thời gian và theo nhóm
khai_niem: train-val-test
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Chia ngẫu nhiên là mặc định, không phải luôn đúng. Dữ liệu có thứ tự thời gian hoặc có nhóm phải chia kiểu khác.

**1.** `chia_thoi_gian(t, n_test)` — `t` là mảng mốc thời gian của từng mẫu (số, càng lớn càng mới). Trả về tuple `(train, test)` gồm chỉ số: `test` là `n_test` mẫu **mới nhất**, `train` là toàn bộ phần cũ hơn. Trong mỗi tập, chỉ số xếp theo thời gian tăng dần; mẫu cùng mốc thời gian giữ nguyên thứ tự xuất hiện.

**2.** `chia_theo_nhom(nhom, nhom_test)` — `nhom` là mảng mã nhóm của từng mẫu (ví dụ mã bệnh nhân), `nhom_test` là danh sách các nhóm được chọn làm test. Trả về `(train, test)` gồm chỉ số, sao cho **mọi mẫu của một nhóm đều nằm cùng một tập**.

**3.** `cua_so_tien(n, k)` — k-fold cho dữ liệu thời gian, kiểu "cửa sổ tiến". Chia `n` mẫu (đã xếp theo thời gian, chỉ số 0..n−1) thành `k + 1` đoạn liên tiếp gần bằng nhau. Trả về danh sách `k` tuple `(train, val)`: vòng `j` lấy `j + 1` đoạn đầu làm train và đoạn thứ `j + 2` làm val. **Không vòng nào được train trên dữ liệu mới hơn val của nó.**

**Ví dụ**:

```python
t = np.array([5, 1, 9, 3, 7])
chia_thoi_gian(t, 2)        # (array([1, 3, 0]), array([4, 2]))

nhom = np.array(["A", "A", "B", "B", "B", "C"])
chia_theo_nhom(nhom, ["B"]) # (array([0, 1, 5]), array([2, 3, 4]))

cua_so_tien(10, 4)[0]       # (array([0, 1]), array([2, 3]))
cua_so_tien(10, 4)[3]       # (array([0, 1, 2, 3, 4, 5, 6, 7]), array([8, 9]))
```
