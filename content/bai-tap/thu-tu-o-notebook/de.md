---
tieu_de: Mô phỏng trạng thái ẩn của notebook
khai_niem: colab-kaggle
do_kho: 2
trang_thai: nhap
---

Lỗi số một của người mới dùng Colab/Kaggle **không** phải lỗi cú pháp, mà là **trạng thái ẩn**: notebook chạy đúng trên máy tác giả chỉ vì tác giả đã bấm các ô theo một thứ tự không ai đoán được, và bộ nhớ còn giữ những biến mà nhìn vào file thì không thấy.

Bài này bạn cài lại đúng cái máy trạng thái đó bằng Python thuần — không cần mạng, không cần GPU.

## Mô hình

Một notebook là danh sách các ô. Mỗi ô là một `dict`:

```python
{"gan": ["mo_hinh"], "dung": ["du_lieu"]}   # mo_hinh = huan_luyen(du_lieu)
```

- `dung`: các tên biến ô **đọc**
- `gan`: các tên biến ô **tạo ra**

Quy tắc trong một ô: **đọc trước, gán sau**. Ô `x = x + 1` là `{"gan": ["x"], "dung": ["x"]}`, và nếu chạy khi chưa có `x` thì nó lỗi `NameError` — dù chính nó có gán `x`.

## 1. `chay_theo_thu_tu(o, thu_tu)`

`thu_tu` là danh sách chỉ số ô, theo đúng thứ tự người dùng bấm chạy. Trả về bộ ba:

```
(ten_bien_loi, chi_so_o, bo_nho)
```

- Gặp ô đọc một biến chưa có: dừng ngay, trả `(tên biến đó, chỉ số ô, bản sao bộ nhớ lúc đó)`
- Chạy hết: trả `(None, None, bộ nhớ cuối)`

Kiểm tra đầu vào (đây là ranh giới tin cậy, đừng bỏ qua):

- `thu_tu` có chỉ số lặp lại → `raise ValueError`
- chỉ số nằm ngoài `[0, len(o))` → `raise ValueError`

`bo_nho` trả về phải là **bản sao** (`set(bo_nho)`), không phải chính cái `set` bên trong hàm — nếu không, người gọi sửa nó là hỏng lần chạy sau.

## 2. `restart_and_run_all(o)`

Đúng cái nút **Runtime → Restart and run all**: chạy từ ô 0 tới ô cuối, dừng ngay tại ô đầu tiên lỗi. Gọi lại hàm trên với `thu_tu = list(range(len(o)))` là xong.

## 3. `bien_con_sot(o, thu_tu)`

Tên các biến **có** trong bộ nhớ sau khi chạy theo `thu_tu`, nhưng **không** có sau `restart_and_run_all`. Trả về danh sách đã `sorted`.

Đây chính là thước đo "notebook này chỉ chạy được trên máy bạn": danh sách rỗng nghĩa là notebook lành mạnh.

## Ví dụ kiểm chứng

```python
so = [
    {"gan": ["du_lieu"], "dung": []},
    {"gan": ["mo_hinh"], "dung": ["du_lieu"]},
    {"gan": ["ket_qua"], "dung": ["mo_hinh"]},
]
chay_theo_thu_tu(so, [0, 1, 2])   # (None, None, {'du_lieu', 'mo_hinh', 'ket_qua'})
chay_theo_thu_tu(so, [1, 0, 2])   # ('du_lieu', 1, set())
chay_theo_thu_tu(so, [0, 2, 1])   # ('mo_hinh', 2, {'du_lieu'})

lung_tung = [
    {"gan": ["a"], "dung": []},
    {"gan": ["b"], "dung": ["c"]},
    {"gan": ["c"], "dung": ["a"]},
]
chay_theo_thu_tu(lung_tung, [0, 2, 1])   # (None, None, {'a', 'b', 'c'})  <- tac gia thay "chay ngon"
restart_and_run_all(lung_tung)           # ('c', 1, {'a'})                <- nguoi khac mo ra thi chet
bien_con_sot(lung_tung, [0, 2, 1])       # ['b', 'c']
```

Ba dòng cuối là toàn bộ bài học: notebook `lung_tung` chạy trót lọt với tác giả, và chết ngay ô thứ hai với bất cứ ai khác — kể cả chính tác giả sau khi phiên Colab bị ngắt.

## Kiểm tra lại chính mình

Nếu `bien_con_sot(o, thu_tu)` trả về danh sách rỗng với **mọi** `thu_tu` bạn từng bấm, notebook của bạn an toàn để chia sẻ. Cách rẻ nhất để đảm bảo điều đó ngoài đời: bấm **Restart and run all** trước khi gửi cho ai.
