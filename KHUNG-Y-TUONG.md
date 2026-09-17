# Khung ý tưởng: Web luyện tập AI (v1.0 — đã chốt 2026-09-17)

> Mục tiêu: một nơi duy nhất cho nhóm nhỏ học ML/DL — **đọc khái niệm → nhìn trực quan → làm trắc nghiệm → tự code**, tất cả nối với nhau.

---

## 1. Khảo sát: người ta đã làm gì?

| Mảng | Sản phẩm tiêu biểu | Điểm hay | Điểm thiếu (với nhóm mình) |
|---|---|---|---|
| Trực quan hoá | [TensorFlow Playground](https://playground.tensorflow.org), [CNN Explainer](https://poloclub.github.io/cnn-explainer/), [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) (chạy GPT-2 ngay trên trình duyệt, ~490k người dùng, CHI 2026), [LLM Visualization (bbycroft)](https://bbycroft.net/llm), [MLU-Explain](https://mlu-explain.github.io), [Seeing Theory](https://seeing-theory.brown.edu) | Tương tác thật, dễ hiểu | Rời rạc, mỗi cái một web, tiếng Anh, không gắn bài tập |
| Tổng hợp tool | [Interactive Tools (ML Tokyo)](https://github.com/Machine-Learning-Tokyo/Interactive_Tools) | Danh sách rất đầy đủ | Chỉ là danh sách link |
| Luyện code | [Deep-ML](https://www.deep-ml.com) ("LeetCode cho ML": 100+ bài, cài từ đầu bằng Python, chấm test ngay trên web) | Bắt tự cài đặt toán thay vì gọi thư viện | Ít giải thích nền, không có viz đi kèm từng bài |
| Bài học | [d2l.ai](https://d2l.ai), Distill.pub (đã ngừng), khoá của Andrew Ng, 3Blue1Brown | Nội dung sâu | Đọc thụ động, không kiểm tra hiểu |
| Trắc nghiệm | Rải rác trên Quizlet / đề phỏng vấn | — | Không có bộ chuẩn, không tiếng Việt |
| Học có cấu trúc | Brilliant.org | Bài học xen tương tác từng bước — **mô hình đáng học theo nhất** | Trả phí, ít ML sâu |

**Kết luận khảo sát:** từng mảng đều đã có đồ tốt, nhưng **không ai nối chúng lại theo từng khái niệm**, và gần như không có bản tiếng Việt. Đó là chỗ đứng của web này. Đừng cố làm viz đẹp hơn Transformer Explainer — hãy làm cái *gắn kết* tốt hơn, và cứ nhúng/link tool có sẵn khi phù hợp.

---

## 2. Ý tưởng lõi: mọi thứ xoay quanh "Khái niệm"

Đây là quyết định quan trọng nhất cho "khung vững". Đơn vị trung tâm **không phải** bài học hay đề thi, mà là **khái niệm** (concept). Mỗi khái niệm là một nút trong đồ thị kiến thức:

```
                 ┌── Bài học ngắn (đọc 5–10 phút)
                 ├── Thẻ tóm tắt (1 đoạn "hiểu ý", công thức, trực giác)
  [Gradient  ]───┼── Trang trực quan hoá (kéo thả, chỉnh tham số)
  [Descent   ]   ├── Câu trắc nghiệm (gắn tag khái niệm)
                 ├── Bài code (cài từ đầu bằng numpy)
                 └── Liên kết: cần biết trước [Đạo hàm], dẫn tới [SGD], [Adam]
```

Lợi ích:
- Làm sai câu trắc nghiệm → web gợi ý đúng bài học / viz của khái niệm đó.
- Trang tổng hợp "khái niệm" tự sinh ra từ dữ liệu, không phải viết tay.
- Thêm ứng dụng mới sau này (flashcard, lộ trình, phỏng vấn thử…) chỉ là *một góc nhìn mới* trên cùng dữ liệu — không phải đập đi làm lại.

---

## 3. Các module

### 3.1 Khái niệm & Bài học
- **Thẻ khái niệm**: tên VN + EN, định nghĩa 1–2 câu, trực giác ("hiểu ý"), công thức, lỗi hay hiểu nhầm, khái niệm tiên quyết.
- **Bài học**: Markdown/MDX, nhúng được viz và câu hỏi ngay giữa bài (kiểu Brilliant).
- **Từ điển thuật ngữ** Anh–Việt (ít tốn công, rất có ích cho người mới).
- **Đào sâu (tài liệu ngoài)**: mỗi khái niệm có mục video YouTube / bài viết chọn lọc.
  - **Chọn lọc, không gom hết**: tối đa 3–5 nguồn/khái niệm, mỗi nguồn ghi *vì sao nên xem* + **mốc thời gian** (vd. "12:30–18:00 đoạn giải thích chain rule").
  - Gắn nhãn: mức độ (nhập môn / sâu / toán nặng), ngôn ngữ (VI/EN), dạng (trực giác / code / paper).
  - Ưu tiên kênh uy tín: 3Blue1Brown, StatQuest, Andrej Karpathy (Zero to Hero), Stanford CS231n/CS224n, Welch Labs, Serrano.Academy; kênh tiếng Việt thì cả nhóm review trước khi thêm.
  - Chỉ lưu link, không tải lại video. Nhúng bằng `youtube-nocookie.com` và chỉ tải khi bấm (đỡ nặng trang).
  - Sau này: script kiểm tra link chết định kỳ; nút "video này hữu ích" để nhóm tự xếp hạng.

### 3.2 Trắc nghiệm
- Dạng câu: 1 đáp án, nhiều đáp án, điền số, "đoán kết quả" (nhìn viz rồi đoán), sắp xếp bước.
- Mỗi câu có: tag khái niệm, độ khó, **giải thích đáp án** (bắt buộc — không có giải thích thì câu hỏi ít giá trị).
- Chế độ: ôn theo khái niệm / đề ngẫu nhiên theo chủ đề / đề thi thử có giờ.
- Sau này: lặp lại ngắt quãng (spaced repetition, thuật toán FSRS) cho câu hay sai.

### 3.3 Trực quan hoá (điểm nhấn)
Ưu tiên những thứ người mới **khó hình dung nhất**:

| Ưu tiên | Viz | Người học "thấy" được gì |
|---|---|---|
| ★★★ | Gradient descent trên mặt loss 2D/3D, chỉnh learning rate | Vì sao lr lớn thì nổ, nhỏ thì chậm |
| ★★★ | Neuron/perceptron & đường biên quyết định | Một neuron chỉ là một đường thẳng |
| ★★★ | MLP playground (giống TF Playground, bản Việt, kèm giải thích) | Thêm lớp ẩn → biên cong được |
| ★★★ | Backprop từng bước trên đồ thị tính toán | Đạo hàm chảy ngược thế nào (chain rule) |
| ★★★ | Tích chập: kernel trượt trên ảnh, ra feature map | Conv làm gì với từng pixel |
| ★★ | Hàm kích hoạt & đạo hàm (sigmoid bão hoà, ReLU chết) | Vanishing gradient |
| ★★ | Overfitting: độ phức tạp mô hình vs train/val loss; regularization, dropout | Vì sao cần validation |
| ★★ | Softmax + cross-entropy với thanh kéo logits | Xác suất & loss thay đổi ra sao |
| ★★ | Attention: ma trận Q·K, heatmap trọng số | "Chú ý" nghĩa là gì bằng con số |
| ★★ | Tokenization & embedding (chiếu 2D) | Từ thành vector |
| ★ | K-means, KNN, cây quyết định, PCA | ML cổ điển |
| ★ | RNN "trải ra" theo thời gian, diffusion thêm/bớt nhiễu | Mô hình tuần tự, sinh ảnh |

Nguyên tắc cho mọi viz: **1 viz = 1 ý**, có nút "từng bước", có đoạn chữ giải thích bên cạnh, luôn link về thẻ khái niệm.

### 3.4 Luyện code
- Chạy Python **ngay trên trình duyệt** bằng [Pyodide](https://pyodide.org) (hỗ trợ NumPy, pandas, scikit-learn, matplotlib) → không cần server chấm bài, không tốn tiền, an toàn.
- Dạng bài: cài từ đầu bằng numpy (sigmoid, softmax, forward MLP, backprop, conv2d, attention…), có test ẩn chấm ngay.
- **Giới hạn cần biết:** PyTorch/TensorFlow *không* chạy được trong Pyodide. Bài cần PyTorch → giai đoạn đầu link sang Colab; khi thật sự cần mới làm server chấm riêng.
- Tham khảo cấu trúc đề của Deep-ML; tự viết đề (không sao chép).

### 3.5 Lộ trình (sơ đồ khái niệm)
Trang hiển thị đồ thị khái niệm theo tầng, tô màu cái đã học/đã làm quiz đúng:

1. **Nền tảng toán**: đại số tuyến tính, đạo hàm & chain rule, xác suất thống kê
2. **ML cổ điển**: hồi quy tuyến tính/logistic, loss, gradient descent, overfitting, KNN, cây, SVM, clustering, PCA
3. **Deep Learning**: perceptron, MLP, backprop, activation, optimizer, regularization, batch norm
4. **Thị giác máy tính**: CNN, pooling, ResNet, augmentation
5. **Xử lý ngôn ngữ & LLM**: tokenization, embedding, RNN/LSTM, attention, Transformer, fine-tuning, RAG
6. **Generative & mở rộng**: VAE, GAN, diffusion, RL cơ bản, AI agent

---

## 4. Khung kỹ thuật đề xuất

Nguyên tắc: **tĩnh trước, backend sau.** Nhóm vài người thì chưa cần server.

| Thành phần | Chọn | Lý do |
|---|---|---|
| Framework | **Astro** + React cho phần tương tác | Web nhiều nội dung + các "đảo" tương tác; nhanh, dễ; bật SSR khi cần |
| Nội dung | Markdown/MDX + YAML trong Git ("Git làm CMS") | Bạn bè đóng góp bằng Pull Request, có lịch sử, không cần trang admin |
| Công thức | KaTeX | Nhanh, chuẩn |
| Viz | SVG/Canvas + D3 (2D), Three.js khi cần 3D; mô hình thật dùng TensorFlow.js / ONNX Runtime Web | Chạy client-side |
| Code editor + chạy | CodeMirror + Pyodide trong Web Worker | Không treo giao diện |
| Tiến độ học | localStorage giai đoạn đầu | Chưa cần đăng nhập |
| Khi cần đăng nhập/đồng bộ | Supabase (auth + Postgres) | Miễn phí cho nhóm nhỏ |
| Deploy | Cloudflare Pages hoặc Vercel | Miễn phí |

### Cấu trúc dữ liệu nội dung (đã làm)
```
content/
  khai-niem/gradient-descent.mdx    # frontmatter = thẻ khái niệm (ten_vi, tang, tien_quyet, dinh_nghia, truc_giac, hieu_nham, tai_lieu…)
                                    # thân = bài học, nhúng <Viz client:visible />
  quiz/gradient-descent.yaml        # trang_thai + cau_hoi[] (loai: mot | nhieu | so)
  bai-tap/gd-mot-bien/              # de.md (khai_niem: …), starter.py, solution.py, tests.py
src/viz/GradientDescent1D.tsx       # mỗi viz một component React
src/content.config.ts               # schema của mọi loại nội dung
public/runner.py                    # chấm bài, dùng chung cho trình duyệt (Pyodide) và scripts/kiem_tra_bai_tap.py
```
Thẻ khái niệm và bài học gộp chung một file (ít file hơn, không lệch nhau).
Chỉ một quy ước bắt buộc: **mọi thứ đều khai báo `concept`**. Giữ được cái này là khung vững.

---

## 5. Lộ trình làm

| Giai đoạn | Làm gì | Xong khi |
|---|---|---|
| **0. Chốt khung** ✅ | Đã chốt quyết định (mục 7) + danh sách khái niệm (mục 8) | Xong |
| **1. MVP dọc** 🚧 code xong, chờ duyệt nội dung | Làm trọn **Gradient Descent** đủ 5 thành phần: thẻ, bài, viz, 10 câu quiz, 2 bài code | Bạn học dùng thử và thấy hữu ích |
| **2. Mở rộng ngang** | Nhân rộng ra ~15–20 khái niệm DL cơ bản; trang lộ trình | Học được hết "Neural network cơ bản" trên web |
| **3. Cá nhân hoá** | Đăng nhập, đồng bộ tiến độ, ôn tập ngắt quãng, thống kê câu hay sai | — |
| **4. Ứng dụng thêm** | Tuỳ nhu cầu: phỏng vấn thử, đọc paper có hướng dẫn, trợ lý AI giải thích tại chỗ, bảng xếp hạng nhóm… | — |

Làm **dọc 1 chủ đề trước** thay vì dựng hết các module rỗng: sẽ lộ ra ngay khung dữ liệu thiếu gì.

---

## 6. Rủi ro

- **Nút thắt là nội dung, không phải code.** Một khái niệm đầy đủ tốn vài buổi. Cần chia việc viết nội dung trong nhóm sớm.
- **Phình phạm vi**: viz rất dễ nghiện làm. Giới hạn "1 viz = 1 ý".
- **Độ chính xác**: nội dung tự viết (hoặc nhờ AI viết) phải có người review chéo trước khi đưa lên.
- **Bản quyền**: không chép đề/hình từ khoá học khác; link tới là được.

---

## 7. Quyết định đã chốt

| Vấn đề | Chốt | Hệ quả |
|---|---|---|
| Trình độ nhóm | Mới bắt đầu | Bắt đầu từ tầng 1 (toán nền), viết bài theo hướng trực giác trước, công thức sau |
| Stack | Astro + React (nhóm biết React) | Viz và quiz là component React; trang nội dung là Astro/MDX |
| Nội dung | AI soạn nháp → người duyệt | Mỗi file có `trang_thai: nhap \| da_duyet` và `nguoi_duyet`; web chỉ hiện bản `da_duyet` (bản nháp hiện khi chạy local) |
| Đăng nhập | Chưa cần | Tiến độ lưu localStorage; Supabase để giai đoạn 3 |
| Ngôn ngữ | Tiếng Việt, giữ thuật ngữ Anh trong ngoặc lần đầu xuất hiện | vd. "hàm mất mát (loss function)" |
| MVP | Gradient Descent | Chủ đề trung tâm của ML, viz trực quan nhất, chỉ cần đạo hàm làm nền |

### Checklist duyệt nội dung AI soạn
- [ ] Công thức/đạo hàm đã tự kiểm lại (hoặc chạy code kiểm chứng)
- [ ] Mỗi câu quiz: đáp án đúng duy nhất (hoặc rõ ràng với dạng nhiều đáp án), giải thích không mâu thuẫn
- [ ] Bài code: `tests.py` pass với lời giải mẫu, fail với starter
- [ ] Link video còn sống, mốc thời gian đúng
- [ ] Người mới đọc hiểu được (nhờ 1 bạn chưa học đọc thử)

---

## 8. Danh sách khái niệm tầng 1–3 (bản đầu, 32 khái niệm)

`→` = cần biết trước. ★ = có viz trong kế hoạch.

**Tầng 1 — Toán nền**
1. `vector-ma-tran` Vector & ma trận
2. `nhan-ma-tran` Nhân ma trận, tích vô hướng → 1
3. `dao-ham` Đạo hàm & ý nghĩa độ dốc ★
4. `dao-ham-rieng-gradient` Đạo hàm riêng & gradient → 3 ★
5. `chain-rule` Quy tắc chuỗi → 3
6. `xac-suat-co-ban` Xác suất, phân phối
7. `ky-vong-phuong-sai` Kỳ vọng, phương sai → 6

**Tầng 2 — ML cổ điển**
8. `ml-la-gi` ML là gì: dữ liệu, mô hình, học có/không giám sát
9. `train-val-test` Chia train/validation/test → 8
10. `hoi-quy-tuyen-tinh` Hồi quy tuyến tính → 2, 8 ★
11. `ham-mat-mat` Hàm mất mát (MSE) → 10
12. `gradient-descent` **Gradient Descent (MVP)** → 4, 11 ★
13. `learning-rate` Learning rate → 12 ★
14. `sgd-mini-batch` SGD & mini-batch → 12
15. `hoi-quy-logistic` Hồi quy logistic & sigmoid → 10, 6 ★
16. `cross-entropy` Cross-entropy → 15
17. `softmax` Softmax & phân loại nhiều lớp → 16 ★
18. `overfitting` Overfitting / underfitting → 9 ★
19. `regularization` Regularization L1/L2 → 18
20. `danh-gia-mo-hinh` Accuracy, precision, recall, confusion matrix → 9
21. `knn` K láng giềng gần nhất ★
22. `k-means` K-means ★
23. `cay-quyet-dinh` Cây quyết định ★

**Tầng 3 — Deep Learning**
24. `perceptron` Perceptron & đường biên quyết định → 15 ★
25. `ham-kich-hoat` Hàm kích hoạt (sigmoid, tanh, ReLU) → 24 ★
26. `mlp` Mạng nhiều lớp (MLP) → 24, 25 ★
27. `lan-truyen-xuoi` Lan truyền xuôi (forward pass) → 26, 2
28. `lan-truyen-nguoc` Lan truyền ngược (backprop) → 27, 5, 12 ★
29. `khoi-tao-trong-so` Khởi tạo trọng số & vanishing/exploding gradient → 28
30. `optimizer` Momentum, Adam → 14
31. `dropout` Dropout → 18, 26
32. `batch-norm` Batch normalization → 26

---

## 9. Kế hoạch sau nghiên cứu (2026-09-17)

Chi tiết và nguồn: [research/01-cach-hoc.md](research/01-cach-hoc.md) · [research/02-repo-tham-khao.md](research/02-repo-tham-khao.md) · [research/03-kien-truc.md](research/03-kien-truc.md)

### 9.1 Kết luận chính
- **Cách học:** bằng chứng mạnh nhất là tự kiểm tra (retrieval), ôn ngắt quãng, tự giải thích, và đoán trước rồi mới quan sát. Xem viz thụ động và đọc lại **không** hiệu quả. Web hiện có quiz ở cuối bài nhưng chưa có ôn tập, nên đây là chỗ hổng lớn nhất.
- **Không làm:** bảng xếp hạng cạnh tranh (nhóm nhỏ dễ nản; điểm chấm ở trình duyệt nên không đáng tin), chuỗi ngày học (streak) cứng, khoá bài theo điểm, gamification dày đặc.
- **Kiến trúc:** chưa cần backend. Nội dung luôn nằm trong Git; dữ liệu người dùng vào Postgres (Supabase) **chỉ khi** cần đồng bộ nhiều thiết bị. Quyền biên tập/duyệt giao cho GitHub (PR + CODEOWNERS), không tự xây. Blog để chung repo.
- **Đường nối duy nhất giữa nội dung và dữ liệu người dùng là id** (tên file khái niệm, `id` câu hỏi) ⇒ không đổi tên tuỳ tiện.

### 9.2 Lộ trình

| Giai đoạn | Nội dung | Kích hoạt |
|---|---|---|
| **A. Học hiệu quả** (không backend) ✅ xong 2026-09-17 | 1) `id` cố định cho từng câu quiz · 2) quiz hỏi "chắc/đoán", lưu kết quả từng câu · 3) câu hỏi nhúng giữa bài MDX · 4) ô "giải thích lại bằng lời của bạn" · 5) viz "đoán trước rồi chạy" · 6) trang **Ôn hôm nay** (`ts-fsrs`, trộn nhiều khái niệm) + xuất/nhập tiến độ JSON · 7) 4 mức thành thạo tô màu lộ trình, gợi ý ôn tiền quyết khi vấp | Ngay |
| **B. Thiết kế lại UI/UX** | Bố cục có sẵn chỗ cho các khu: **Học nền tảng · Blog · Nghiên cứu · Engineering**; editor `@uiw/react-codemirror`; viz dựng trên `mafs`; lộ trình dạng đồ thị bằng `xyflow`; tìm kiếm Pagefind | Song song với A |
| **C. Nội dung** 🚧 đợt 1 xong 2026-09-18: 12 khái niệm chuỗi tới backprop (bản nháp, chờ duyệt) | Soạn chuỗi khái niệm dẫn tới backprop · chuyển `numpy-100` thành bài code · từ điển thuật ngữ dựa trên d2l-vi / ebookMLCB (ghi CC BY-SA) · nhúng TensorFlow Playground Việt hoá · dự án mồi đầu mỗi tầng · chuỗi "mini-micrograd" | Liên tục |
| **G1. Nhiều người viết** | Collections `baiViet`, `tacGia`, `huongDan` (`khu: nghien-cuu \| engineering`) chung lõi trường · Pages CMS cho người không biết Git · Giscus bình luận · deploy Cloudflare + bản xem trước có nháp (`HIEN_NHAP=1`) | Có bài blog/hướng dẫn đầu tiên |
| **G2. Tài khoản** | Supabase Free: bảng `tien_do` có RLS, localStorage làm dự phòng | Có người mất tiến độ giữa các thiết bị, hoặc ôn tập được dùng đều |
| **G3. Mở công khai** | Adapter Cloudflare cho vài route server (chấm bài phía server, trang admin), i18n nếu có người đọc tiếng Anh | Mở cho người ngoài nhóm |

### 9.3 Danh sách "độc lạ" (backlog)
Tensor-Puzzles bằng NumPy · tokenizer playground tiếng Việt (gpt-tokenizer + minbpe) · embedding thật trong trình duyệt (transformers.js) · di chuột vào thuật ngữ hiện thẻ khái niệm · kiểm tra gradient bằng sai phân hữu hạn trong `runner.py` · câu hỏi "shape là gì?".

### 9.4 Ràng buộc license cần nhớ
- **Không chép:** Deep-ML (Educational Use Only), roadmap.sh (chỉ dùng cá nhân), fastbook (phần lời), udlbook (CC BY-NC-ND), bộ câu hỏi không có license → chỉ đặt link.
- **Dùng được, phải giữ license:** d2l, MLU-Explain, ebookMLCB (CC BY-SA 4.0) → gắn `license` theo từng bài dẫn xuất.
- **Dùng thoải mái (MIT/Apache):** numpy-100, micrograd, ts-fsrs, mafs, xyflow, TensorFlow Playground, TorchLeet, transformers.js.
