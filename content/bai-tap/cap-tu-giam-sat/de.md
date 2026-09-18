---
tieu_de: Sinh nhãn từ chính dữ liệu (tự giám sát)
khai_niem: ml-la-gi
do_kho: 2
trang_thai: nhap
---

Học tự giám sát biến một câu không nhãn thành nhiều mẫu huấn luyện có nhãn. Bài này cài đúng hai cách sinh nhãn mà LLM dùng.

**1.** `cap_ke_tiep(tokens)` — kiểu GPT: đoán token tiếp theo từ mọi token đứng trước. Trả về danh sách các tuple `(ngu_canh, nhan)`, trong đó `ngu_canh` là một `tuple` các token đứng trước và `nhan` là token cần đoán. Danh sách xếp theo vị trí tăng dần.

**2.** `cap_bi_che(tokens, ky_hieu="[CHE]")` — kiểu BERT: che lần lượt từng vị trí. Trả về danh sách các tuple `(cau_bi_che, nhan)`, trong đó `cau_bi_che` là một `tuple` cùng độ dài với `tokens` nhưng vị trí bị che thay bằng `ky_hieu`.

**3.** `so_cap(do_dai)` — `do_dai` là mảng numpy chứa độ dài của nhiều câu. Trả về mảng numpy số mẫu "đoán token tiếp theo" mà mỗi câu sinh ra. Câu rỗng hoặc câu 1 token sinh ra **0** mẫu (không được ra số âm).

**Ví dụ**:

```python
t = ["học", "máy", "là", "học"]

cap_ke_tiep(t)
# [(("học",), "máy"), (("học", "máy"), "là"), (("học", "máy", "là"), "học")]

cap_bi_che(t)[0]
# (("[CHE]", "máy", "là", "học"), "học")

so_cap(np.array([7, 4, 1, 0]))   # [6, 3, 0, 0]
```

Một câu 7 token cho 6 mẫu "đoán token tiếp theo" và 7 mẫu "đoán token bị che" — không ai gán nhãn cả.
