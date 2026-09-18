---
tieu_de: Ngân sách phiên GPU và nhịp lưu checkpoint
khai_niem: colab-kaggle
do_kho: 2
trang_thai: nhap
---

GPU miễn phí không phải "vô hạn nhưng chậm", mà là **hai cái đồng hồ đếm ngược song song**:

- **Đồng hồ phiên**: một phiên có tuổi thọ tối đa (Colab miễn phí ghi trong FAQ là tối đa 12 giờ, và ngắt sớm hơn nếu bạn để yên; Kaggle cho 12 giờ mỗi phiên CPU/GPU, 9 giờ với TPU). Hết phiên là **đĩa tạm mất sạch**.
- **Đồng hồ hạn mức**: Kaggle cấp một quỹ giờ GPU theo tuần (mốc quen thuộc là 30 giờ, nhưng Kaggle nói rõ con số này thay đổi theo nhu cầu). Hết quỹ là phiên đang chạy **bị cắt giữa chừng**.

Bài này không cần mạng: bạn cài lại đúng phép tính mà lẽ ra phải làm **trước** khi bấm nút chạy, chứ không phải sau khi mất 6 tiếng huấn luyện.

## 1. `ke_hoach_phien(so_epoch, phut_moi_epoch, gioi_han_phien, moi_n_epoch_luu)`

Trả về `dict` bốn khoá:

| Khoá | Ý nghĩa | Công thức |
|---|---|---|
| `epoch_moi_phien` | Số epoch chạy **trọn** trong một phiên | `gioi_han_phien // phut_moi_epoch` |
| `so_phien` | Số phiên cần để chạy hết | `ceil(so_epoch / epoch_moi_phien)` |
| `epoch_mat_toi_da` | Công sức mất nhiều nhất nếu đứt bất ngờ | `min(moi_n_epoch_luu, epoch_moi_phien) - 1` |
| `tong_phut` | Tổng thời gian máy chạy | `so_epoch * phut_moi_epoch` |

Ba chỗ dễ sai, và đều là sai thật ngoài đời:

- `epoch_moi_phien` phải **chia lấy phần nguyên**. Epoch thứ 29 bắt đầu ở phút 700 của phiên 720 phút thì nó không kịp xong — coi như không có.
- `so_phien` phải **làm tròn lên**. 29 epoch với 28 epoch mỗi phiên là hai phiên, không phải một.
- `epoch_mat_toi_da` bị chặn bởi sức chứa của phiên: khai `moi_n_epoch_luu = 100` trong một phiên chỉ chứa nổi 4 epoch thì bạn mất nhiều nhất 3 epoch, không phải 99.

Kiểm tra đầu vào: mọi tham số phải dương, và `phut_moi_epoch > gioi_han_phien` là bất khả thi (`raise ValueError`) — trả về `epoch_moi_phien = 0` rồi chia cho 0 là cách hỏng tệ hơn nhiều.

## 2. `quota_con(quota_phut, cac_phien)`

`cac_phien` là danh sách độ dài (phút) các phiên bạn định chạy, theo thứ tự. Trả về:

```
(phut_con_lai, so_phien_chay_tron, bi_cat)
```

Luật: phiên nào **dài hơn** quota còn lại thì bị cắt giữa chừng — nó ăn hết phần quota còn lại, không được tính là phiên trọn, và mọi phiên sau đó không chạy được nữa. Trả về `(0, số phiên trọn, True)`.

Chú ý dấu: phiên dài **đúng bằng** quota còn lại thì vẫn chạy trọn. Viết `>=` thay vì `>` là mất oan một phiên.

## Ví dụ kiểm chứng

```python
ke_hoach_phien(so_epoch=30, phut_moi_epoch=25, gioi_han_phien=720, moi_n_epoch_luu=5)
# {'epoch_moi_phien': 28, 'so_phien': 2, 'epoch_mat_toi_da': 4, 'tong_phut': 750}

ke_hoach_phien(so_epoch=20, phut_moi_epoch=10, gioi_han_phien=45, moi_n_epoch_luu=100)
# {'epoch_moi_phien': 4, 'so_phien': 5, 'epoch_mat_toi_da': 3, 'tong_phut': 200}

quota_con(1800, [600, 600, 300])   # (300, 3, False)
quota_con(1800, [720, 720, 720])   # (0, 2, True)     <- phien thu ba chet giua chung
quota_con(1440, [720, 720])        # (0, 2, False)    <- vua khit, khong bi cat
```

## Đọc lại kết quả

Ví dụ đầu nói: 30 epoch ở 25 phút một epoch **không** vừa một phiên Colab. Có hai lối đi, và bạn phải chọn **trước** khi chạy:

1. Lưu checkpoint mỗi 5 epoch lên Google Drive, chấp nhận mất nhiều nhất 4 epoch khi đứt, rồi nạp lại ở phiên sau.
2. Giảm quy mô (ít epoch hơn, batch nhỏ hơn, dữ liệu con) cho vừa một phiên.

Điều **không** có trong danh sách: cứ bấm chạy rồi hy vọng. `epoch_mat_toi_da` chính là cái giá của hy vọng đó.
