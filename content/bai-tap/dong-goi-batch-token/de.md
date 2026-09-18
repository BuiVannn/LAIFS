---
tieu_de: Đóng gói batch token và ngân sách bộ nhớ chú ý
khai_niem: huggingface-hub
do_kho: 2
trang_thai: nhap
---

Tokenizer của Hugging Face trả về hai mảng chứ không phải một: `input_ids` và `attention_mask`. Nhiều người bỏ qua cái thứ hai cho tới lúc mô hình học được cách "chú ý vào chỗ trống" và cho ra kết quả vô nghĩa.

Bài này bạn cài lại đúng bước đóng gói đó bằng NumPy, rồi tính xem một `max_length` cụ thể ngốn bao nhiêu bộ nhớ — con số quyết định bạn có chạy nổi trên GPU miễn phí hay không.

## 1. `dong_goi(cac_chuoi, max_length, pad_id=0)`

Các câu trong một batch dài ngắn khác nhau, nhưng tensor thì phải chữ nhật. Ba bước:

1. **Cắt** mỗi chuỗi còn tối đa `max_length` token (`list(c)[:max_length]`)
2. **Đệm** mọi chuỗi về cùng độ dài `L` = độ dài lớn nhất **sau khi cắt** — không phải `max_length`
3. **Đánh dấu** bằng `attention_mask`: `1` ở token thật, `0` ở chỗ đệm

Trả về `(input_ids, attention_mask)`, cả hai là mảng NumPy số nguyên shape `(N, L)`.

Ba cái bẫy trong ba bước đó:

- **Đệm tới `max_length` thay vì tới chuỗi dài nhất.** Batch toàn câu 6 token mà `max_length=512` thì bạn vừa nhân khối lượng tính toán lên 85 lần để xử lý toàn số 0.
- **Suy mask từ `input_ids == 0`.** Chạy đúng khi `pad_id = 0`, sai lặng lẽ khi mô hình dùng `pad_id` khác — mà rất nhiều mô hình dùng khác. Mask phải dựng từ độ dài thật.
- **Quên mask hoàn toàn.** Không có báo lỗi nào cả: mô hình vẫn chạy, vẫn ra số, chỉ là các token đệm cũng được tính vào chú ý và vào loss.

## 2. `byte_attention(batch, so_dau, do_dai, byte_moi_so=4)`

Ma trận điểm chú ý trong Transformer có shape `(batch, số đầu, độ dài, độ dài)`. Hàm trả về số byte của nó.

Chữ **độ dài xuất hiện hai lần** là toàn bộ câu chuyện: bộ nhớ tăng theo **bình phương** độ dài chuỗi. Gấp đôi `max_length` là gấp bốn bộ nhớ.

## 3. `do_dai_toi_da(byte_cho_phep, batch, so_dau, byte_moi_so=4)`

Đảo ngược hàm trên: với ngần này bộ nhớ, chuỗi dài nhất là bao nhiêu? Nhớ **làm tròn xuống** (`np.floor` rồi `int`) — làm tròn lên là `CUDA out of memory`.

## Ví dụ kiểm chứng

```python
batch = [[101, 5, 6, 102], [101, 7, 102], [101, 8, 9, 10, 11, 102]]

ids, mask = dong_goi(batch, max_length=10)
# ids                      mask
# [[101   5   6 102   0   0]   [[1 1 1 1 0 0]
#  [101   7 102   0   0   0]    [1 1 1 0 0 0]
#  [101   8   9  10  11 102]]   [1 1 1 1 1 1]]

ids, mask = dong_goi(batch, max_length=3)
# [[101   5   6]            [[1 1 1]
#  [101   7 102]             [1 1 1]
#  [101   8   9]]            [1 1 1]]

byte_attention(8, 12, 512, 4)          # 100663296  (96 MB)
byte_attention(8, 12, 1024, 4)         # 402653184  (384 MB — gap BON lan)
do_dai_toi_da(15 * 1024**3, 8, 12)     # 6476
```

Hai dòng cuối đọc thế này: trên một GPU 16 GB kiểu T4 hay P100 mà Colab/Kaggle hay cấp, **chỉ riêng** ma trận chú ý của một batch 8 câu, 12 đầu, đã chặn độ dài ở khoảng 6476 token — và đó là khi giả vờ rằng trọng số mô hình, activation và trạng thái optimizer không tốn gì cả. Thực tế nhỏ hơn nhiều lần.

Vì vậy khi gặp `CUDA out of memory`, thứ tự thử đúng là: giảm `batch_size` (tuyến tính) → giảm `max_length` (bình phương, ăn tiền nhất) → mixed precision → gradient accumulation.
