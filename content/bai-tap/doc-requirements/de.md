---
tieu_de: Đọc và soát file requirements.txt
khai_niem: moi-truong-python
do_kho: 2
trang_thai: nhap
---

`requirements.txt` là bản ghi để dựng lại môi trường. Nếu nó viết cẩu thả thì ba tháng sau đồng nghiệp cài ra một môi trường khác, kết quả mô hình lệch đi, và không ai biết vì sao. Bài này viết một công cụ nhỏ đọc file đó và chỉ ra chỗ lỏng lẻo.

Một file thật trông như sau:

```
# thu vien tinh toan
numpy==2.4.6
scipy >= 1.11        # de cho pip tu chon ban moi

scikit-learn
torch!=2.1.0
Pillow~=10.2.0
```

## Yêu cầu 1: `doc_requirements(text)`

Trả về **danh sách các bộ ba** `(ten, toan_tu, phien_ban)` theo đúng thứ tự xuất hiện.

Quy tắc:

- Bỏ dòng trống và dòng bắt đầu bằng `#` (kể cả khi có khoảng trắng đứng trước).
- Bỏ phần chú thích nằm sau dấu `#` trên cùng một dòng.
- Bỏ khoảng trắng thừa ở mọi chỗ: `scipy >= 1.11` phải cho `("scipy", ">=", "1.11")`.
- Toán tử nhận dạng: `~=`, `==`, `!=`, `>=`, `<=`, `>`, `<`. Phải thử toán tử **hai ký tự trước** toán tử một ký tự.
- Dòng chỉ có tên gói, không có toán tử: trả `(ten, "", "")`.
- **Chuẩn hoá tên gói** như PyPI vẫn làm: chuyển về chữ thường và đổi `_` thành `-`. Nên `Pillow` thành `pillow`, `scikit_learn` thành `scikit-learn`.

```python
doc_requirements("numpy==2.4.6\n\n# ghi chu\nscipy >= 1.11   # thoang qua\nPillow~=10.2.0\ntorch\n")
# [("numpy", "==", "2.4.6"),
#  ("scipy", ">=", "1.11"),
#  ("pillow", "~=", "10.2.0"),
#  ("torch", "", "")]
```

## Yêu cầu 2: `soat(text)`

Trả về một `dict` gồm đúng ba khoá, mỗi khoá là danh sách **tên gói** (đã chuẩn hoá, giữ nguyên thứ tự xuất hiện):

| Khoá | Chứa gì | Vì sao đáng soát |
|---|---|---|
| `"khong_pin"` | các gói có toán tử khác `==` (kể cả không có toán tử nào) | Mỗi lần cài có thể ra một phiên bản khác nhau, mất tái lập |
| `"trung_ten"` | các gói xuất hiện **từ hai dòng trở lên** (mỗi tên chỉ kể một lần, ở vị trí xuất hiện lần thứ hai) | Dòng sau đè dòng trước trong im lặng |
| `"tat_ca"` | mọi tên gói, theo thứ tự xuất hiện, kể cả trùng | Để đối chiếu nhanh |

```python
soat("numpy==2.4.6\nscipy>=1.11\nnumpy==2.0.0\ntorch\n")
# {"khong_pin": ["scipy", "torch"],
#  "trung_ten": ["numpy"],
#  "tat_ca": ["numpy", "scipy", "numpy", "torch"]}
```

Chú ý: `numpy` ở ví dụ trên **không** vào `khong_pin` vì cả hai dòng đều dùng `==`.

## Vì sao bài này đáng làm

Hai lỗi mà công cụ này bắt được là hai lỗi hay gặp nhất trong `requirements.txt` thật: gói không pin (mất tái lập) và gói khai hai lần với hai phiên bản khác nhau (pip lấy dòng sau, không báo gì). Cả hai đều không sinh ra thông báo lỗi nào — chúng chỉ làm kết quả lệch đi.
