# Nghiên cứu 01 — Cách học hiệu quả cho người tự học kỹ thuật/toán → tính năng cho LAIFS

> Ngày: 2026-09-17. Đối tượng: người **tự học, mới bắt đầu**, học ML/DL.
> Phạm vi: nguyên lý học tập có bằng chứng, động lực/thói quen, cơ chế của các sản phẩm học tốt, và riêng cho ML/DL.
> Mọi số liệu đều kèm nguồn. Chỗ nào không tìm được nguồn gốc hoặc chỉ là ý kiến thì ghi rõ **[chưa có nguồn gốc]** / **[ý kiến]**.

## Cách đọc

**Mức tin cậy**

| Mức | Nghĩa |
|---|---|
| **A** | Nhiều thí nghiệm + ít nhất một meta-analysis, kết quả nhất quán |
| **B** | Có meta-analysis/RCT nhưng hiệu quả phụ thuộc điều kiện, hoặc bằng chứng chủ yếu ở môn khác |
| **C** | Nghiên cứu tương quan, A/B test do công ty tự công bố, tài liệu sản phẩm, hoặc ý kiến chuyên gia |

**Ưu tiên**: P0 = nên làm ngay (giai đoạn 2), P1 = làm khi đã có ~15 khái niệm, P2 = để sau.
**Độ khó**: Dễ (≤1 buổi, dùng lại `Quiz.tsx`/localStorage) · TB (vài buổi, hoặc thêm thư viện) · Khó (cần backend hoặc nhiều nội dung mới).

**Hiện trạng liên quan** (đọc từ repo): `Quiz.tsx` chỉ lưu `quiz:<id> = {dung, tong}` vào localStorage — không lưu từng câu, câu hỏi trong YAML **không có `id` ổn định**. Frontmatter khái niệm đã có `tien_quyet`. Đây là hai điểm dữ liệu sẽ quyết định nhiều tính năng bên dưới.

---

## Phần A — Nguyên lý nhận thức

### A1. Truy xuất (retrieval practice / testing effect) — Mức **A**

**Bằng chứng**
- Meta-analysis 272 hiệu ứng / 188 thí nghiệm: làm bài kiểm tra luyện tập tốt hơn đọc lại, **g = 0,51**; so với không làm gì/hoạt động lấp chỗ, g = 0,93. — Adesope, Trevisan & Sundararajan (2017), *Review of Educational Research*. [doi:10.3102/0034654316689306](https://journals.sagepub.com/doi/abs/10.3102/0034654316689306)
- Meta-analysis thứ hai: testing vs restudy **g ≈ 0,50**; câu hỏi dạng *tự nhớ ra* (recall) cho lợi ích lớn hơn dạng *nhận ra* (recognition, trắc nghiệm). — Rowland (2014), *Psychological Bulletin*. [PubMed](https://pubmed.ncbi.nlm.nih.gov/25150680/)
- "Doer effect": trong một MOOC, làm thêm hoạt động tương tác (1 SD) gắn với mức học tăng **hơn 6 lần** so với xem thêm video/đọc thêm (dữ liệu tương quan, có dùng suy luận nhân quả). — Koedinger et al. (2015), *L@S*. [CMU News](https://www.cmu.edu/news/stories/archives/2015/september/moocs-vs-oli.html)
- Học chủ động trong STEM đại học: điểm thi +0,47 SD, tỉ lệ trượt khi học giảng thuần gấp 1,5 lần (225 nghiên cứu). — Freeman et al. (2014), *PNAS*. [doi:10.1073/pnas.1319030111](https://www.pnas.org/doi/10.1073/pnas.1319030111)

**Ý nghĩa cho LAIFS**: đọc bài MDX là phần *ít* hiệu quả nhất. Câu hỏi phải xuất hiện **trong** bài, không chỉ ở cuối. Ưu tiên câu phải *tự sinh ra* đáp án (dạng `so`, điền biểu thức, dự đoán) hơn chọn A/B/C/D.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F2 | **Câu hỏi nhúng giữa bài**: `<Quiz cau="gd-03" />` trong MDX, 1 câu sau mỗi ý chính (~mỗi 300–500 chữ). Bài chỉ "hoàn thành" khi đã trả lời hết (đúng hay sai đều được). | **P0** | Dễ |
| F2b | Ưu tiên dạng tự sinh đáp án: mở rộng `loai: so` (đã có), thêm `loai: bieu_thuc` (so khớp bằng cách tính thử vài giá trị) ở P1. | P1 | TB |

### A2. Lặp lại ngắt quãng (spacing / spaced repetition) — Mức **A** (hiệu ứng), **B–C** (chọn thuật toán)

**Bằng chứng về hiệu ứng**
- Truy xuất *ngắt quãng* tốt hơn truy xuất *dồn một lúc*: **g = 0,74** (29 nghiên cứu). Lịch giãn dần (expanding) **không** chắc chắn tốt hơn lịch đều. — Latimier, Peyre & Ramus (2021), *Educational Psychology Review*. [doi:10.1007/s10648-020-09572-8](https://link.springer.com/article/10.1007/s10648-020-09572-8)
- Hơn 1.350 người: khoảng cách ôn tối ưu tăng theo thời gian muốn nhớ; tính theo tỉ lệ, từ ~20–40% (muốn nhớ 1 tuần) xuống ~5–10% (muốn nhớ 1 năm). — Cepeda et al. (2008), *Psychological Science*. [doi:10.1111/j.1467-9280.2008.02209.x](https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02209.x)

**FSRS vs SM-2**
- FSRS là thuật toán mặc định tuỳ chọn trong Anki từ 23.10; tham số chính là *desired retention* (mặc định 90%). — [Anki Manual, Deck Options](https://docs.ankiweb.net/deck-options.html)
- Nền tảng học thuật: Ye, Su & Cao (2022), "A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling", *KDD*. [doi:10.1145/3534678.3539081](https://dl.acm.org/doi/10.1145/3534678.3539081)
- Benchmark cộng đồng (~10.000 bộ sưu tập Anki, ~350 triệu lượt ôn): FSRS-6 log loss 0,346 so với HLR (thuật toán của Duolingo) 0,469. — [open-spaced-repetition/srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark). Bảng so với SM-2 nằm ở trang của chính tác giả benchmark: FSRS-6 dự đoán tốt hơn SM-2 ở **99,6%** người dùng (log loss 0,456 vs 0,567), kèm lưu ý chính tác giả: *SM-2 vốn không được thiết kế để dự đoán xác suất nên không có so sánh công bằng tuyệt đối*. — [Expertium & Jarrett Ye, Benchmark](https://expertium.github.io/Benchmark.html)
- **Lưu ý độ tin cậy**: benchmark đo *độ chính xác dự đoán nhớ/quên*, **không** phải thí nghiệm ngẫu nhiên đo kết quả học. Con số "FSRS cần ít hơn 20–30% lượt ôn so với SM-2 cho cùng mức nhớ" xuất hiện nhiều trên blog, nhưng **[chưa tìm được nguồn gốc có phương pháp công bố]** — không nên trích.
- Duolingo: mô hình Half-Life Regression giảm >45% sai số dự đoán và tăng **12%** mức tương tác hằng ngày trong thử nghiệm vận hành. — Settles & Meeder (2016), *ACL*. [ACL Anthology](https://aclanthology.org/P16-1174/)

**Kết luận thực dụng**: khác biệt lớn nhất là *có ôn ngắt quãng hay không*; chọn thuật toán là bậc hai. Nhưng FSRS có thư viện TypeScript sẵn (`ts-fsrs` của cùng tổ chức open-spaced-repetition), nên dùng FSRS **không đắt hơn** tự viết SM-2. Với người mới, đặt desired retention ~0,85–0,9 để khối lượng ôn không làm nản **[ý kiến]**.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F1 | **"Ôn hôm nay"**: mỗi câu quiz đã làm thành một thẻ; lịch FSRS (`ts-fsrs`), lưu localStorage. Trang chủ hiện "N câu đến hạn · ~M phút". Giới hạn tối đa ~20 câu/ngày để không ngập. | **P0** | TB |
| F1a | **Điều kiện tiên quyết**: thêm `id` ổn định cho từng câu trong YAML (vd. `id: gd-03`). Không có id, sửa thứ tự câu sẽ làm hỏng lịch ôn. | **P0** | Dễ |
| F1b | Nút **xuất/nhập tiến độ (JSON)** — localStorage mất khi xoá dữ liệu trình duyệt; lịch ôn là dữ liệu đáng giữ nhất. | **P0** | Dễ |
| F1c | Ôn cả **bài code** (kiểu Execute Program): sau 1/3/7… ngày yêu cầu viết lại hàm ngắn (vd. `softmax`) từ starter rỗng. | P1 | TB |

### A3. Xen kẽ (interleaving) — Mức **B**

**Bằng chứng**
- Meta-analysis 59 nghiên cứu: **g = 0,42** tổng; với bài toán học g = 0,34; với từ vựng thì *ngược lại* (g = −0,39). Hiệu quả mạnh hơn khi các loại **giống nhau giữa nhóm** (dễ nhầm) và vật liệu phức tạp. — Brunmair & Richter (2019), *Psychological Bulletin*. [PDF tác giả](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)
- RCT 787 học sinh lớp 7, 54 lớp: bài tập xen kẽ → bài kiểm tra bất ngờ sau 1 tháng 61% vs 38%, **d = 0,83**. — Rohrer, Dedrick, Hartwig & Cheung (2020), *Journal of Educational Psychology*. [PDF](https://gwern.net/doc/psychology/spaced-repetition/2019-rohrer.pdf)

**Ý nghĩa**: xen kẽ có ích nhất khi người học phải **chọn đúng công cụ** — đúng tình huống ML: MSE hay cross-entropy? sigmoid hay softmax? L1 hay L2? lr quá lớn hay quá nhỏ? overfit hay underfit?

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F7 | Hàng ôn F1 **trộn câu của nhiều khái niệm** (mặc định, gần như miễn phí). | **P0** | Dễ (đi kèm F1) |
| F7b | **Bộ "phân biệt"**: câu hỏi tình huống buộc chọn giữa các khái niệm hay nhầm (khai báo `nham_voi: [cross-entropy, ham-mat-mat]` trong frontmatter). | P1 | TB (nội dung) |

### A4. Ví dụ mẫu & ví dụ mờ dần (worked / faded examples), tải nhận thức — Mức **A** cho người mới, **B** khi đã giỏi

**Bằng chứng**
- Meta-analysis 55 nghiên cứu toán: ví dụ mẫu cải thiện kết quả **g = 0,48**; ví dụ *đúng* hiệu quả hơn ví dụ *sai*. — Barbieri, Miller-Cotto, Clerjuste & Chawla (2023), *Educational Psychology Review*. [doi:10.1007/s10648-023-09745-1](https://link.springer.com/article/10.1007/s10648-023-09745-1)
- **Hiệu ứng đảo ngược chuyên môn**: hướng dẫn chi tiết giúp người mới nhưng có thể *cản trở* người đã giỏi. — Kalyuga, Ayres, Chandler & Sweller (2003), *Educational Psychologist*. [doi:10.1207/S15326985EP3801_4](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4)
- Cho người mới, hướng dẫn tối thiểu kém hơn hướng dẫn tường minh. — Kirschner, Sweller & Clark (2006), *Educational Psychologist*. [doi:10.1207/s15326985ep4102_1](https://doi.org/10.1207/s15326985ep4102_1)
- Lập trình: **Parsons problems** (xếp lại các dòng code bị xáo, có dòng gây nhiễu) cho kết quả học **không khác biệt** so với tự viết/sửa code nhưng **tốn ít thời gian hơn đáng kể**. — Ericson, Margulieux & Rick (2017), *Koli Calling*. [doi:10.1145/3141880.3141895](https://dl.acm.org/doi/10.1145/3141880.3141895)
- Nhãn mục tiêu con (subgoal labels) giúp trong toán/khoa học, nhưng một nghiên cứu CS nhập môn **không tái lập** được lợi ích như kỳ vọng. — Morrison, Margulieux & Guzdial (2015), *ICER*. [doi:10.1145/2787622.2787733](https://dl.acm.org/doi/10.1145/2787622.2787733) → mức B cho code.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F6 | **Thang 3 bậc cho mỗi nhóm bài code**: (1) lời giải mẫu có chú thích từng bước → (2) bản khuyết 1–3 dòng quan trọng (faded) → (3) tự viết từ starter. Tận dụng cấu trúc `bai-tap/` sẵn có: thêm `mau.py` và `khuyet.py`. | **P1** | TB (chủ yếu nội dung) |
| F6b | **Parsons problem** trong trình duyệt (kéo thả dòng, chấm bằng chính `tests.py`). Rất hợp người chưa quen numpy. | P1 | TB |
| F6c | Nút **"Tôi đã biết cái này → bỏ qua ví dụ, làm luôn"** (tránh expertise reversal cho người đã có nền). | P1 | Dễ |

### A5. Tự giải thích / "kỹ thuật Feynman" — Mức **A** (self-explanation), **C** (tên gọi "Feynman")

**Bằng chứng**
- Meta-analysis 69 hiệu ứng: gợi ý người học tự giải thích khi học/giải bài, **g = 0,55**. — Bisra, Liu, Nesbit, Salimi & Winne (2018), *Educational Psychology Review*. [doi:10.1007/s10648-018-9434-x](https://link.springer.com/article/10.1007/s10648-018-9434-x)
- Khung ICAP: mức tham gia Interactive > Constructive > Active > Passive dự báo mức học. — Chi & Wylie (2014), *Educational Psychologist*. [PDF ASU](https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf)
- "Kỹ thuật Feynman" (giải thích như cho người mới) là cách gọi phổ biến, **[chưa tìm được nguồn gốc học thuật cho quy trình mang tên này]**; bằng chứng thực chất nằm ở nghiên cứu self-explanation bên trên.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F8 | **Ô "Giải thích lại bằng lời của bạn"** cuối bài (1–3 câu, lưu localStorage), rồi mới mở thẻ tóm tắt để tự so sánh theo checklist 3 ý (dùng mục `truc_giac`/`hieu_nham` có sẵn trong frontmatter). | **P0** | Dễ |
| F8b | Câu hỏi "**Vì sao?**" sau đáp án đúng trong quiz (tuỳ chọn gõ lý do trước khi xem giải thích). | P1 | Dễ |
| F8c | AI nhận xét bài tự giải thích (xem A10 về rào chắn). | P2 | Khó |

### A6. Dự đoán trước khi quan sát (predict–observe) & câu hỏi trước bài (pretest) — Mức **B**

**Bằng chứng**
- Xem thí nghiệm minh hoạ *thụ động* không hiểu hơn nhóm không xem; nhóm **dự đoán trước** kết quả hiểu tốt hơn rõ rệt. — Crouch, Fagen, Callan & Mazur (2004), *American Journal of Physics*. [Mazur Group](https://mazur.harvard.edu/publications/classroom-demonstrations-learning-tools-or-entertainment)
- Meta-analysis câu hỏi trước bài: lợi ích **cho chính thông tin được hỏi** g = 0,54; cho thông tin *không* được hỏi g = 0,04 (gần bằng 0). — St. Hilaire, Chan & Ahn (2023), *Psychonomic Bulletin & Review*. [PubMed](https://pubmed.ncbi.nlm.nih.gov/37640836/). Tổng quan: Pan & Carpenter (2023), *Educational Psychology Review*. [doi:10.1007/s10648-023-09814-5](https://link.springer.com/article/10.1007/s10648-023-09814-5)

**Ý nghĩa**: viz là điểm nhấn của LAIFS, nhưng viz xem thụ động có thể chỉ là "giải trí". Pretest chỉ giúp đúng ý được hỏi → câu hỏi đầu bài phải nhắm vào **ý cốt lõi**.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F4 | **Chế độ "Đoán trước"** cho viz: trước khi bấm chạy, người học chọn dự đoán (vd. "lr = 1.1 thì loss sẽ: giảm / dao động / phân kỳ"), viz chỉ chạy sau khi chọn, rồi hiện so sánh dự đoán vs thực tế. Thêm prop `duDoan={...}` cho component viz, dùng lại logic chấm của `Quiz.tsx`. Áp dụng cho `GradientDescent1D.tsx` trước. | **P0** | Dễ–TB |
| F10 | **2 câu đoán đầu bài** về ý cốt lõi (không chấm điểm, chỉ ghi lại để so sau bài). | P1 | Dễ |

### A7. Khó khăn đáng có & ảo giác "đã hiểu" — Mức **A**

**Bằng chứng**
- Hiệu suất lúc luyện là thước đo *không đáng tin* của việc học lâu dài; nhiều thao tác làm luyện tập khó hơn nhưng học tốt hơn. — Soderstrom & Bjork (2015), *Perspectives on Psychological Science*. [doi:10.1177/1745691615569000](https://journals.sagepub.com/doi/abs/10.1177/1745691615569000)
- RCT vật lý đại học: lớp học chủ động **học nhiều hơn nhưng cảm thấy học ít hơn** lớp nghe giảng. — Deslauriers et al. (2019), *PNAS*. [PubMed](https://pubmed.ncbi.nlm.nih.gov/31484770/)
- Lỗi sai **kèm tự tin cao** lại được sửa tốt hơn khi có phản hồi (hypercorrection). — Butterfield & Metcalfe (2001), *JEP: LMC*. [PubMed](https://pubmed.ncbi.nlm.nih.gov/11713883/); tổng quan Metcalfe (2017), *Annual Review of Psychology*. [Annual Reviews](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-010416-044022)

**Ý nghĩa**: người tự học sẽ *thích* đọc lại và xem video (cảm giác trôi chảy) hơn làm quiz (cảm giác khó). Web phải **nói thẳng** điều này và làm cho con đường khó là con đường mặc định.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F3 | **Phản hồi ngay + mức tự tin**: trước khi nộp, chọn "chắc / đoán". Sai-mà-chắc được đánh dấu nổi bật, luôn hiện giải thích (đã có `giai_thich`) và **tự vào hàng ôn F1** với hạn sớm. Lưu kết quả **từng câu** thay vì chỉ `{dung, tong}`. | **P0** | Dễ |
| F17 | Một dòng nhắc trong trang "Cách dùng web": "Thấy khó khi ôn là dấu hiệu đang học, không phải đang thất bại" + dẫn Deslauriers 2019. | P0 | Dễ |

### A8. Học đến thành thạo (mastery learning) — Mức **A** (hiệu quả), **B** (cho tự học không thầy)

**Bằng chứng**
- 108 đánh giá có đối chứng: chương trình mastery nâng điểm thi trung bình **0,52 SD**, lợi hơn cho học sinh yếu; **nhưng** tăng thời gian học và *chương trình tự nhịp (self-paced) thường làm giảm tỉ lệ hoàn thành* ở đại học. — Kulik, Kulik & Bangert-Drowns (1990), *Review of Educational Research*. [doi:10.3102/00346543060002265](https://journals.sagepub.com/doi/10.3102/00346543060002265)
- Con số "2 sigma" của Bloom (1984) đến từ các luận án nhỏ và **chưa được tái lập ở quy mô đó**; tổng quan độc lập ước lượng thực tế nhỏ hơn nhiều. — [Nintil, "On Bloom's two sigma problem"](https://nintil.com/bloom-sigma/) (blog tổng quan, mức C); [Education Next](https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/). → **Không nên trích "2 sigma".**
- Hệ thống dạy kèm thông minh dạng từng bước (step-based) đạt hiệu quả gần dạy kèm người thật (d ≈ 0,76 vs 0,79). — VanLehn (2011), *Educational Psychologist*. [doi:10.1080/00461520.2011.611369](https://www.tandfonline.com/doi/abs/10.1080/00461520.2011.611369)

**Ý nghĩa**: cảnh báo của Kulik rất quan trọng cho người tự học: **khoá cứng** "phải đạt 80% mới được học tiếp" có thể làm người ta bỏ cuộc. Nên dùng *gợi ý mạnh*, không *chặn*.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F5 | **Trạng thái khái niệm 4 mức** (Chưa học → Đã đọc → Hiểu (quiz ≥ 80% + 1 bài code pass) → Vững (còn nhớ sau lượt ôn ngắt quãng ≥ 7 ngày)). Tô màu trên trang lộ trình. Mức "Vững" chỉ đạt được qua ôn tập → gắn mastery với spacing (ý tưởng của Khan/Math Academy). | **P0** | TB |
| F5b | **Gợi ý tiền quyết khi vấp**: sai ≥ 2 câu cùng khái niệm → "Có thể bạn cần ôn [Đạo hàm] trước" (dùng `tien_quyet`). Không khoá bài. | P1 | Dễ |

### A9. Thất bại có ích (productive failure) — Mức **B**, có tranh luận

**Bằng chứng**
- 166 so sánh / 53 nghiên cứu: *giải bài trước rồi mới học* (PS-I) tốt hơn *học trước rồi giải* cho **hiểu khái niệm và chuyển giao**, g = 0,36; hiệu quả rõ hơn từ lớp 6 trở lên và khi thiết kế đúng nguyên tắc; với kỹ năng chung và trẻ nhỏ thì ngược lại. — Sinha & Kapur (2021), *Review of Educational Research*. [doi:10.3102/00346543211019105](https://journals.sagepub.com/doi/10.3102/00346543211019105)
- Mâu thuẫn bề ngoài với Kirschner et al. (2006) ở A4: cách dung hoà là *thử ngắn trước, rồi dạy tường minh ngay sau* — không phải để người mới tự mò.

**Tính năng**
| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F9 | **"Thử trước 5 phút"** ở đầu một số bài then chốt (vd. trước Gradient Descent: "Cho L(w) = (w−3)², không dùng công thức, hãy tìm w nhỏ nhất bằng cách chỉnh thanh kéo"). Luôn có nút "Bỏ qua, học luôn". | P2 | TB (nội dung) |

### A10. Trợ lý AI — Mức **B** (mới, đang thay đổi nhanh)

**Bằng chứng**
- RCT trung học phổ thông: GPT-4 kiểu ChatGPT thường giúp làm bài luyện tốt hơn nhưng khi **bỏ AI đi thì kết quả kém hơn** nhóm không dùng; phiên bản có rào chắn (chỉ gợi ý do giáo viên thiết kế, không đưa đáp án) giảm được tác hại. — Bastani et al. (2025), *PNAS*. [doi:10.1073/pnas.2422633122](https://www.pnas.org/doi/10.1073/pnas.2422633122) (bài có một bản đính chính: [correction](https://www.pnas.org/doi/10.1073/pnas.2518204122))
- RCT 194 sinh viên Harvard: gia sư AI được thiết kế theo nguyên tắc sư phạm cho mức học tăng hơn gấp đôi so với lớp học chủ động, trong ít thời gian hơn. — Kestin et al. (2025), *Scientific Reports*. [doi:10.1038/s41598-025-97652-6](https://www.nature.com/articles/s41598-025-97652-6)

**Ý nghĩa**: AI "hỏi gì đáp nấy" có thể *hại* người mới. Nếu làm (giai đoạn 4), phải là gia sư gợi ý từng bước, không lộ đáp án bài code/quiz.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F18 | Gia sư AI có rào chắn: chỉ gợi ý theo bậc (nhắc khái niệm → chỉ ra dòng sai → gợi ý hướng), không trả code lời giải. | P2 | Khó |

---

## Phần B — Động lực & thói quen cho người tự học

### B1. Vì sao người tự học bỏ cuộc — Mức **A** (hiện tượng), **B** (nguyên nhân)

- MOOC của MIT/Harvard trên edX: năm 2017–18 chỉ **3,13%** người đăng ký hoàn thành; trong nhóm đã trả phí xác minh là **46%**. Tỉ lệ này gần như không cải thiện sau 6 năm. — Reich & Ruipérez-Valiente (2019), *Science*. [doi:10.1126/science.aav7958](https://www.science.org/doi/10.1126/science.aav7958)
- 20 MOOC, >67.000 người: trở ngại chính là **không tìm được thời gian**, gắn với khả năng tự kiểm soát ý chí thấp; người tự nhận thành công có mục tiêu rõ, tư duy phát triển và **cảm giác thuộc về** cao hơn. — Kizilcec & Halawa (2015), *L@S*. [doi:10.1145/2724660.2724680](https://dl.acm.org/doi/10.1145/2724660.2724680)
- 4.831 người / 6 MOOC: **đặt mục tiêu và lập kế hoạch chiến lược** dự báo đạt mục tiêu cá nhân; người tự điều chỉnh tốt hay **quay lại làm bài kiểm tra cũ**. — Kizilcec, Pérez-Sanagustín & Maldonado (2017), *Computers & Education*. [PDF tác giả](https://rene.kizilcec.com/wp-content/uploads/2016/11/kizilcec2017srl.pdf)
- Duolingo (tự công bố): người học "cày" dồn dập **dễ bỏ app hơn** người giữ nhịp đều. — [Duolingo Blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) (mức C)

**Chống bỏ cuộc, rút ra**: (1) giảm "chi phí bắt đầu mỗi ngày" xuống vài phút; (2) kế hoạch cụ thể; (3) nhịp đều thay vì cày; (4) cảm giác có nhóm.

### B2. Lời nhắc lập kế hoạch (planning prompts) — Mức **B**

- 3 khoá HarvardX: hỏi người học đầu khoá *khi nào, ở đâu, làm gì để giữ kế hoạch* → hoàn thành khoá tăng **29% (tương đối)**, trả phí chứng chỉ tăng 40%. — Yeomans & Reich (2017), *LAK*. [doi:10.1145/3027385.3027416](https://dl.acm.org/doi/10.1145/3027385.3027416); tóm tắt tại [MIT Teaching Systems Lab](https://tsl.mit.edu/research/planning-prompts-increase-and-forecast-course-completion-in-massive-open-online-courses/). (Con số tuyệt đối trước/sau: **[không truy cập được bản đầy đủ để kiểm]**.)
- **Nhưng**: khi mở rộng ra ~250.000 người ở nhiều khoá, các can thiệp "nhẹ" (kể cả lập kế hoạch) chỉ cho **lợi ích nhỏ**, chủ yếu vài tuần đầu. — Kizilcec et al. (2020), *PNAS*. [doi:10.1073/pnas.1921417117](https://www.pnas.org/doi/pdf/10.1073/pnas.1921417117)
- → Rẻ và đáng làm, nhưng **đừng kỳ vọng nó giải quyết bỏ cuộc**.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F11 | **Kế hoạch học lần đầu vào web**: chọn số buổi/tuần, thời lượng (10/20/30 phút), gắn vào thói quen có sẵn ("sau bữa tối"), 1 câu "nếu bận thì mình sẽ…". Hiện lại kế hoạch trên trang chủ; tạo file `.ics` lịch lặp để người học tự thêm vào Google Calendar (không cần backend). | **P0** | Dễ |

### B3. Chuỗi ngày (streak) & mục tiêu nhỏ — Mức **B** (học thuật), **C** (dữ liệu Duolingo)

- 7 nghiên cứu: hiển thị chuỗi **còn nguyên** làm tăng hành vi tiếp theo so với chuỗi **đã đứt**; tác động xấu của chuỗi đứt **giảm khi người dùng được "sửa" chuỗi**. — Silverman & Barasch (2023), *Journal of Consumer Research*. [Oxford Academic](https://academic.oup.com/jcr/article-abstract/49/6/1095/6623414)
- Hình thành thói quen: trung vị **66 ngày**, dao động 18–254 ngày; **bỏ lỡ một lần không ảnh hưởng đáng kể** đến quá trình. — Lally et al. (2010), *European Journal of Social Psychology*. [doi:10.1002/ejsp.674](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674)
- Duolingo A/B test (tự công bố): "Streak Wager" tăng giữ chân ngày 7 **+14%**; "Weekend Amulet" (nghỉ cuối tuần không mất chuỗi) → khả năng quay lại sau 1 tuần +4%, mất chuỗi ít hơn 5%. — [Duolingo Blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/). Con số "0,38% DAU nhờ 2 streak freeze" hay "600 thí nghiệm về streak" lan truyền trên blog marketing **[chưa kiểm được từ nguồn Duolingo trong nghiên cứu này]**.

**Thiết kế rút ra**: streak có tác dụng, nhưng chuỗi đứt gây nản → phải có cơ chế nghỉ/sửa; Lally cho thấy nghỉ một ngày không sao → đừng để web "phạt" điều đó. Đối tượng là người đi làm/sinh viên bận → **chuỗi theo tuần** (đạt X buổi/tuần) có lẽ hợp hơn chuỗi theo ngày **[ý kiến, chưa có RCT so sánh]**.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F12 | **Chuỗi mềm**: đơn vị = "tuần đạt kế hoạch" (theo F11); ngưỡng giữ chuỗi rất thấp (ôn xong hàng đến hạn *hoặc* 1 câu mới); 1 lượt "nghỉ phép" mỗi tuần tự động; không thông báo kiểu đe doạ. | P1 | Dễ |
| F12b | **Mục tiêu nhỏ hiển thị tiến dần**: "Tầng 2: 7/16 khái niệm Hiểu" (thanh tiến độ theo F5). | P1 | Dễ |

### B4. Học nhóm & trách nhiệm với nhau (accountability) — Mức **B–C**

- Talkabout: thảo luận nhóm nhỏ qua video trong MOOC (>5.000 người, 14 khoá); người tham gia nhóm **đa dạng nhất** có điểm thi/bài tập cao hơn. — Kulkarni et al. (2015), *CSCW*. [PDF Stanford](https://hci.stanford.edu/publications/2015/PeerStudio/cscw237-kulkarni.pdf)
- Kizilcec & Halawa (2015) ở B1: cảm giác thuộc về gắn với thành công.
- Exercism: mentor tình nguyện xem code và thảo luận, có "Learning Mode" có lộ trình và "Practice Mode" tự do. — [Exercism Docs FAQ](https://exercism.org/docs/using/faqs) (mức C: tài liệu sản phẩm, không phải bằng chứng hiệu quả).
- Bảng xếp hạng cạnh tranh: **[không tìm được bằng chứng mạnh cho người mới học toán/kỹ thuật]**; với nhóm vài người, người đứng cuối dễ nản **[ý kiến]** → không khuyến nghị.

LAIFS có lợi thế lớn: **đã là một nhóm nhỏ quen nhau** — thứ MOOC không có.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F13 | **"Báo cáo tuần" 1 chạm**: nút tạo đoạn text ("Tuần này: 3 buổi, Hiểu thêm [SGD], [Cross-entropy]; đang vướng [Backprop]") để dán vào nhóm chat. Không cần backend. | P1 | Dễ |
| F13b | **Review code chéo kiểu Exercism**: bài code có nút "Xin nhận xét" → mở GitHub Discussion/Issue mẫu có sẵn code. Dùng Git sẵn có, không tự làm hệ thống mentor. | P1 | Dễ |
| F13c | Tiến độ nhóm đồng bộ, "đôi bạn học" (cần Supabase, giai đoạn 3). | P2 | Khó |

---

## Phần C — Sản phẩm làm tốt: cơ chế nào đáng mượn

| Sản phẩm | Cơ chế cụ thể (theo nguồn chính thức) | Mượn cho LAIFS? |
|---|---|---|
| **Math Academy** — [How our AI works](https://www.mathacademy.com/how-our-ai-works), [J. Skycak về FIRe](https://www.justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/) | Đồ thị kiến thức hàng nghìn chủ đề; bài chẩn đoán thích ứng tìm "biên kiến thức"; mastery rồi mở bài mới ngay; **Fractional Implicit Repetition**: ôn chủ đề nâng cao được tính là ôn *một phần* cho chủ đề nền nó bao hàm, nhờ đó **nén** nhiều lượt ôn thành ít bài; quiz nhắm ~80% đúng; khi vấp quá nhiều thì **dừng bài** và giao ôn đúng tiền quyết yếu. | **Có, bản rút gọn**: (1) F5b gợi ý tiền quyết khi vấp; (2) khi làm đúng câu của `lan-truyen-nguoc`, dời hạn ôn của `chain-rule` một chút (FIRe đơn giản, P2); (3) "dừng và gợi ý ôn" thay vì để người học sai mãi. Bài chẩn đoán đầu vào: P2 (32 khái niệm còn ít). |
| **Khan Academy** — [Mastery levels](https://support.khanacademy.org/hc/en-us/articles/5548760867853--How-do-Khan-Academy-s-Mastery-levels-work) | 4 mức Attempted → Familiar → Proficient → Mastered; lên *Mastered* phải đúng hết ở **bài kiểm tra đơn vị / course challenge** — tức là một lần kiểm tra *sau*, trộn nhiều kỹ năng. | **Có**: F5 (mức "Vững" chỉ đạt qua ôn tập sau). |
| **Duolingo** — [blog streak](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/), [HLR paper](https://aclanthology.org/P16-1174/) | Streak có wager/amulet/freeze; bài rất ngắn; mô hình trí nhớ dự đoán khi nào quên. | **Có một phần**: chuỗi mềm có nghỉ (F12), ôn ngắt quãng (F1). **Không mượn**: gamification dày đặc (XP, liga, thông báo dồn dập) — tối ưu cho *quay lại app*, chưa chắc tối ưu cho *hiểu toán*. |
| **Anki** — [Deck options/FSRS](https://docs.ankiweb.net/deck-options.html) | FSRS, desired retention, phát hiện "leech" (thẻ quên lặp lại nhiều lần). | **Có**: FSRS (F1); thẻ "leech" → không ôn tiếp mà gợi ý đọc lại bài/viz (vì thẻ quên mãi thường là do chưa hiểu, không phải chưa nhớ). |
| **Brilliant** — [brilliant.org/llms.txt](https://brilliant.org/llms.txt) | Tự mô tả: học qua *giải bài tương tác, mô hình trực quan, phản hồi ngay*, cùng retrieval, spacing, interleaving; gia sư số gợi ý từng bước không lộ đáp án. | **Có (đã là hình mẫu trong KHUNG-Y-TUONG)**: F2 + F4 chính là phiên bản LAIFS. |
| **Execute Program** — [Spaced repetition](https://www.executeprogram.com/spaced-repetition) | Khoá học gồm hàng trăm ví dụ code nhỏ tương tác; xong bài thì hôm sau có lượt ôn, rồi giãn dần; ôn cũng là *gõ code/đoán output*. | **Có**: F1c ôn bài code; câu hỏi "đoán output của đoạn numpy này" (shape của ma trận!) rất hợp ML. |
| **Exercism** — [Docs](https://exercism.org/docs/using/faqs) | Mentor tình nguyện nhận xét code; Learning Mode (có mở khoá tuần tự) vs Practice Mode (tự do). | **Có, qua GitHub**: F13b. Không tự dựng hệ thống mentor. |
| **fast.ai** — [course.fast.ai](https://course.fast.ai/) | Top-down: "bắt đầu bằng một mạng DL hoàn chỉnh, dùng được, giải bài toán thật… rồi đào sâu dần"; yêu cầu nền: biết code ~1 năm + toán phổ thông; "luôn dạy qua ví dụ". | **Có, có điều kiện**: xem D1. |
| **Deep-ML** — [deep-ml.com](https://www.deep-ml.com) | Bài cài đặt ML từ đầu, chấm test trên web. | Đã mượn (bài code + `tests.py`). |

---

## Phần D — Riêng cho ML/DL

### D1. Top-down hay bottom-up? — Mức **C** (không có RCT trực tiếp cho ML)

- **Top-down** (fast.ai): chạy được mô hình thật trước → động lực + khung để treo chi tiết. Lập luận dựa trên sách *Making Learning Whole* của David Perkins (2009) ("chơi toàn bộ trận đấu" trước). Không tìm thấy thí nghiệm có đối chứng so sánh top-down vs bottom-up **cho ML** **[chưa có nguồn]**.
- Bằng chứng gián tiếp ủng hộ phối hợp: productive failure (A9) cho thấy tiếp xúc bài toán thật trước khi học lý thuyết có lợi cho hiểu khái niệm; nhưng worked examples/cognitive load (A4) cho thấy người **mới hoàn toàn** cần hướng dẫn tường minh — và fast.ai tự đặt yêu cầu "đã code 1 năm".
- LAIFS đã chọn đi từ toán nền (tầng 1) cho người mới → rủi ro: học 7 khái niệm toán mà chưa thấy ML ở đâu, dễ bỏ cuộc (B1).

**Đề xuất: "bánh mì kẹp"** — mỗi tầng mở đầu bằng một *dự án mồi* chạy ngay (top-down, 15 phút), học khái niệm (bottom-up), kết thúc bằng tự cài lại dự án mồi từ đầu.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F14 | **Dự án mồi đầu tầng**: vd. tầng 2 "dự đoán giá nhà bằng scikit-learn trong Pyodide (5 dòng)" với chú thích "dòng này sẽ học ở [Hồi quy tuyến tính], [Gradient Descent]". Link mỗi dòng tới khái niệm. | P1 | TB |

### D2. Cài đặt từ đầu (implement from scratch) — Mức **C** cho ML cụ thể, **A** cho nguyên lý "làm > xem"

- Không tìm được RCT riêng về "implement from scratch" trong ML **[chưa có nguồn]**. Ủng hộ gián tiếp: doer effect (A1), ICAP — mức Constructive (A5).
- Thực hành chuyên gia: khoá [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) của Karpathy xây mạng nơ-ron "từ đầu, bằng code", bắt đầu từ micrograd (autograd vô hướng ~100 dòng); [A Recipe for Training Neural Networks](http://karpathy.github.io/2019/04/25/recipe/) (2019) nhấn mạnh hiểu từng bước thay vì coi thư viện là hộp đen (mức C: ý kiến chuyên gia).
- Rủi ro cho người mới: cài từ đầu tốn tải nhận thức (A4) → cần thang F6 và Parsons trước khi viết trắng.

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F15 | **Chuỗi dự án "mini-micrograd" bằng numpy** xuyên tầng 1–3: mỗi khái niệm thêm một mảnh (đạo hàm số → chain rule → neuron → MLP → backprop → optimizer), bài sau `import` kết quả bài trước. Cuối tầng 3: tự huấn luyện MLP nhỏ bằng code của chính mình. Pyodide đủ sức. | P1 | Khó (nội dung) |
| F15b | **Kiểm tra gradient bằng sai phân hữu hạn** như một tiện ích test chung trong `runner.py` — vừa chấm bài, vừa dạy kỹ năng debug thật của ngành. | P1 | Dễ |
| F15c | Câu hỏi "**shape là gì?**" (đoán shape tensor sau phép tính) — loại lỗi phổ biến nhất khi tự cài **[ý kiến]**, rất hợp dạng `so`/ôn ngắt quãng. | P1 | Dễ |

### D3. Đọc paper cho người mới — Mức **C**

- Phương pháp đọc 3 lượt: lượt 1 (5–10 phút: tiêu đề, abstract, mở đầu, tiêu đề mục, kết luận), lượt 2 (đọc kỹ, bỏ chứng minh, xem hình), lượt 3 (hiểu sâu, tái hiện lại). — Keshav (2007), *ACM SIGCOMM CCR*. [doi:10.1145/1273445.1273458](https://dl.acm.org/doi/10.1145/1273445.1273458) (bài hướng dẫn, không phải nghiên cứu thực nghiệm).
- Không tìm thấy nghiên cứu có đối chứng về cách người mới học đọc paper ML **[chưa có nguồn]**.
- Hợp với khung LAIFS: một paper = một chuỗi khái niệm đã có; chỉ nên đọc khi các khái niệm tiền quyết đã "Hiểu".

| # | Tính năng | Ưu tiên | Độ khó |
|---|---|---|---|
| F16 | **"Đọc paper có hướng dẫn"** (giai đoạn 4): trang cho 1 paper kinh điển (vd. Dropout 2014, Batch Norm 2015 — đều thuộc 32 khái niệm), gồm checklist 3 lượt, danh sách khái niệm tiền quyết (tô màu theo F5), 5 câu hỏi cho từng lượt, và bài code "tái hiện hình 1 ở quy mô nhỏ". | P2 | TB |
| F19 | **Video**: giữ nguyên kế hoạch mốc thời gian (hợp phát hiện video ngắn giữ chú ý tốt hơn — Guo, Kim & Rubin (2014), *L@S*, [doi:10.1145/2556325.2566239](https://dl.acm.org/doi/10.1145/2556325.2566239)); thêm 1 câu hỏi sau mỗi đoạn video được gợi ý. | P1 | Dễ |

---

## Phần E — Những thứ KHÔNG nên làm (hoặc chưa)

| Không làm | Lý do |
|---|---|
| Khoá cứng bài theo điểm | Kulik et al. (1990): mastery tự nhịp giảm tỉ lệ hoàn thành. Dùng gợi ý (F5b). |
| Bảng xếp hạng toàn nhóm | Không có bằng chứng mạnh cho người mới; nhóm nhỏ dễ tạo người "đứng bét" [ý kiến]. Báo cáo tuần (F13) cho cảm giác cùng học mà không so bì. |
| Cá nhân hoá theo "phong cách học" (nghe/nhìn/vận động) | Không được bằng chứng ủng hộ — Kirschner (2017), "Stop propagating the learning styles myth", *Computers & Education*. [doi:10.1016/j.compedu.2016.12.006](https://doi.org/10.1016/j.compedu.2016.12.006) |
| Trợ lý AI trả lời thẳng | Bastani et al. (2025): có thể làm giảm kết quả khi không còn AI. |
| Trích "2 sigma", "20–30% ít ôn hơn", "học xong 66 ngày thành thói quen" như sự thật chắc chắn | Xem ghi chú độ tin cậy ở A2, A8, B3 (66 ngày là *trung vị* với dao động 18–254). |

---

## Bảng xếp hạng tính năng: (giá trị cho người tự học) ÷ (công sức)

Giá trị 1–5 (theo độ mạnh bằng chứng × mức liên quan tới người mới tự học). Công sức 1–5 (1 = ≤1 buổi, 5 = cần backend/nhiều nội dung). Sắp theo tỉ số, cùng tỉ số thì ưu tiên P0.

| Hạng | # | Tính năng | Nguyên lý | Giá trị | Công sức | Tỉ số | Ưu tiên |
|---|---|---|---|---|---|---|---|
| 1 | F3 | Phản hồi ngay + mức tự tin + lưu kết quả từng câu | A1, A7 | 5 | 1 | **5,0** | P0 |
| 2 | F2 | Câu hỏi nhúng giữa bài MDX | A1 | 5 | 1 | **5,0** | P0 |
| 3 | F1a | `id` ổn định cho câu hỏi | (hạ tầng cho F1, F3, F5) | 4 | 1 | **4,0** | P0 |
| 4 | F8 | Ô "giải thích lại bằng lời của bạn" | A5 | 4 | 1 | **4,0** | P0 |
| 5 | F7 | Hàng ôn trộn nhiều khái niệm | A3 | 4 | 1 | **4,0** | P0 (đi kèm F1) |
| 6 | F11 | Kế hoạch học + file lịch `.ics` | B2 | 3 | 1 | **3,0** | P0 |
| 7 | F1b | Xuất/nhập tiến độ JSON | (bảo vệ dữ liệu) | 3 | 1 | **3,0** | P0 |
| 8 | F12 | Chuỗi mềm theo tuần, có nghỉ | B3 | 3 | 1 | **3,0** | P1 |
| 9 | F13 | Báo cáo tuần dán vào nhóm chat | B4 | 3 | 1 | **3,0** | P1 |
| 10 | F15b | Tiện ích kiểm tra gradient số | D2 | 3 | 1 | **3,0** | P1 |
| 11 | F1 | "Ôn hôm nay" với FSRS (`ts-fsrs`) | A2 | 5 | 2 | **2,5** | P0 |
| 12 | F4 | Viz "Đoán trước" rồi mới chạy | A6 | 5 | 2 | **2,5** | P0 |
| 13 | F5b | Gợi ý ôn tiền quyết khi vấp | A8, Math Academy | 4 | 2 | **2,0** | P1 |
| 14 | F5 | Trạng thái 4 mức + tô màu lộ trình | A8, Khan | 4 | 2 | **2,0** | P0 |
| 15 | F6c | Nút "đã biết → làm luôn" | A4 | 2 | 1 | **2,0** | P1 |
| 16 | F8b | Hỏi "vì sao?" sau đáp án | A5 | 2 | 1 | **2,0** | P1 |
| 17 | F10 | 2 câu đoán đầu bài | A6 | 2 | 1 | **2,0** | P1 |
| 18 | F13b | Xin nhận xét code qua GitHub | B4, Exercism | 2 | 1 | **2,0** | P1 |
| 19 | F15c | Câu hỏi đoán shape | D2 | 2 | 1 | **2,0** | P1 |
| 20 | F19 | Câu hỏi sau đoạn video | A1 | 2 | 1 | **2,0** | P1 |
| 21 | F6b | Parsons problem cho numpy | A4 | 4 | 3 | **1,3** | P1 |
| 22 | F6 | Thang mẫu → khuyết → tự viết | A4 | 4 | 3 | **1,3** | P1 |
| 23 | F1c | Ôn tập bài code ngắt quãng | A2, Execute Program | 4 | 3 | **1,3** | P1 |
| 24 | F7b | Bộ câu "phân biệt" khái niệm dễ nhầm | A3 | 3 | 3 | **1,0** | P1 |
| 25 | F14 | Dự án mồi đầu tầng | D1 | 3 | 3 | **1,0** | P1 |
| 26 | F9 | "Thử trước 5 phút" | A9 | 3 | 3 | **1,0** | P2 |
| 27 | F15 | Chuỗi dự án mini-micrograd | D2 | 4 | 4 | **1,0** | P1 |
| 28 | F2b | Dạng câu nhập biểu thức | A1 | 2 | 2 | **1,0** | P1 |
| 29 | F16 | Đọc paper có hướng dẫn | D3 | 2 | 3 | **0,7** | P2 |
| 30 | F18 | Gia sư AI có rào chắn | A10 | 4 | 5 | **0,8** | P2 |
| 31 | F13c | Tiến độ nhóm đồng bộ (Supabase) | B4 | 3 | 5 | **0,6** | P2 |
| 32 | F8c | AI nhận xét bài tự giải thích | A5, A10 | 2 | 4 | **0,5** | P2 |

**Thứ tự làm gợi ý**: F1a → F3 → F2 → F8 → F4 → F1 (+F7, F1b) → F5 → F11/F12. Nhóm này dùng lại `Quiz.tsx`, localStorage và frontmatter sẵn có, không cần backend, và bao phủ bốn nguyên lý mạnh nhất (truy xuất, ngắt quãng, tự giải thích, dự đoán). Sau đó đầu tư nội dung: F6/F6b và F15.

## Ghi chú về nguồn chưa kiểm được

- "FSRS giảm 20–30% số lượt ôn so với SM-2": không tìm thấy nguồn gốc có phương pháp; benchmark chính thức chỉ đo sai số dự đoán.
- Duolingo "0,38% DAU nhờ streak freeze", "600+ thí nghiệm về streak": chỉ thấy trên blog bên thứ ba.
- Yeomans & Reich (2017): con số tuyệt đối trước/sau của mức tăng 29% — trang ACM chặn truy cập, chỉ kiểm qua tóm tắt của MIT TSL.
- "Kỹ thuật Feynman": không có nguồn học thuật gốc cho quy trình mang tên này.
- Top-down vs bottom-up, implement-from-scratch, cách đọc paper cho người mới trong ML: không tìm thấy nghiên cứu có đối chứng; phần D dựa trên bằng chứng gián tiếp và ý kiến chuyên gia.
