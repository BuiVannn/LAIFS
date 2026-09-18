---
tieu_de: So sánh phiên bản như pip
khai_niem: moi-truong-python
do_kho: 2
trang_thai: nhap
---

Câu hỏi tưởng dễ: `numpy 1.10.0` mới hơn hay cũ hơn `numpy 1.9.0`?

```python
"1.10.0" > "1.9.0"   # False  — SAI
```

So sánh chuỗi đi từng ký tự, và sau `1.` thì `'1'` đứng trước `'9'`, nên Python kết luận 1.10.0 **cũ hơn** 1.9.0. Đây là lỗi thật, hay gặp trong các đoạn code tự kiểm tra phiên bản thư viện. Phiên bản phải được so **từng thành phần như số nguyên**.

## Yêu cầu 1: `so_sanh(a, b)`

Trả về `-1` nếu `a` cũ hơn `b`, `0` nếu bằng nhau, `1` nếu `a` mới hơn `b`.

Phiên bản là chuỗi các số nguyên nối bằng dấu chấm, số thành phần có thể khác nhau. Thiếu thành phần thì coi như `0`:

```python
so_sanh("1.10.0", "1.9.0")    #  1
so_sanh("1.9.0", "1.10.0")    # -1
so_sanh("2.4.6", "2.4.6")     #  0
so_sanh("1.2", "1.2.0")       #  0   — "1.2" nghia la "1.2.0"
so_sanh("2", "2.0.1")         # -1
so_sanh("2.4.6", "2.4.10")    # -1   — 6 < 10
```

Gợi ý: `itertools.zip_longest(..., fillvalue=0)` ghép hai dãy dài ngắn khác nhau và tự điền `0` cho chỗ thiếu.

## Yêu cầu 2: `thoa_man(phien_ban, rang_buoc)`

Trả về `True`/`False`: phiên bản đang cài có thoả ràng buộc trong `requirements.txt` không.

Toán tử cần hỗ trợ, **theo đúng nghĩa của pip**:

| Ràng buộc | Đúng khi |
|---|---|
| `==2.4.6` | bằng đúng 2.4.6 |
| `!=2.5.0` | khác 2.5.0 |
| `>=2.0` | từ 2.0 trở lên |
| `<=2.9` | từ 2.9 trở xuống |
| `>2.0` | lớn hơn hẳn 2.0 |
| `<3.0` | nhỏ hơn hẳn 3.0 |
| `~=2.4.6` | `>=2.4.6` **và** vẫn nằm trong nhánh `2.4.*` |

```python
thoa_man("2.4.6", "==2.4.6")   # True
thoa_man("2.4.7", "==2.4.6")   # False
thoa_man("1.9.0", ">=1.10.0")  # False  — 1.9 cu hon 1.10
thoa_man("2.4.9", "~=2.4.6")   # True   — cung nhanh 2.4.*
thoa_man("2.5.0", "~=2.4.6")   # False  — nhay sang nhanh 2.5
thoa_man("2.4.0", "~=2.4.6")   # False  — nho hon moc
```

Chú ý thứ tự nhận dạng toán tử: phải thử `>=` **trước** `>`, nếu không `">=2.0"` sẽ bị đọc thành toán tử `>` với phiên bản `"=2.0"`.

Ràng buộc có thể có khoảng trắng thừa (`">= 2.0"`). Ràng buộc không hợp lệ (không bắt đầu bằng toán tử nào) thì `raise ValueError`.

## Vì sao bài này đáng làm

`~=` là toán tử hay bị hiểu sai nhất trong `requirements.txt`. Viết được nó bằng code thì sẽ không bao giờ quên nó nghĩa là gì: *nhận vá lỗi, không nhận tính năng mới*.
