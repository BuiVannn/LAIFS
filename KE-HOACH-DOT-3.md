# Kế hoạch đợt 3 — Từ khái niệm sang kỹ năng code (2026-09-18)

Mục tiêu đợt này: người mới vào web **làm được**, không chỉ hiểu. Trọng tâm: **Deep Learning → NLP → Dịch máy**, cộng phần code (NumPy, PyTorch, Matplotlib) và công cụ (Colab, Kaggle, Hugging Face). Mảng CV và ML cổ điển chỉ làm phần tối thiểu để hiểu được DL/NLP/MT.

---

## 1. Hiện trạng chấm code (trả lời câu hỏi "chấm kiểu gì")

### Cách chấm hiện tại

```
Trình duyệt người học
   │  code của bạn (textarea)  +  tests.py (đi kèm trang)
   ▼
Web Worker  ──importScripts──►  Pyodide (CPython biên dịch sang WebAssembly, tải từ CDN)
   │                             + numpy
   ▼
public/runner.py   →   chay(code, tests)
   │   1. exec(code)        — chạy code của bạn
   │   2. exec(tests)       — nạp các hàm test_*
   │   3. gọi từng test_*   — bắt exception riêng từng hàm
   ▼
{ loi, stdout, tests: [{ten, dat, loi}] }  →  hiện "4/4 test đạt", bài đạt lưu vào tiến độ
```

- **Test là hàm Python thường** tên `test_*`, dùng `assert` với thông báo tiếng Việt. Một test trượt không làm dừng các test khác.
- **Chạy hoàn toàn trong trình duyệt**, không có server, không tốn tiền, không rủi ro bảo mật phía máy chủ.
- **Kiểm tra ở CI/local**: `npm run check:bai-tap` chạy đúng `runner.py` đó bằng Python thật, xác nhận `solution.py` đạt hết test và `starter.py` trượt.
- **Kiểm định chất lượng test**: khi rà soát, agent **cài lỗi cố ý vào lời giải** (quên chia n, sai dấu, sai trục, quên mask…) và yêu cầu test phải bắt được. Đợt vừa rồi cách này phát hiện 2 bộ test có lỗ hổng thật.

### Giới hạn hiện tại (và hướng sửa trong đợt 3)

| Giới hạn | Thực tế | Hướng xử lý |
|---|---|---|
| **Không chạy được PyTorch** | Pyodide không có torch | Ba đường: bài NumPy "từ đầu" chạy trên web · bài **đọc code PyTorch** chấm bằng câu hỏi · bài **notebook Colab** có ô assert tự kiểm |
| "Test ẩn" không thật sự ẩn | `tests.py` nằm trong trang, xem nguồn là thấy | Nói thẳng trong giao diện; thêm test sinh ngẫu nhiên theo seed để không thể hard-code đáp án |
| Vòng lặp vô hạn | Có nút Dừng, nhưng phải tự bấm | Tự dừng sau 10 giây, kèm gợi ý "có thể bạn lặp vô hạn" |
| Thông báo lỗi Python khó hiểu với người mới | Hiện traceback thô | Bảng dịch các lỗi hay gặp sang tiếng Việt kèm gợi ý (học cách làm của futurecoder) |
| Không kiểm được "code sạch hay bẩn" | Chỉ đúng/sai | Thêm gợi ý sau khi đạt: so sánh với lời giải mẫu + 1–2 nhận xét về cách viết |
| Không có kiểm tra gradient dùng chung | Mỗi bài tự viết | `kiem_tra_gradient()` trong `runner.py`: so gradient giải tích với sai phân hữu hạn |

### Các dạng bài tập sẽ có sau đợt 3

| Dạng | Chấm thế nào | Dùng cho |
|---|---|---|
| `numpy` (đang có) | Pyodide chạy test | Cài thuật toán từ đầu |
| `doc-code` | Câu hỏi đoán output/shape/lỗi, chấm như trắc nghiệm | Đọc hiểu code PyTorch, Hugging Face |
| `sua-loi` | Code có bug sẵn, sửa cho test đạt | Kỹ năng debug |
| `xep-dong` (Parsons) | Kéo thả sắp xếp dòng code, so với thứ tự đúng | Người mới, giảm tải nhận thức |
| `notebook` | Người học chạy trên Colab, mỗi phần có ô `assert` tự kiểm; web ghi nhận đã làm | PyTorch, dữ liệu thật, fine-tune |

---

## 2. Nguồn tham khảo: mở rộng ngoài YouTube

Thêm hai loại vào thư viện: `bai-viet` (blog, tutorial) và `khoa-hoc` (khoá học).

**Nguồn tiếng Anh dự kiến** (mỗi nguồn phải kiểm link sống và ghi rõ license trước khi đưa vào): Distill.pub · Lil'Log của Lilian Weng · Jay Alammar · blog Sebastian Raschka · Chris Olah · Hugging Face Course và blog · PyTorch Tutorials · NumPy/Matplotlib docs · Kaggle Learn · fast.ai · blog Karpathy · d2l.ai · Papers with Code.

**Nguồn tiếng Việt**: AI VIET NAM · Machine Learning cơ bản (Vũ Hữu Tiệp) · d2l-vi · các blog kỹ thuật Việt (chọn lọc, kiểm chất lượng từng bài, không lấy bừa).

**Quy tắc**: mỗi nguồn ghi mức độ (nhập môn / sâu / toán nặng), lý do nên đọc, và đoạn nào đáng đọc. Không chép nội dung, chỉ link và tóm tắt bằng lời mình.

### Hai quyển sách mới

| Sách | License | Được dùng thế nào |
|---|---|---|
| **NLP: Neural Networks and Large Language Models** (Tong Xiao, Jingbo Zhu, 6/2026, 711 trang) | **CC BY-NC 4.0** — license mở, phi thương mại | **Được dịch và biên soạn lại** cho nhánh NLP/LLM/MT, miễn ghi nguồn và web giữ phi thương mại. Đây là nguồn quý nhất hiện có. Bài dẫn xuất phải gắn nhãn CC BY-NC 4.0. |
| **Sách bài tập lớp AIO 2025** (AI VIET NAM, 2028 trang, tiếng Việt, kèm lời giải) | Chưa rõ, coi như bản quyền đầy đủ | **Chỉ tham khảo cấu trúc và ý tưởng bài tập**, tự viết lại hoàn toàn bằng dữ liệu và ví dụ khác. Không chép đề, không chép lời giải. Ghi nguồn khi lấy cảm hứng. |

Cấu trúc 11 module của AIO (Python → NumPy/xác suất → ML cơ bản → nền tảng DL → kiến trúc DL → DL cho ảnh → DL cho text → mô hình sinh) là tấm bản đồ tốt để đối chiếu xem web còn thiếu mảng nào.

---

## 3. Nội dung sẽ thêm

### 3.1 Điền các khái niệm nền ✅ xong 2026-09-18 (20 bài, không phải 15)

Đã có sẵn trong lộ trình nhưng chưa có nội dung, và đều cần cho DL/NLP:

`vector-ma-tran` · `nhan-ma-tran` · `xac-suat-co-ban` · `ml-la-gi` · `train-val-test` · `hoi-quy-logistic` · `cross-entropy` · `softmax` · `overfitting` · `regularization` (L1/L2) · `danh-gia-mo-hinh` · `sgd-mini-batch` · `khoi-tao-trong-so` · `optimizer` (momentum, Adam) · `dropout` · `batch-norm`

Thêm 4 khái niệm mà danh sách 15 ban đầu còn thiếu: `ky-vong-phuong-sai`, `hop-ly-cuc-dai` (MLE — lý do MSE và cross-entropy là hai loss "đúng"), `on-dinh-so` (log-sum-exp, trừ max, epsilon), `gradient-bien-mat`.

Để sau (chỉ cần khi mở rộng sang ML cổ điển): `knn`, `k-means`, `cay-quyet-dinh`.

**Kết quả đợt 3.1:** 20 bài (mỗi bài dài gấp 2–4 lần bài mẫu cũ, có mục "Tra nhanh"), 240 câu trắc nghiệm, 32 bài code, 10 viz mới. Lộ trình đánh số lại còn 46 khái niệm, 43 bài đã có nội dung.

### 3.2 Nhánh mới: Công cụ cho người mới (4 bài)

`moi-truong-python` (pip, venv, vì sao code chạy máy này không chạy máy kia) · `colab-kaggle` (GPU miễn phí, giới hạn, lưu file, dataset) · `huggingface-hub` (model, dataset, pipeline, tokenizer, tải về đúng cách) · `doc-loi-python` (đọc traceback, lỗi shape, lỗi kiểu dữ liệu)

### 3.3 Nhánh mới: NumPy & Matplotlib (5 bài)

`numpy-mang-va-shape` · `numpy-chi-so-va-slice` · `numpy-broadcasting` · `numpy-vector-hoa` (bỏ vòng lặp, đo tốc độ thật) · `matplotlib-doc-bieu-do` (vẽ learning curve, đọc biểu đồ huấn luyện)

### 3.4 Nhánh mới: Dữ liệu & tiền xử lý, từ dễ đến khó (6 bài)

`pandas-co-ban` · `lam-sach-du-lieu` (thiếu, trùng, ngoại lai) · `chuan-hoa-dac-trung` (standardize, normalize, khi nào cần) · `ma-hoa-dac-trung` (one-hot, label, embedding cho hạng mục) · `ro-ri-du-lieu` (leakage — lỗi chết người mà người mới hay mắc) · `tien-xu-ly-van-ban-viet` (chuẩn hoá Unicode tiếng Việt, tách câu, tách từ, padding/masking theo batch)

### 3.5 Nhánh mới: Kỹ thuật huấn luyện phải nắm chắc (6 bài)

`early-stopping` · `lich-learning-rate` (scheduler, warmup) · `chuan-hoa-lop` (layer norm, vì sao Transformer dùng nó thay batch norm) · `transfer-learning` · `fine-tuning` (full, freeze, LoRA ở mức khái niệm) · `tang-cuong-du-lieu-van-ban`

### 3.6 Nhánh mới: PyTorch từ cơ bản đến nâng cao (8 bài)

`pytorch-tensor` (so với NumPy) · `pytorch-autograd` (nối thẳng với bài lan truyền ngược đã có) · `pytorch-nn-module` · `pytorch-du-lieu` (Dataset, DataLoader, collate cho câu dài ngắn khác nhau) · `pytorch-vong-lap-huan-luyen` (bộ khung chuẩn, các lỗi kinh điển: quên `zero_grad`, quên `model.eval()`) · `pytorch-gpu-va-checkpoint` · `pytorch-gap-loi-shape` (đọc lỗi shape và sửa) · `pytorch-huggingface` (pipeline, Trainer, tokenizer thật)

### 3.7 NLP/MT đi tiếp (5 bài)

`mo-hinh-ngon-ngu` (LM, perplexity) · `tien-huan-luyen-va-fine-tune` · `fine-tune-dich-may` (NLLB/Marian cho Việt–Anh) · `prompt-cho-dich` (few-shot, glossary trong prompt) · `giai-ma-thuc-te` (batching, độ dài, tốc độ, chi phí)

### 3.8 Dự án nhỏ xuyên suốt (4 dự án)

1. **mini-micrograd**: tự viết autograd rồi huấn luyện MLP — nối các bài đạo hàm → backprop → optimizer.
2. **MLP bằng NumPy trên dữ liệu thật nhỏ**: tiền xử lý → huấn luyện → vẽ learning curve → chẩn đoán overfit.
3. **Tokenizer + mô hình ngôn ngữ nhỏ cho tiếng Việt**: BPE tự huấn luyện → LM n-gram/neural nhỏ → sinh câu.
4. **Fine-tune mô hình dịch Việt–Anh trên Colab**: dữ liệu → fine-tune → đánh giá bằng chrF/COMET → so với baseline.

**Tổng cộng: 49 bài học mới/điền tiếp + 4 dự án.**

---

## 4. Việc kỹ thuật phải làm trước

| # | Việc | Vì sao |
|---|---|---|
| 1 | Thêm `loai` cho bài tập (`numpy`, `doc-code`, `sua-loi`, `xep-dong`, `notebook`) | Mỗi dạng chấm khác nhau |
| 2 | `kiem_tra_gradient()` trong `runner.py` | Dùng lại ở mọi bài DL |
| 3 | Tự dừng sau 10 giây + thông báo lỗi Python dịch sang tiếng Việt | Người mới không bị kẹt |
| 4 | Test sinh theo seed ngẫu nhiên | Chống hard-code đáp án |
| 5 | Component `<DocCode>`: hiện code có đánh số dòng + chú thích từng đoạn | Dạng bài đọc hiểu code |
| 6 | Sinh notebook `.ipynb` từ bài tập + link Colab mở thẳng từ GitHub | Bài PyTorch |
| 7 | Ghi nhận "đã làm notebook" vào tiến độ (tự khai) | Không mất mạch học |
| 8 | `scripts/dot_bien.py`: tự động cài lỗi vào `solution.py` và báo test nào không bắt được | Biến việc kiểm định test thành tự động |
| 9 | Mở rộng thư viện: `bai-viet`, `khoa-hoc`, trường `license` | Nguồn blog/web |
| 10 | Trang `/luyen-code` lọc theo dạng bài và theo nhánh | 24 bài hiện tại sẽ thành hơn 100 |

---

## 5. Thứ tự làm

| Đợt | Nội dung | Ước lượng |
|---|---|---|
| **3.0** | Việc kỹ thuật 1–5, 8 (nền cho mọi bài sau) | 1 phiên |
| **3.1** | 15 bài stub tầng 2–3 (overfitting, regularization, dropout, optimizer…) + bài tập NumPy | 3–4 phiên, 5 agent song song |
| **3.2** | NumPy/Matplotlib (5) + Công cụ (4) + Tiền xử lý (6) | 3 phiên |
| **3.3** | Việc kỹ thuật 6–7, rồi PyTorch (8 bài) + kỹ thuật huấn luyện (6 bài) | 3–4 phiên |
| **3.4** | NLP/MT đi tiếp (5) + 4 dự án | 3 phiên |
| **3.5** | Dịch/biên soạn các chương phù hợp của nlp-book (CC BY-NC) để làm phần "đào sâu" cho nhánh NLP | tuỳ chọn |

Mỗi đợt vẫn theo quy trình cũ: agent soạn → tự kiểm chứng mọi con số → rà soát chéo → chạy Chrome headless → duyệt.

---

## 6. Rủi ro và điều cần chốt

1. **License CC BY-NC của nlp-book buộc web phải phi thương mại.** Nếu sau này muốn thu phí hay đặt quảng cáo thì phải gỡ toàn bộ phần dẫn xuất từ sách này. Cần chốt: web cam kết phi thương mại?
2. **Bài PyTorch không chấm tự động trong trình duyệt được.** Phương án dùng Colab đòi hỏi người học có tài khoản Google. Chấp nhận không?
3. **Khối lượng lớn**: 49 bài tương đương 2,5 lần khối lượng đã làm. Nếu muốn nhanh, nên giảm độ sâu ở nhánh Công cụ và Tiền xử lý.
4. **Chất lượng**: càng nhiều bài càng khó giữ mức kiểm chứng như hiện nay. Đề xuất giữ nguyên quy trình, chấp nhận chậm hơn.
5. **Trùng lặp với AIO**: sách AIO đã có bài tập rất sát. Cần tự viết bài khác hẳn, đồng thời link tới AIO như nguồn luyện thêm.

## 7. Quyết định đã chốt (2026-09-18)

1. **Web phi thương mại lâu dài** → được dùng nlp-book (CC BY-NC 4.0) để dịch và biên soạn lại. Ghi rõ trong README; nếu sau này đổi ý thì phải gỡ toàn bộ phần dẫn xuất.
2. **Bài PyTorch chạy trên Colab**, có ô `assert` tự kiểm trong notebook.
3. **Điền hết khái niệm nền trước**, PyTorch làm sau.
4. **Bài đọc hiểu code dùng cả hai nguồn, phân vai rõ**: bài nhập môn dùng code tự viết (ngắn, sạch, không vướng bản quyền); bài nâng cao trích đoạn ngắn từ dự án license mở (PyTorch BSD-3, Hugging Face Apache-2.0, micrograd/minGPT MIT), luôn ghi nguồn và link tới file gốc. Không trích code từ sách thương mại.

## 8. Đã làm xong (đợt 3.0)

- `kiem_tra_gradient()` trong `runner.py`: so gradient giải tích với sai phân trung tâm, mọi bài DL dùng chung.
- **Gợi ý lỗi tiếng Việt**: 12 lỗi Python hay gặp (chưa viết code, sai tên biến, lệch shape, tràn số, quên `return`…) hiện kèm cách sửa.
- **Tự dừng sau 10 giây** khi code chạy quá lâu, kèm gợi ý về vòng lặp vô hạn; sau đó vẫn chạy lại được.
- `npm run dot-bien`: tự động cài 13 lỗi kinh điển vào từng `solution.py` và báo lỗi nào test không bắt được. Có cơ chế khai báo bỏ qua cho đột biến tương đương về toán (`# dot-bien-bo-qua: … — lý do`).
- Nhờ script này đã bịt 2 lỗ hổng thật: test ổn định số của softmax trong `chu-y-dot-product` và `attention-co-mask` quá dễ, trừ min hay cộng max đều lọt.
