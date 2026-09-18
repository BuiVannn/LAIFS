---
tieu_de: Xavier, He và đo phương sai qua 20 lớp
khai_niem: khoi-tao-trong-so
do_kho: 2
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Hai hàm.

**1. `khoi_tao(n_in, n_out, kieu, rng)`** trả về ma trận `(n_in, n_out)` lấy từ phân phối chuẩn kỳ vọng 0, độ lệch chuẩn tuỳ `kieu`:

| `kieu` | Độ lệch chuẩn |
|---|---|
| `"xavier"` | $\sqrt{2/(n_{\text{in}} + n_{\text{out}})}$ |
| `"he"` | $\sqrt{2/n_{\text{in}}}$ |
| một con số (ví dụ `0.01`) | chính con số đó |

Dùng `rng.normal(0.0, std, size=(n_in, n_out))`.

**2. `do_phuong_sai(kieu, L=20, n=256, seed=0)`** chạy một lượt xuôi qua `L` lớp ReLU rộng `n` và trả về **danh sách `L` số**: phương sai của $z$ (tổng đầu vào, **trước** ReLU) ở từng lớp.

```
rng = np.random.default_rng(seed)
h   = rng.normal(0, 1, (512, n))      # 512 mẫu đầu vào, phương sai 1
lặp L lần:
    W = khoi_tao(n, n, kieu, rng)
    z = h @ W                          # bias = 0
    ghi lại z.var()
    h = ReLU(z)
```

**Kết quả cần thấy:** với `"he"`, phương sai đứng yên quanh 2–3 suốt 20 lớp. Với `"xavier"` trên ReLU, nó giảm khoảng **một nửa mỗi lớp** (vì ReLU vứt nửa tín hiệu mà Xavier không bù), tới lớp 20 chỉ còn cỡ $10^{-6}$. Với `0.01` thì còn $10^{-38}$ — mạng chết hẳn.

Đây chính là phép kiểm 30 giây nên chạy mỗi khi nghi ngờ khởi tạo.
