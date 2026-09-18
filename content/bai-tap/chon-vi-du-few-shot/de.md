---
tieu_de: Chọn ví dụ few-shot và bảng thuật ngữ cho prompt
khai_niem: llm-dich-may
do_kho: 3
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong 2026-09-18"
---

Bạn có kho 40 nghìn cặp câu đã dịch và một bảng thuật ngữ nhiều nghìn mục. Không nhét hết vào prompt được, nên phải **truy xuất**: với mỗi câu cần dịch, chọn ra vài ví dụ giống nó nhất và những mục thuật ngữ thật sự xuất hiện trong câu. Đây chính là "RAG thuật ngữ".

Hai hàm `tach_tu` và `cosine` đã cho sẵn. Bạn viết ba hàm còn lại.

### 1. `tf_idf(kho)`

Nhận danh sách câu, trả về tuple `(vecto, idf)`:

- `idf`: dict `từ -> ln(N / df)`, với `N = len(kho)` và `df` = số câu chứa từ đó
- `vecto`: danh sách dict, mỗi dict là một câu; trọng số của từ $w$ trong câu là

$$
\text{tf}(w) \cdot \text{idf}(w), \qquad \text{tf}(w) = \frac{n_w}{L}
$$

với $n_w$ là số lần $w$ xuất hiện trong câu và $L$ là tổng số từ của câu.

Chỉ đưa vào dict những từ có mặt trong câu. Kho rỗng thì trả về `([], {})`.

### 2. `chon_vi_du(cau, kho, k)`

Trả về **danh sách chỉ số** của `k` câu trong `kho` giống `cau` nhất, xếp theo độ giống giảm dần. Hai câu bằng điểm thì câu có chỉ số nhỏ hơn đứng trước.

Cách làm: dựng `idf` từ `kho`, vector hoá `cau` bằng **chính bộ `idf` đó** (từ nào không có trong `idf` thì bỏ qua — từ chưa từng thấy không mang tín hiệu truy xuất nào), rồi chấm `cosine` với từng vector của kho.

Nếu `k` lớn hơn số câu trong kho thì trả về tất cả.

### 3. `dung_prompt(cau, vi_du, thuat_ngu)`

Ghép prompt cuối cùng.

- `vi_du`: danh sách cặp `(nguon, dich)` đã chọn
- `thuat_ngu`: dict `thuật ngữ nguồn -> thuật ngữ đích`. **Chỉ giữ** những mục mà khoá xuất hiện trong `cau` (so khớp chuỗi con, không phân biệt hoa thường), giữ nguyên thứ tự của dict.

Prompt gồm tối đa ba khối, nối với nhau bằng **một dòng trống** (`"\n\n"`). Khối nào rỗng thì bỏ hẳn, không để lại dòng trống thừa.

```
Bảng thuật ngữ:
- discharge -> xuất viện
- ICU -> khoa hồi sức tích cực

Ví dụ:
EN: The patient was admitted to the ICU.
VI: Bệnh nhân được chuyển vào khoa hồi sức tích cực.

EN: The nurse checked the chart.
VI: Điều dưỡng kiểm tra bệnh án.

Dịch câu sau sang tiếng Việt.
EN: The patient was discharged.
VI:
```

Lưu ý định dạng: các cặp ví dụ cách nhau một dòng trống; khối cuối luôn có và kết thúc bằng `VI:` (không có dấu cách hay xuống dòng phía sau).
