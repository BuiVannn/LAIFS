# 04 — Dịch máy: bản tóm tắt nhanh (2026-09-18)

Bản này để **đọc ngay** trong 20–30 phút. Các bài học đầy đủ (có quiz, code, trực quan hoá) đang được soạn thành 11 khái niệm tầng 5 trên web.
Mọi số liệu đều kèm nguồn; chỗ nào chưa kiểm được thì ghi rõ.

---

## 1. Toàn cảnh trong 10 dòng

- Dịch máy hiện đại = **mô hình sinh chuỗi**: đọc câu nguồn, sinh câu đích từng token một, mỗi bước chọn token có xác suất cao nhất theo ngữ cảnh.
- Kiến trúc chuẩn từ 2017 là **Transformer**; trước đó là RNN encoder–decoder (seq2seq) + attention.
- Chất lượng phụ thuộc ba thứ, theo đúng thứ tự quan trọng với người mới: **dữ liệu song ngữ → cách đánh giá → kiến trúc/kỹ thuật huấn luyện**.
- **Ngôn ngữ nhiều tài nguyên** (Anh–Pháp, Anh–Trung): hàng chục–hàng trăm triệu cặp câu, mô hình chuyên dụng và LLM đều tốt.
- **Ngôn ngữ ít tài nguyên**: vài nghìn đến vài trăm nghìn cặp câu, dữ liệu nhiễu, và **cách đánh giá cũng yếu** — đây mới là cái khó nhất.
- Tiếng Việt nằm ở giữa: không hiếm như tiếng dân tộc thiểu số, nhưng kém xa tiếng Anh–Pháp. Bộ song ngữ Việt–Anh chất lượng lớn nhất được công bố là **PhoMT: 3,02 triệu cặp câu**, so với IWSLT15 chỉ khoảng 0,13 triệu ([PhoMT, EMNLP 2021](https://aclanthology.org/2021.emnlp-main.369.pdf)).
- Cứu cánh cho ít tài nguyên: **mô hình đa ngữ có sẵn** (NLLB-200 phủ 200 ngôn ngữ, [Nature 2024](https://www.nature.com/articles/s41586-024-07335-x)), **back-translation**, **transfer từ cặp giàu tài nguyên**.
- Từ 2024–2025, **LLM đa dụng đã dẫn đầu bảng dịch máy**: ở WMT25, hệ tốt nhất toàn cuộc là **Gemini 2.5 Pro**, nằm trong cụm dẫn đầu ở **14 cặp ngôn ngữ** ([Findings WMT25](https://aclanthology.org/2025.wmt-1.22.pdf), đã đọc bản PDF gốc).
- Nhưng ở ngôn ngữ ít tài nguyên, LLM **xuống cấp mạnh** và hay bịa ([arXiv 2406.15625](https://arxiv.org/pdf/2406.15625)).
- Đánh giá: BLEU đã lỗi thời cho so sánh hệ thống tốt; dùng **chrF + COMET/MetricX**, và khi có thể thì đánh giá người (MQM).

---

## 2. Đường đi của một câu qua hệ dịch máy

```
Câu nguồn "Tôi đi học"
   │
   ├─ 1. Tách token (BPE/SentencePiece):  ▁Tôi ▁đi ▁học        ← vocab ~32k–256k
   ├─ 2. Embedding: mỗi token → vector (vd. 512 hoặc 1024 chiều)
   ├─ 3. Encoder (Transformer): mỗi token "nhìn" mọi token khác → vector ngữ cảnh
   ├─ 4. Decoder: sinh từng token đích, mỗi bước
   │       • self-attention lên phần đã sinh (có mask nhân quả)
   │       • cross-attention sang encoder  ← đây là chỗ "nhìn vào từ nguồn nào"
   │       • softmax trên toàn vocab → xác suất token kế tiếp
   ├─ 5. Giải mã: greedy / beam search (+ length penalty)
   └─ Câu đích "I go to school"
```

**Bốn ý dễ bị bỏ qua:**

1. **Tokenizer quyết định chi phí.** Tiếng Việt có dấu, và nhiều tokenizer của mô hình tiếng Anh cắt tiếng Việt thành nhiều mảnh hơn, nên cùng một nội dung tốn nhiều token hơn → đắt hơn, ngữ cảnh chật hơn, học khó hơn. (Trang trực quan tokenizer Việt–Anh trên web đo trực tiếp điều này.)
2. **Huấn luyện dùng teacher forcing** (luôn cho decoder thấy token đúng của câu tham chiếu), còn khi dùng thật thì decoder phải tự ăn đầu ra của chính mình — lệch này gây lỗi dồn, lặp từ.
3. **Beam search** giữ k ứng viên tốt nhất thay vì chọn tham lam từng bước, thường tốt hơn 1–2 điểm BLEU, nhưng beam quá lớn lại làm câu ngắn đi và chất lượng giảm.
4. **Ảo giác (hallucination)** trong dịch máy = câu đích trôi chảy nhưng không liên quan câu nguồn. Hay xảy ra khi dữ liệu nhiễu hoặc ngôn ngữ ít tài nguyên.

---

## 3. Dữ liệu: phần quyết định

| Loại | Là gì | Dùng để |
|---|---|---|
| **Song ngữ (parallel/bitext)** | Cặp câu nguồn–đích đã căn chỉnh | Huấn luyện chính |
| **Đơn ngữ (monolingual)** | Văn bản một thứ tiếng | Back-translation, tiền huấn luyện, mô hình ngôn ngữ |
| **So sánh được (comparable)** | Cùng chủ đề nhưng không dịch nhau (Wikipedia hai thứ tiếng) | Khai thác ra cặp câu bằng khớp nhúng (LASER…) |

Nguồn thật hay dùng: **OPUS** (tổng hợp nhiều corpus mở), phụ đề phim, tài liệu song ngữ của tổ chức quốc tế, web crawl, và bộ chuyên biệt như **PhoMT** cho Việt–Anh.

**Lọc dữ liệu quan trọng ngang thu thập dữ liệu:** bỏ cặp lệch độ dài bất thường, bỏ câu đã là dịch máy, bỏ trùng lặp, và đặc biệt **bỏ câu trùng với tập test** (rò rỉ làm điểm đẹp giả). Với ngôn ngữ ít tài nguyên, tỉ lệ nhiễu trong dữ liệu khai thác tự động có thể rất cao — dữ liệu bẩn đôi khi làm mô hình tệ hơn là không có.

---

## 4. Nhiều tài nguyên vs ít tài nguyên

**"Tài nguyên" không chỉ là số cặp câu.** Nó gồm: dữ liệu song ngữ, dữ liệu đơn ngữ, từ điển/thuật ngữ, công cụ (tokenizer, bộ tách câu), **tập test chuẩn**, và **người bản ngữ để đánh giá**. Một ngôn ngữ có thể có kha khá văn bản nhưng vẫn "ít tài nguyên" vì không có tập test tin cậy.

Phân lớp ngôn ngữ theo tài nguyên được dùng phổ biến nhất là của [Joshi et al., ACL 2020](https://aclanthology.org/2020.acl-main.560/) (6 lớp, từ 0 đến 5). **Tiếng Việt được xếp lớp 4** — trên phần lớn ngôn ngữ trên thế giới, nhưng dưới lớp 5 (Anh, Pháp, Trung…). Lớp 0 gồm 2.191 ngôn ngữ (88,38% số ngôn ngữ) gần như không có tài nguyên, còn lớp 5 chỉ có 7 ngôn ngữ.

**Vì sao ít tài nguyên thì khó hơn nhiều so với "chỉ là ít dữ liệu":**

- Mô hình dễ học thuộc và bịa khi gặp câu ngoài miền.
- Dữ liệu thường lệch miền nặng (toàn Kinh Thánh, phụ đề phim, hoặc văn bản hành chính).
- Tokenizer huấn luyện chủ yếu trên tiếng Anh cắt vụn ngôn ngữ đó → mỗi câu tốn nhiều token, mô hình khó học.
- **Đánh giá không đáng tin:** ít tập test chuẩn, metric học máy (COMET) cũng ít được huấn luyện cho ngôn ngữ đó.
- Ít người bản ngữ làm được đánh giá thủ công.

**Mốc dữ liệu thô để cảm nhận (rất xấp xỉ):** vài nghìn cặp → chỉ đủ fine-tune nhẹ mô hình đa ngữ; vài chục nghìn → fine-tune có kết quả dùng được trong miền hẹp; vài trăm nghìn → huấn luyện riêng bắt đầu hợp lý; vài triệu (mức PhoMT của Việt–Anh) → chất lượng chung tốt. *Đây là kinh nghiệm chung, không phải con số từ một nghiên cứu cụ thể.*

---

## 5. Làm gì khi ít dữ liệu — theo thứ tự nên thử

1. **Đừng huấn luyện từ đầu.** Lấy mô hình đa ngữ có sẵn (NLLB-200, mBART, M2M-100, MADLAD-400) rồi **fine-tune** trên dữ liệu của bạn. Đây gần như luôn là bước đầu tiên đúng.
2. **Back-translation**: dùng dữ liệu đơn ngữ phía đích, dịch ngược về phía nguồn bằng một mô hình tạm, được cặp giả để huấn luyện. Kỹ thuật kinh điển và vẫn hiệu quả nhất về tỉ lệ công sức/kết quả ([Sennrich et al., ACL 2016](https://aclanthology.org/P16-1009/)).
3. **Chọn dữ liệu theo miền**: 20k câu đúng miền thường hơn 200k câu lạc miền.
4. **Transfer từ ngôn ngữ họ hàng** hoặc từ cặp giàu tài nguyên (huấn luyện Anh–Việt trước, rồi chuyển sang Việt–Mường chẳng hạn).
5. **Chia sẻ vocab/tokenizer hợp lý** cho ngôn ngữ đích, đừng dùng nguyên tokenizer tiếng Anh.
6. **Pivot qua tiếng Anh** khi không có dữ liệu trực tiếp (Việt→Anh→X), chấp nhận lỗi cộng dồn.
7. **LLM + từ điển trong prompt** (đưa thuật ngữ, vài ví dụ dịch mẫu vào prompt) — rẻ, thử nhanh, hợp lúc chưa có gì.
8. **Xây tập test tử tế trước khi tối ưu bất cứ thứ gì.** Không có thước đo thì mọi cải tiến đều là cảm tính.

---

## 6. LLM hay mô hình dịch chuyên dụng?

| | Mô hình NMT chuyên dụng (NLLB, Marian…) | LLM đa dụng (Gemini, Claude, GPT…) |
|---|---|---|
| Chất lượng ở cặp nhiều tài nguyên | Tốt | **Tốt nhất hiện nay** (Gemini 2.5 Pro dẫn đầu WMT25) |
| Ngôn ngữ ít tài nguyên | Ổn định hơn, phủ rộng (NLLB: 200 ngôn ngữ) | Xuống cấp mạnh, hay bịa |
| Ngữ cảnh dài, văn phong, thuật ngữ | Yếu | Mạnh (đưa được glossary, ngữ cảnh tài liệu) |
| Chi phí / tốc độ | Rẻ, chạy được offline | Đắt hơn theo token, tiếng Việt tốn nhiều token |
| Kiểm soát | Fine-tune được trọn vẹn | Chủ yếu qua prompt, hoặc fine-tune tốn kém |

Cách làm thực dụng năm 2026: **LLM cho cặp phổ biến và cho văn bản cần văn phong/thuật ngữ; NMT chuyên dụng (hoặc NLLB fine-tune) cho cặp hiếm và cho khối lượng lớn**; cả hai đều cần một tập test riêng của bạn.

---

## 7. Đánh giá: đừng chỉ nhìn BLEU

- **BLEU**: đếm n-gram khớp với bản tham chiếu + phạt câu ngắn. Rẻ, dễ hiểu, nhưng phạt oan từ đồng nghĩa và đổi trật tự từ, và **không so sánh được giữa các ngôn ngữ hay các cách tách token khác nhau** — vì vậy mới có sacreBLEU để chuẩn hoá.
- **chrF**: khớp theo ký tự, hợp hơn với ngôn ngữ có hình thái phong phú.
- **COMET / MetricX / xCOMET**: metric học máy, tương quan với đánh giá người cao hơn hẳn BLEU; hiện là mặc định trong giới nghiên cứu. Điểm yếu: hay bỏ sót lỗi nghiêm trọng về **số liệu và tên riêng**.
- **Đánh giá người (MQM)**: vẫn là chuẩn vàng, và là cơ sở xếp hạng chính thức ở WMT.
- **Quy tắc thực dụng:** báo cáo ít nhất chrF + một metric học máy, kèm vài chục câu đọc tay. Với ngôn ngữ ít tài nguyên, đọc tay quan trọng hơn mọi con số.

---

## 8. Nếu bạn cần bắt tay làm trong tuần này

1. Chuẩn bị **tập test 300–500 câu** của đúng miền bạn quan tâm, do người soát.
2. Đo **baseline**: Google/LLM sẵn có + NLLB-200 chưa fine-tune, bằng chrF + COMET + đọc tay 50 câu.
3. Gom dữ liệu song ngữ (OPUS, PhoMT nếu là Việt–Anh), **lọc sạch**, tách ra dev/test không trùng.
4. **Fine-tune NLLB-200** (bản nhỏ trước) trên dữ liệu đã lọc; so với baseline.
5. Nếu còn thiếu dữ liệu: **back-translation** từ đơn ngữ đích, thêm vào rồi đo lại.
6. Ghi lại mọi lần đo vào một bảng. Không có bảng thì sau một tuần sẽ không biết cái gì thực sự giúp.

---

## 9. Nguồn chính

- PhoMT (Việt–Anh, 3,02 triệu cặp câu) — [ACL Anthology, EMNLP 2021](https://aclanthology.org/2021.emnlp-main.369.pdf)
- NLLB-200 / FLORES-200 — [Nature 2024](https://www.nature.com/articles/s41586-024-07335-x), [arXiv 2207.04672](https://arxiv.org/pdf/2207.04672)
- Findings of the WMT25 General MT Task — [ACL Anthology](https://aclanthology.org/2025.wmt-1.22.pdf). (Lưu ý: [arXiv 2508.14909](https://arxiv.org/pdf/2508.14909) chỉ là **xếp hạng tự động sơ bộ**, không phải đánh giá của người — đừng trích cho tuyên bố về đánh giá người.)
- Hạn chế của LLM ở ngôn ngữ ít tài nguyên — [arXiv 2406.15625](https://arxiv.org/pdf/2406.15625)
- Back-translation — [Sennrich et al., ACL 2016](https://aclanthology.org/P16-1009/)
- Phân lớp tài nguyên ngôn ngữ — [Joshi et al., ACL 2020](https://aclanthology.org/2020.acl-main.560/)
- BLEU gặp COMET, bàn về kết hợp metric — [arXiv 2305.19144](https://arxiv.org/abs/2305.19144)
