# 05 — Hướng nghiên cứu dịch máy: bản khảo sát để tự định hướng (soạn 2026-09-18)

Bản này **nối tiếp** `04-dich-may.md` (tóm tắt nền tảng: kiến trúc, dữ liệu, ít tài nguyên, metric).
Ở đây không nhắc lại phần nền, mà trả lời câu hỏi khác: **hiện nay người ta đang nghiên cứu cái gì, còn hở chỗ nào, và một người tự học với GPU miễn phí có thể thật sự thử cái gì.**

Trọng tâm: **dịch máy · ngôn ngữ ít tài nguyên · tiếng Việt**.

## 0. Quy ước xác minh của bản này

- Mọi con số, mọi tên bài báo, mọi kết quả bảng xếp hạng trong file này đều được lấy bằng cách **mở nguồn gốc và đọc** (PDF trên ACL Anthology, abstract trên arXiv, API của Hugging Face), không lấy từ đoạn trích công cụ tìm kiếm.
- Khi trích số từ bài báo, có ghi số đó nằm ở **bảng/mục nào**.
- Chỗ nào không kiểm được thì ghi thẳng **"chưa xác minh"**. Danh sách đầy đủ ở §7.
- Mọi liên kết đã kiểm sống ngày 2026-09-18 (`curl -sI -L`, mã 200). Bảng đầy đủ ở §6.
- Cụm "hiện nay" trong file này nghĩa là **tính đến 2026-09-18**, và bằng chứng mới nhất mà tôi đọc được là kỷ yếu **WMT25** (tháng 11/2025) cùng vài preprint arXiv 2026. Từ đó đến nay còn một khoảng trống mà tôi không phủ được.

---

## 1. Bức tranh hiện tại của nghiên cứu dịch máy (2023 → 2026)

### 1.1 LLM đa ngữ đã vượt mô hình dịch chuyên dụng ở phần lớn cặp được đánh giá

Cột mốc rõ nhất là hai kỳ WMT gần nhất.

**WMT24** (tháng 11/2024) đặt tựa cho báo cáo tổng kết là *"The LLM Era Is Here but MT Is Not Solved Yet"* — LLM đã tới, nhưng dịch máy chưa xong ([2024.wmt-1.1](https://aclanthology.org/2024.wmt-1.1/)). 11 cặp ngôn ngữ, ban tổ chức tự thu thêm bản dịch từ 8 LLM và 4 nhà cung cấp dịch trực tuyến, đánh giá người bằng giao thức **ESA** (Error Span Annotation) mới.

**WMT25** (tháng 11/2025) đặt tựa mạnh hơn: *"Time to Stop Evaluating on Easy Test Sets"* — đã đến lúc thôi đánh giá trên tập test dễ ([2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/), tôi đã đọc bản PDF). Các con số dưới đây lấy từ phần Abstract, mục *Findings of the General MT Task* và mục 7.2 của bài đó:

- Mời làm **30 cặp ngôn ngữ**; đánh giá người trên **một nửa** số đó. Tổng cộng **60 hệ thống** được đánh giá: 36 do người tham gia nộp + 24 do ban tổ chức thu từ LLM và dịch vụ dịch trực tuyến.
- **16 cặp** có đánh giá người. Dùng ESA, trừ English→Korean và Japanese→Chinese dùng **MQM**.
- Thêm một **nhánh đa ngữ phụ, chỉ đánh giá tự động**, gồm 15 cặp nữa — **trong đó có English→Vietnamese** (xem §3).
- Nguồn là **cả tài liệu** (nhiều đoạn), không cắt câu sẵn: xu hướng chuyển sang dịch cấp tài liệu đang tăng đều.
- Có cả **âm thanh và ảnh**: miền speech đưa file audio + bản ASR; miền social đưa ảnh chụp bài đăng.
- **Hệ tốt nhất toàn cuộc theo đánh giá người là Gemini 2.5 Pro**, nằm trong cụm dẫn đầu ở **14/16** cặp, và **ngang bằng hoặc vượt bản dịch của người ở 10 trong số đó** (mục 7.2).
- **Hệ constrained (chỉ dùng dữ liệu cho phép) tốt nhất là Shy-hunyuan-MT**, thắng cụm ở 11 cặp trong hạng mục của nó; kế đó là Algharb với 6 cặp.

### 1.2 Bản dịch của người không còn là trần

Phát hiện gây nhiều tranh luận nhất của WMT25: **bản dịch của người chỉ nằm trong cụm dẫn đầu ở 6 trên 15 cặp** có bản người (mục 7.2). Bài báo tự đặt hai cách giải thích và không chọn hẳn cái nào: hoặc dịch thật sự là việc khó, hoặc đó phản ánh **thiên lệch về văn phong và từ vựng của người chấm**. Đây đúng là một câu hỏi nghiên cứu để ngỏ, không phải một kết luận đã chốt.

### 1.3 Đánh giá: đã rời BLEU, nhưng 2025 lại có một cú lật bất ngờ

Chuỗi sự kiện đáng theo dõi, vì nó dạy đúng bài học "đừng tin một con số":

**WMT24 Metrics** ([2024.wmt-1.2](https://aclanthology.org/2024.wmt-1.2/), tựa *"Are LLMs Breaking MT Metrics?"*) — 3 cặp, đều ở cấp đoạn văn: en→de, en→es (Mỹ Latin), ja→zh. Bảng 1 (điểm là **trung bình có trọng số của tương quan trên 6 tác vụ con**) xếp: MetaMetrics-MT 0,725 (hạng 1), MetricX-24-Hybrid 0,721 (hạng 1), XCOMET 0,719 (hạng 1) … còn YiSi-1 hạng 6 (0,630), BERTScore hạng 7 (0,617), chrF hạng 8 (0,608), spBLEU hạng 9 (0,593), BLEU hạng 9 (0,589). Kết luận của ban tổ chức: metric nơ-ron tinh chỉnh **vẫn tốt**, kể cả khi chấm bản dịch do LLM sinh.

**WMT25** gộp Metrics và QE thành một task duy nhất ([2025.wmt-1.24](https://aclanthology.org/2025.wmt-1.24/), tựa *"Linguistic Diversity is Challenging and References Still Help"*, tôi đã đọc bản PDF), 3 tác vụ con: (1) dự đoán điểm ở mức đoạn, (2) khoanh vùng lỗi, (3) sửa lỗi có thông tin chất lượng. Kết quả lật ngược:

> Ở **mức hệ thống**, LLM-as-a-judge cỡ lớn dẫn đầu. Nhưng ở **mức đoạn**, các metric **tham chiếu cơ bản** lại lấp đầy ba cụm hạng đầu.

Bảng 4 của bài (trung bình 14 cặp ngôn ngữ **có** bản tham chiếu), cột *Avg Seg*: **YiSi-1 hạng 1 (0,593), chrF hạng 2 (0,588), spBLEU hạng 3 (0,585), BERTScore hạng 3 (0,585), BLEU hạng 4 (0,576), COMET22 hạng 5 (0,574)**, MetricX-25 hạng 7 (0,565). Chỉ Gemini 2.5 Pro (hạng 1, 0,593) và TASER-Ref (hạng 2, 0,589) là sánh được hoặc vượt.

**Hai lưu ý bắt buộc phải kèm theo con số này:**

1. **Bài báo tự mâu thuẫn nhẹ ở danh sách metric.** Gạch đầu dòng tóm tắt (trang 415) viết "reference-based baseline metrics (**YiSi-1, chrF, và BERTScore**) fill out the top three rank clusters", còn mục 4.3 viết "**YiSi-1, chrF, spBLEU, và BERTScore**". Bảng 4 khớp với mục 4.3 (spBLEU hạng 3 ở cột đoạn). Gạch đầu dòng tóm tắt đã bỏ sót spBLEU.
2. **Chính tác giả gọi đây là "surprising result" và nói "further analysis is needed".** Họ nêu các nguyên nhân có thể: nguồn được **cố ý chọn cho khó**, đoạn **dài kiểu paragraph** chứ không phải câu, **ít đoạn hơn** cho mỗi cặp, và **đa dạng cặp ngôn ngữ rộng hơn** trước.

Nên đọc chuỗi này thế nào: **không phải "BLEU sống lại"**. Nó là bằng chứng rằng bảng xếp hạng metric **phụ thuộc nặng vào tập test và độ dài đơn vị chấm** — và đó chính là một hướng nghiên cứu mở (§2.2).

### 1.4 Metric bị gaming: bằng chứng cụ thể nhất từ trước tới nay

Đây là kết quả tôi cho là quan trọng nhất của WMT25 với người tự học, vì nó dạy một thói quen chứ không chỉ một con số.

Theo **AUTORANK** (xếp hạng tự động), **Shy-hunyuan-MT đứng nhất ở mọi cặp trừ một** (English→Bhojpuri). Nhưng đánh giá người xếp nó **thấp hơn hẳn**. Bài báo nêu nguyên nhân khả dĩ ngay tại mục 7.2: hệ này **huấn luyện bằng GRPO với tín hiệu thưởng là XCOMET-XXL và GEMBA (dùng DeepSeek V3)** — tức là nó được tối ưu thẳng vào chính họ metric dùng để chấm nó.

Ví dụ cụ thể, bảng kết quả English→Egyptian Arabic ở mục 7.4:

| Hệ | Điểm người | AutoRank |
|---|---|---|
| Human (bản người) | 78,5 | — |
| GPT-4.1 | 77,0 | 6,7 |
| Gemini-2.5-Pro | 60,6 | 5,8 |
| **Shy-hunyuan-MT** | **3,2** (hạng 11–16) | **1,0** (tốt nhất) |

Một hệ đứng đầu tuyệt đối theo máy chấm, gần đội sổ theo người chấm, **trên cùng một tập test**. Nếu bạn chỉ đọc bảng tự động, bạn sẽ kết luận sai hoàn toàn.

*(Lưu ý cho người đọc `04-dich-may.md`: file đó ghi "Gemini 2.5 Pro thắng ở 14 cặp" — tôi đã kiểm lại PDF gốc, con số đó **đúng**, và là con số của **đánh giá người**. Còn xếp hạng tự động sơ bộ lại ra kết quả khác hẳn.)*

### 1.5 Nhiễm dữ liệu test (test-set contamination)

Đây không còn là mối lo lý thuyết.

- **Có đo lường có kiểm soát:** [arXiv 2501.18771](https://arxiv.org/abs/2501.18771) huấn luyện mô hình 1B và 8B trên tập đã tách sạch, rồi **cố ý tiêm** dữ liệu test vào ở nhiều giai đoạn/tỉ lệ/định dạng. Theo Abstract: nhiễm **cả nguồn lẫn đích** làm **thổi phồng BLEU đáng kể**, và mức thổi phồng **lớn hơn 2,5 lần ở mô hình 8B so với 1B, lên tới 30 điểm BLEU**. Nhiễm chỉ-nguồn hoặc chỉ-đích gây thổi phồng nhỏ hơn và kém nhất quán.
- **Đã bắt được ngoài đời:** [arXiv 2404.13813](https://arxiv.org/abs/2404.13813) ghi nhận bằng chứng nhiễm dữ liệu của Claude 3 Opus trên **FLORES-200**, và vì thế nhóm tác giả **tự dựng benchmark mới** để kiểm chứng lại kết luận của mình.
- **WMT phản ứng bằng thiết kế:** WMT25 thu **nguồn mới nhất có thể**, và quan trọng hơn, **luôn để văn bản gốc được viết bằng chính ngôn ngữ nguồn** rồi mới thuê người dịch sang đích — để tránh "translationese" ở phía nguồn (mục 2.1 của [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/)).
- **Và bằng độ khó:** WMT25 giới thiệu **difficulty sampling** — ước lượng độ khó dịch của từng tài liệu bằng `sentinel-src-25` (mô hình hồi quy trên XLM-RoBERTa Large, chỉ nhìn văn bản **nguồn**), rồi giữ lại các tài liệu khó nhất (mục 2.1.1).

**Hệ quả thực dụng cho bạn:** bất kỳ điểm số nào của một LLM thương mại trên FLORES, WMT cũ, hay IWSLT cũ đều **phải bị nghi ngờ** — những tập đó nằm trên web từ lâu. Điểm đó không sai, nó chỉ **không đo được cái bạn tưởng nó đo**.

### 1.6 Ba con số để nhớ toàn cảnh

| Câu hỏi | Trả lời có nguồn (2025–2026) |
|---|---|
| LLM hay NMT chuyên dụng mạnh hơn? | LLM, ở cặp được đánh giá: Gemini 2.5 Pro dẫn đầu 14/16 cặp WMT25 theo người chấm |
| Metric học máy có đáng tin? | Ở mức hệ thống thì có; ở mức đoạn của WMT25 thì **thua cả chrF** — và có thể bị tối ưu ngược |
| Bản dịch người có phải trần? | Không: chỉ vào cụm dẫn đầu ở 6/15 cặp WMT25 |

---

## 2. Các hướng nghiên cứu đang mở

Mỗi mục có bốn phần: **vì sao còn mở · ai đang làm · bài mốc · một câu hỏi bạn thật sự thử được trên Colab miễn phí**.

Quy ước cho phần "câu hỏi thử được": mọi đề xuất dưới đây chỉ dùng mô hình ≤ 1B tham số hoặc LoRA trên mô hình ≤ 8B, tập test ≤ 1.000 câu, và một phiên chạy đo bằng giờ chứ không phải ngày. Nếu một ý tưởng không thoả được các ràng buộc đó thì nó không nằm trong danh sách này.

---

### 2.1 Dịch cho ngôn ngữ ít tài nguyên

#### (a) Chuyển giao đa ngữ

**Vì sao còn mở.** Mô hình đa ngữ vừa **chia sẻ kiến thức** (tốt cho ngôn ngữ nghèo) vừa **nhiễu lẫn nhau** (negative interference). Không ai có công thức chung cho việc chia dung lượng mô hình giữa các ngôn ngữ. NLLB-200 đã chứng minh có thể phủ 200 ngôn ngữ, nhưng khoảng cách chất lượng giữa nhóm giàu và nhóm nghèo vẫn còn nguyên ([arXiv 2207.04672](https://arxiv.org/abs/2207.04672)).

**Ai đang làm.** Meta AI / nhóm NLLB & SeamlessM4T; Google (MADLAD-400); các nhóm châu Âu (Tower/Unbabel, EuroLLM); giới học thuật (University of Amsterdam, Edinburgh, Zurich, ETH); các sáng kiến cộng đồng như **OLDI** — Open Language Data Initiative ([2025.wmt-1.26](https://aclanthology.org/2025.wmt-1.26/)).

**Bài mốc.**
- NLLB-200, [arXiv 2207.04672](https://arxiv.org/abs/2207.04672) — 200 ngôn ngữ, cùng bộ FLORES-200.
- MADLAD-400, [arXiv 2309.04662](https://arxiv.org/abs/2309.04662) — corpus đơn ngữ 3T token / 419 ngôn ngữ **được người kiểm tra tay** (self-audit), cộng mô hình dịch 10,7B phủ >450 ngôn ngữ.
- Neuron Specialization, [arXiv 2404.11201](https://arxiv.org/abs/2404.11201) — nơ-ron trong lớp feed-forward kích hoạt theo kiểu **riêng cho từng ngôn ngữ**, và độ chồng lấn giữa chúng phản ánh **độ gần gũi ngôn ngữ**.
- SMOL, [2025.wmt-1.85](https://aclanthology.org/2025.wmt-1.85/) — dữ liệu song ngữ **do người dịch chuyên nghiệp** cho 115 ngôn ngữ ít đại diện.

**Câu hỏi nhỏ thử được trên Colab.**
> **Ngôn ngữ trung gian nào giúp được tiếng Việt?** Lấy `facebook/nllb-200-distilled-600M`. Chọn một cặp đích nghèo dữ liệu (ví dụ Việt↔một ngôn ngữ Đông Nam Á trong FLORES+). Fine-tune LoRA ba lần với **cùng số bước, cùng seed, cùng learning rate**: (1) chỉ dữ liệu cặp đích, (2) cặp đích + một ngôn ngữ **cùng họ/cùng vùng**, (3) cặp đích + một ngôn ngữ **xa hẳn** với đúng bằng ấy câu. Đo chrF + COMET trên FLORES+ devtest.
> **Biến kiểm soát bắt buộc:** tổng số câu huấn luyện phải bằng nhau ở cả ba nhánh — nếu không bạn chỉ đang đo "thêm dữ liệu thì tốt hơn", một kết luận vô nghĩa.

#### (b) Back-translation

**Vì sao còn mở.** Back-translation là kỹ thuật 2016 nhưng **chưa ai trả lời gọn** câu hỏi: ở mức dữ liệu nào thì nó hết tác dụng, và khi nào dữ liệu tổng hợp từ LLM thay thế được nó. Edunov et al. đã chỉ ra cách **sinh** câu nguồn giả quan trọng hơn người ta tưởng — **lấy mẫu (sampling) hoặc beam có nhiễu** tốt hơn beam sạch, trừ trường hợp cực nghèo tài nguyên ([arXiv 1808.09381](https://arxiv.org/abs/1808.09381)).

**Bài mốc.** Sennrich et al., [P16-1009](https://aclanthology.org/P16-1009/) (bản gốc); Edunov et al., [arXiv 1808.09381](https://arxiv.org/abs/1808.09381) (ở quy mô lớn).

**Câu hỏi nhỏ thử được trên Colab.**
> **Sampling hay beam, ở quy mô nhỏ thì cái nào thắng?** Kết luận của Edunov et al. được rút ra ở quy mô hàng trăm triệu câu. Ở quy mô 20k–50k câu thì sao? Lấy 20k cặp Anh–Việt sạch, huấn luyện mô hình Việt→Anh tạm, dùng nó back-translate 20k câu tiếng Anh đơn ngữ theo **ba cách**: greedy, beam-5, và sampling (top-k). Trộn vào tập gốc, fine-tune lại mô hình Anh→Việt cho mỗi cách, đo chrF + COMET.
> **Cạm bẫy phải tránh:** câu đơn ngữ tiếng Anh dùng để back-translate **không được trùng** với bất cứ câu nào trong tập dev/test. Kiểm bằng khớp chuỗi đã chuẩn hoá trước khi chạy.

#### (c) Dữ liệu tổng hợp từ LLM, và chưng cất về NMT

**Vì sao còn mở.** Hướng này mới, và đang có kết quả tốt đến mức đáng ngờ — nên rất cần người lặp lại. Ý tưởng: LLM lớn dịch giỏi nhưng đắt; dùng nó **sinh dữ liệu**, rồi chưng cất vào một mô hình NMT nhỏ chạy được offline.

**Bài mốc.**
- [arXiv 2404.13813](https://arxiv.org/abs/2404.13813) — dùng Claude 3 Opus sinh dữ liệu tổng hợp, chưng cất, và theo Abstract thì **đạt hoặc vượt NLLB-54B và Google Translate ở cặp Yoruba–Anh**. Bài này cũng thẳng thắn báo cáo **bằng chứng nhiễm FLORES-200** ở Claude và vì thế tự dựng benchmark mới.
- Sequence-Level Knowledge Distillation, [D16-1139](https://aclanthology.org/D16-1139/) — nền lý thuyết của chưng cất cho mô hình sinh chuỗi.
- MTOB, [arXiv 2309.16575](https://arxiv.org/abs/2309.16575) — cực đoan hoá bài toán: học dịch tiếng Kalamang (dưới 200 người nói) **từ một cuốn sách ngữ pháp**. Baseline LLM đạt **44,7 chrF** (Kalamang→Anh) và **45,8 chrF** (Anh→Kalamang), so với **51,6 / 57,0 chrF** của một người học Kalamang từ chính tài liệu đó.
- VietMix, [arXiv 2505.24472](https://arxiv.org/abs/2505.24472) (EACL 2026) — pipeline tăng cường dữ liệu cho Việt–Anh trộn mã, báo cáo **+3,5 điểm xCOMET so với baseline back-translation mạnh** và **+11,9 điểm** cho mô hình zero-shot.

**Câu hỏi nhỏ thử được trên Colab.**
> **Dữ liệu LLM tổng hợp có hơn back-translation khi cùng ngân sách câu không?** Cố định 10k câu tiếng Việt đơn ngữ. Nhánh A: back-translate bằng mô hình nhỏ của chính bạn. Nhánh B: dịch bằng một LLM miễn phí qua API, lấy đúng 10k cặp. Fine-tune cùng một `nllb-200-distilled-600M` bằng LoRA, **cùng số bước, cùng seed**. So chrF + COMET, và **đọc tay 50 câu** của mỗi nhánh.
> **Cạm bẫy:** nếu LLM đó đã thấy tập test của bạn thì nhánh B thắng vì lý do sai. Dùng tập test **bạn tự tạo từ văn bản mới** (xem §4), đừng dùng FLORES.

---

### 2.2 Đánh giá dịch máy

**Vì sao còn mở.** Ba lý do độc lập, cái nào cũng đủ để làm luận văn:

1. **Metric học máy có điểm mù hệ thống.** Amrhein & Sennrich dùng giải mã MBR dựa trên lấy mẫu để "moi" ra điểm yếu của COMET, và tìm thấy: **COMET không đủ nhạy với sai lệch về con số và tên riêng** ở en–de và de–en; và các thiên lệch đó **khó gỡ chỉ bằng cách huấn luyện thêm dữ liệu tổng hợp** ([2022.aacl-main.83](https://aclanthology.org/2022.aacl-main.83/)). Bộ ACES ([2022.wmt-1.44](https://aclanthology.org/2022.wmt-1.44/)) hệ thống hoá thành **68 hiện tượng** thử metric.
2. **Metric bị tối ưu ngược.** Đã có bằng chứng ngoài đời ở WMT25 (§1.4).
3. **Bảng xếp hạng metric không ổn định qua các năm.** So §1.3: giữa WMT24 và WMT25, thứ hạng tương đối của chrF và của metric nơ-ron **đảo chiều ở mức đoạn**, và ban tổ chức WMT25 tự nói cần phân tích thêm.

Thêm một vấn đề riêng cho ngôn ngữ ít tài nguyên: **metric học máy được huấn luyện chủ yếu trên điểm người chấm của cặp giàu tài nguyên.** AfriCOMET ([arXiv 2311.09828](https://arxiv.org/abs/2311.09828)) ra đời chính vì thế — họ phải **tự thu dữ liệu chấm người với hướng dẫn MQM đơn giản hoá** cho các ngôn ngữ châu Phi trước, rồi mới huấn luyện được metric dùng được.

**Ai đang làm.** Unbabel + Instituto Superior Técnico (COMET, xCOMET, CometKiwi); Google Research (MetricX, BLEURT, mt-metrics-eval); NRC Canada (YiSi); DFKI; Tilburg; UCL + Masakhane (AfriCOMET); ETH Zurich.

**Bài mốc.**
- COMET, [2020.emnlp-main.213](https://aclanthology.org/2020.emnlp-main.213/) — bài gốc.
- CometKiwi, [2022.wmt-1.60](https://aclanthology.org/2022.wmt-1.60/) — QE không cần tham chiếu.
- MetricX-24, [2024.wmt-1.35](https://aclanthology.org/2024.wmt-1.35/).
- Findings WMT24 Metrics, [2024.wmt-1.2](https://aclanthology.org/2024.wmt-1.2/).
- Findings WMT25 Evaluation, [2025.wmt-1.24](https://aclanthology.org/2025.wmt-1.24/).
- MSLC24, [2024.wmt-1.34](https://aclanthology.org/2024.wmt-1.34/) — thử metric trên **dải chất lượng rộng**, kể cả bản dịch rất tệ.

**Về đánh giá không cần bản tham chiếu (QE).** Đây là hướng thực dụng nhất cho tiếng Việt và cho ngôn ngữ nghèo, vì làm bản tham chiếu tốn tiền nhất. Nhưng WMT25 có một cảnh báo thẳng trong tựa bài: **"References Still Help"** — bỏ tham chiếu vẫn mất mát. Và WMT25 dùng `sentinel-src` làm **mô hình đối chứng**: nó chỉ nhìn nguồn, nên nếu một metric QE không hơn được nó thì metric đó chưa thực sự "đọc" bản dịch. Trong Bảng 4, `sentinel-src` xếp hạng 29 với 0,336 — đúng như ban tổ chức mong đợi ("rank lowly throughout").

**Câu hỏi nhỏ thử được trên Colab.**
> **COMET có phát hiện được sai số và sai tên riêng trong tiếng Việt không?** Lấy 300 cặp Anh–Việt đúng. Tạo ba phiên bản hỏng có kiểm soát: (1) đổi một **con số** trong câu đích, (2) đổi một **tên riêng**, (3) đổi một **từ ngẫu nhiên không mang thông tin**. Chấm cả bốn phiên bản bằng `Unbabel/wmt22-comet-da` và chrF. Nếu metric tụt điểm ở (3) nhiều hơn ở (1) và (2), bạn đã tái hiện được phát hiện của Amrhein & Sennrich **trên tiếng Việt** — một kết quả nhỏ nhưng thật, và **chưa ai công bố** theo tìm kiếm của tôi (§7).
> **Vì sao đây là thí nghiệm tốt:** nó có giả thuyết rõ, có nhóm đối chứng, chạy trong một buổi, và **kết quả nào cũng có ý nghĩa** — kể cả khi COMET tỏ ra ổn.

---

### 2.3 Dịch theo ngữ cảnh dài hơn câu

**Vì sao còn mở.** Cả ba tầng đều chưa xong:

- **Mô hình:** WMT đang dịch chuyển sang cấp tài liệu, và WMT25 **cấp nguyên tài liệu làm nguồn, không cắt câu sẵn** — người tham gia tự chọn chiến lược (mục 1 của [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/)).
- **Dữ liệu:** DocHPLT ([2025.wmt-1.17](https://aclanthology.org/2025.wmt-1.17/)) mới xuất hiện để lấp chỗ thiếu corpus song ngữ **cấp tài liệu** đa ngữ.
- **Đánh giá:** đây là chỗ hở to nhất. Bài [2025.wmt-1.5](https://aclanthology.org/2025.wmt-1.5/) (*"Context is Ubiquitous, but Rarely Changes Judgments"*) lập luận rằng **ngữ cảnh có mặt trong mọi câu**, nên các ước lượng kiểu "n% câu cần ngữ cảnh" có thể chỉ là **hiện vật của phương pháp đo**; đồng thời **không phải ngữ cảnh nào cũng làm người chấm đổi ý**.

**Ai đang làm.** Nhóm WMT; Karpinska & Iyyer (UMass, nay Microsoft); nhóm HPLT (châu Âu); các nhóm dịch văn học.

**Bài mốc.**
- Karpinska & Iyyer, [arXiv 2304.03245](https://arxiv.org/abs/2304.03245) — cho LLM dịch **cả đoạn văn học một lần** tốt hơn dịch từng câu, trên 18 cặp ngôn ngữ, qua đánh giá người **tốn khoảng 350 giờ công**; nhưng **lỗi nghiêm trọng vẫn còn**.
- Voita et al., [P19-1116](https://aclanthology.org/P19-1116/) — kinh điển: ngữ cảnh cải thiện **deixis, tỉnh lược, liên kết từ vựng**.
- [2025.wmt-1.5](https://aclanthology.org/2025.wmt-1.5/) — H-FALCON, và phê bình phương pháp đo.
- [2025.wmt-1.13](https://aclanthology.org/2025.wmt-1.13/) — *Self-Retrieval from Distant Contexts for Document-Level Machine Translation* (cùng kỷ yếu WMT25).

**Câu hỏi nhỏ thử được trên Colab.**
> **Dịch cả đoạn có hơn dịch từng câu với tiếng Việt không, và hơn ở chỗ nào?** Lấy 30 đoạn tiếng Anh (mỗi đoạn 5–10 câu) từ nguồn mới, có bản dịch người. Dịch theo hai chế độ bằng cùng một mô hình: (A) từng câu rời, (B) cả đoạn một lần. Chấm chrF/COMET **ở mức câu sau khi căn chỉnh lại**, rồi **tự tay phân loại** khác biệt theo bốn nhãn: đại từ/xưng hô, thì và thể, nhất quán thuật ngữ, khác. Tiếng Việt đặc biệt đáng thử vì **hệ thống xưng hô** phụ thuộc ngữ cảnh mạnh hơn tiếng Anh nhiều.
> **Cạm bẫy:** chế độ B có thể sinh **thừa hoặc thiếu câu**, làm hỏng việc căn chỉnh. Phải đếm câu và loại bỏ những đoạn lệch trước khi so, và **báo cáo bạn đã loại bao nhiêu**.

---

### 2.4 Thuật ngữ và kiểm soát đầu ra

**Vì sao còn mở.** Đây là hướng có **giá trị thương mại cao nhất mà nghiên cứu lại ít quan tâm nhất**. Ban tổ chức WMT25 Terminology nhận xét thẳng: ở WMT 2024 **chỉ có hai bài** dành cho dịch thuật ngữ ([2025.wmt-1.30](https://aclanthology.org/2025.wmt-1.30/), mục 1).

Kết quả WMT25 Terminology (tôi đã đọc PDF, Abstract + mục 9 Conclusions):

- Hai nhánh: **mức câu, miền CNTT** (En→De, En→Ru, En→Es) và **mức tài liệu, miền tài chính** (En↔Trung phồn thể, có từ điển **một-nhiều cấp tài liệu**).
- Ba chế độ suy luận để làm **phân tích nhân quả**: không từ điển / từ điển đúng / **từ điển ngẫu nhiên**. Thiết kế này rất đáng học — nhánh "từ điển ngẫu nhiên" chính là **nhóm giả dược**.
- 13 nhóm / 20 hệ ở Track 1, 4 nhóm ở Track 2; tổng cộng **hơn 20 lượt nộp, gấp ba lần kỳ trước**.
- Kết quả: **cấp từ điển đúng luôn cải thiện cả chất lượng chung lẫn độ chính xác thuật ngữ**; từ điển ngẫu nhiên cải thiện ít hơn. **Hệ tốt hơn hưởng lợi nhiều hơn từ từ điển đúng** — đúng như tựa bài.
- Nhánh câu **gần bão hoà** (độ chính xác thuật ngữ gần như hoàn hảo), nhánh **tài liệu vẫn còn xa**.
- Quan trọng cho người thiết kế thí nghiệm: **các metric thuật ngữ tương quan cao với nhau nhưng không tương quan với chất lượng chung** → phải giữ **ít nhất một metric riêng cho thuật ngữ**, chất lượng chung không thay được nó.

**Ai đang làm.** University of Zurich, Nanjing University, ETH Zurich, Amazon AGI, University of Edinburgh (nhóm tổ chức WMT25 Terminology); các hãng dịch thuật (Phrase, Unbabel, SYSTRAN, AppTek).

**Bài mốc.** Dinu et al., [P19-1294](https://aclanthology.org/P19-1294/) (huấn luyện NMT tuân ràng buộc thuật ngữ); [2025.wmt-1.30](https://aclanthology.org/2025.wmt-1.30/) (kỳ gần nhất).

**Câu hỏi nhỏ thử được trên Colab.**
> **Đưa từ điển vào prompt giúp được bao nhiêu cho thuật ngữ y khoa Anh–Việt, và có thật là nhờ từ điển không?** Lấy 200 câu y khoa Anh–Việt. Chạy ba chế độ **y hệt thiết kế WMT25**: không từ điển, **từ điển đúng**, **từ điển ngẫu nhiên** (thuật ngữ lấy từ câu khác). Đo ba thứ riêng biệt: chrF/COMET (chất lượng chung), **tỉ lệ khớp thuật ngữ** (so khớp sau khi chuẩn hoá chữ hoa/thường), và **tính nhất quán** (cùng một thuật ngữ nguồn có ra cùng một thuật ngữ đích trong toàn tập không).
> **Vì sao nhánh ngẫu nhiên là bắt buộc:** nếu chất lượng tăng cả ở nhánh ngẫu nhiên, thì cái giúp bạn không phải là **nội dung** từ điển mà là **việc prompt dài hơn / có thêm ngữ cảnh**. Không có nhánh này thì kết luận không đứng được.

---

### 2.5 Dịch nói và đa phương thức

**Vì sao còn mở.** WMT25 phát hiện **miền speech là miền khó nhất** trong cả sáu miền, và nêu nguyên nhân khả dĩ là **lỗi ASR** truyền xuống ([2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/), mục *Findings*). Nghĩa là bài toán "cascaded hay end-to-end" vẫn chưa ngã ngũ sau gần một thập kỷ.

**Ai đang làm.** Cộng đồng **IWSLT** là trung tâm — kỳ 2025 có **7 shared task** và **32 nhóm** tham gia, gồm: dịch offline, dịch đồng thời, phụ đề, **nén mô hình**, dịch tiếng-sang-tiếng, phương ngữ & ngôn ngữ ít tài nguyên, và ngôn ngữ Ấn Độ ([2025.iwslt-1.44](https://aclanthology.org/2025.iwslt-1.44/)). Ngoài ra: Meta (SeamlessM4T), OpenAI (Whisper), FBK, KIT, CMU, JHU, NAIST, AppTek.

**Bài mốc.**
- Whisper, [arXiv 2212.04356](https://arxiv.org/abs/2212.04356) — 680.000 giờ giám sát yếu, đa ngôn ngữ, zero-shot.
- SeamlessM4T, [arXiv 2308.11596](https://arxiv.org/abs/2308.11596) — một mô hình cho S2ST/S2TT/T2TT/ASR tới 100 ngôn ngữ, dựng trên 1 triệu giờ tiếng nói mở.
- Findings IWSLT 2025, [2025.iwslt-1.44](https://aclanthology.org/2025.iwslt-1.44/).
- Dịch đa phương thức **không cần ảnh lúc suy luận**: GIIFT, [2025.wmt-1.6](https://aclanthology.org/2025.wmt-1.6/).
- Cho tiếng Việt: PhoST, [arXiv 2208.04243](https://arxiv.org/abs/2208.04243) — xem §3.

**Câu hỏi nhỏ thử được trên Colab.**
> **Lỗi ASR gây thiệt hại bao nhiêu điểm dịch, và loại lỗi nào đau nhất?** Lấy 200 câu tiếng Anh có audio và bản chép tay chuẩn. Dịch sang tiếng Việt hai lần: từ **bản chép tay đúng** và từ **bản ASR của Whisper**. Hiệu số chrF/COMET giữa hai lần chính là **thiệt hại do ASR**. Rồi phân tích: thiệt hại có tập trung vào câu chứa **tên riêng và con số** không?
> **Biến kiểm soát:** mô hình dịch, prompt, seed, độ dài đều phải giống hệt — khác biệt duy nhất là văn bản đầu vào.

---

### 2.6 Hiệu quả tính toán: chưng cất, lượng tử hoá, LoRA

**Vì sao còn mở.** Đây là hướng **thân thiện nhất với người ít tài nguyên tính toán**, vì kết quả có ý nghĩa ngay cả khi mô hình nhỏ. WMT25 lần đầu mở **shared task Model Compression** — và đó là dấu hiệu rõ rằng cộng đồng coi đây là câu hỏi mở, không phải kỹ thuật đã xong.

Chi tiết kỳ đầu ([2025.wmt-1.25](https://aclanthology.org/2025.wmt-1.25/), tôi đã đọc PDF, Abstract):
- Nhánh **constrained**: bắt buộc nén **Aya Expanse 8B**, đánh giá trên cs→de, ja→zh, en→ar.
- Nhánh **unconstrained**: mô hình nào cũng được, 15 hướng dịch của General MT task.
- Nhận **12 lượt nộp từ 3 nhóm — tất cả đều ở nhánh constrained**. Con số nhỏ này tự nó là thông tin: **sân này còn rất trống**.
- Đánh giá bốn chiều: **COMET, MetricX, kích thước mô hình, tốc độ suy luận trên một GPU Nvidia A100**.

IWSLT 2025 cũng có nhánh model compression tương ứng cho dịch nói ([2025.iwslt-1.44](https://aclanthology.org/2025.iwslt-1.44/)).

**Bài mốc.** LoRA, [arXiv 2106.09685](https://arxiv.org/abs/2106.09685); QLoRA, [arXiv 2305.14314](https://arxiv.org/abs/2305.14314) (tinh chỉnh mô hình 65B trên **một GPU 48GB**, nền tảng của mọi thí nghiệm Colab nghiêm túc); Sequence-Level KD, [D16-1139](https://aclanthology.org/D16-1139/); Findings WMT25 Model Compression, [2025.wmt-1.25](https://aclanthology.org/2025.wmt-1.25/).

**Câu hỏi nhỏ thử được trên Colab.**
> **Lượng tử hoá 4-bit làm mất bao nhiêu chất lượng dịch tiếng Việt — và mất ở đâu?** Lấy một mô hình dịch cỡ vừa. Chạy cùng một tập test 500 câu ở **fp16** và ở **4-bit**. Báo cáo **bốn** con số như WMT25 làm: chrF, COMET, **dung lượng đĩa**, **giây/câu**. Rồi tìm: phần mất mát tập trung ở câu dài, ở tên riêng, hay ở thuật ngữ?
> **Đây là dạng nghiên cứu lý tưởng cho một người:** biến độc lập rõ ràng (độ chính xác số học), không cần huấn luyện, chạy được trong vài giờ, và **không ai có thể cãi kết quả** nếu bạn ghi đủ cấu hình.

---

### 2.7 An toàn và thiên lệch trong dịch

#### (a) Giới tính

**Vì sao còn mở.** Vẫn chưa giải quyết được sau 7 năm, và WMT25 xác nhận lại. Tổng kết mục 8.4 của [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/) ghi rằng các hệ SOTA vẫn vật lộn với **robustness trước đầu vào phi chuẩn, độ phức tạp ngôn ngữ, thuật ngữ chuyên ngành, và lựa chọn/hoà hợp giống** — dù LLM tiên tiến có cải thiện đáng kể ở tính bao hàm (inclusivity).

Bộ thử **GENDER1PERSON** ([2025.wmt-1.56](https://aclanthology.org/2025.wmt-1.56/), tôi đọc phần mô tả trong mục 8.2 của bài findings): 1.000 đánh giá sản phẩm Amazon, chia đều **10 danh mục sản phẩm**, dịch En→Nga và En→Serbia, đo bằng **gender score** từ −100 (toàn nữ) tới +100 (toàn nam). Kết quả:
- **Đa số hệ thiên về giống đực** cho người viết.
- **Không có hệ nào** thiên về giống cái.
- Mỗi cặp ngôn ngữ có **7 hệ được coi là cân bằng** (điểm trong khoảng −10 đến +10).
- Nhưng: **ngay cả hệ "cân bằng" vẫn thiên lệch**, chỉ là thiên lệch **theo hướng khác nhau ở từng danh mục sản phẩm**, nên bù trừ nhau khi lấy trung bình.

Điểm cuối cùng ấy là một bài học phương pháp sắc bén: **một con số tổng có thể che giấu hoàn toàn vấn đề.** Tổng kết mục 8.3 còn ghi thêm rằng các hệ có hiệu năng chung cao lại **thiên lệch nam mạnh**.

Thiên lệch còn lan sang **chính metric**: GAMBIT+ ([2025.wmt-1.19](https://aclanthology.org/2025.wmt-1.19/)) là bộ thử đánh giá thiên lệch giới **trong các metric QE** — tức là công cụ đo của chúng ta cũng có thể thiên lệch.

**Bài mốc.** Stanovsky et al., [P19-1164](https://aclanthology.org/P19-1164/) (WinoMT, bài gốc); GENDER1PERSON [2025.wmt-1.56](https://aclanthology.org/2025.wmt-1.56/); GAMBIT+ [2025.wmt-1.19](https://aclanthology.org/2025.wmt-1.19/).

#### (b) Ảo giác và bỏ sót

**Vì sao còn mở.** Ảo giác trong dịch (bản đích trôi chảy nhưng **không liên quan** nguồn) là lỗi **thảm hoạ**, nhưng dữ liệu gán nhãn cực hiếm.

**Bài mốc.**
- Guerreiro et al., [arXiv 2208.05309](https://arxiv.org/abs/2208.05309) — đặt nền: làm trong **bối cảnh tự nhiên** (dữ liệu trong miền, không tiêm nhiễu nhân tạo), gán nhãn **hơn 3,4k câu** với các loại lỗi nghiêm trọng, và **kiểm chứng tính thoả đáng của các heuristic phát hiện** mà trước đó ai cũng dùng mà không ai kiểm.
- HalOmi, [arXiv 2305.11746](https://arxiv.org/abs/2305.11746) — benchmark gán nhãn tay cho **ảo giác và bỏ sót**, **18 hướng dịch** với các mức tài nguyên và hệ chữ viết khác nhau, gán nhãn ở **cả mức câu lẫn mức từ**. Bài này cũng chỉ ra rằng **kết luận của các nghiên cứu trước bị lệch** vì chỉ làm trên vài ngôn ngữ giàu tài nguyên.

**Câu hỏi nhỏ thử được trên Colab.**
> **Ở tiếng Việt, tín hiệu nào báo trước ảo giác rẻ nhất?** Dịch 500 câu bằng một mô hình nhỏ. Với mỗi câu, ghi ba tín hiệu rẻ: **log-probability trung bình của chuỗi sinh**, **tỉ lệ độ dài** đích/nguồn, và **điểm CometKiwi** (không cần tham chiếu). Tự đọc tay và gán nhãn 500 câu đó thành có/không ảo giác. Rồi đo: tín hiệu nào cho **AUC** cao nhất?
> **Đây là thí nghiệm một người làm được trọn vẹn** — phần tốn công nhất là gán nhãn tay, và chính phần đó tạo ra giá trị: một tập nhỏ có nhãn người cho tiếng Việt.
> **Nhớ:** báo cáo **tỉ lệ ảo giác thực tế** trong 500 câu. Nếu chỉ có 5 câu ảo giác thì mọi AUC đều là nhiễu, và bạn phải nói thế.

---

### 2.8 Dữ liệu và giấy phép

**Vì sao còn mở.** Hướng này ít "sexy" nhưng đang chặn tất cả các hướng khác, và có ba mặt:

1. **Không biết mình đang dùng gì.** The Data Provenance Initiative kiểm toán **hơn 1.800 tập dữ liệu văn bản**, truy nguyên nguồn gốc, người tạo, chuỗi điều kiện giấy phép ([arXiv 2310.16787](https://arxiv.org/abs/2310.16787)). Phát hiện đáng chú ý cho chúng ta: các tập **đóng** (không mở thương mại) **độc chiếm** một số hạng mục quan trọng, trong đó có **ngôn ngữ ít tài nguyên**.
2. **Dữ liệu web chưa được kiểm thì không dùng được.** MADLAD-400 ([arXiv 2309.04662](https://arxiv.org/abs/2309.04662)) chọn cách **tự kiểm toán tay** và công bố luôn các hạn chế mà việc kiểm toán phơi ra — một chuẩn mực đáng theo.
3. **Ngay cả dữ liệu tốt cũng bị giấy phép ràng buộc.** PhoMT trên Hugging Face là **gated** (`gated: auto`): phải chấp nhận điều kiện, và điều kiện ghi rõ **chỉ dùng cho nghiên cứu hoặc giáo dục**, **không phân phối lại** dưới bất kỳ dạng gốc hay biến đổi nào, và **phải trích dẫn** bài EMNLP 2021. Tôi đã đọc trực tiếp trường `extra_gated_prompt` qua API.

**Ai đang làm.** OLDI ([2025.wmt-1.26](https://aclanthology.org/2025.wmt-1.26/)) và các đóng góp cộng đồng dạng FLORES+ seed; nhóm SMOL ([2025.wmt-1.85](https://aclanthology.org/2025.wmt-1.85/)); HPLT/DocHPLT; Data Provenance Initiative; SEACrowd cho Đông Nam Á ([2024.emnlp-main.296](https://aclanthology.org/2024.emnlp-main.296/)).

**Câu hỏi nhỏ thử được trên Colab.**
> **Lọc dữ liệu đáng giá bao nhiêu điểm?** Lấy một corpus Việt–Anh khai thác tự động từ OPUS. Fine-tune hai lần, **cùng số câu**: (A) lấy ngẫu nhiên N câu; (B) lấy N câu **điểm CometKiwi cao nhất** từ một tập lớn hơn. Đo trên tập test của bạn.
> **Đây là biến thể chính xác của việc WMT25 làm thật:** ban tổ chức đã tính sẵn **điểm CometKiwi-22 cho hầu hết các corpus huấn luyện khuyến nghị** (mục 1 của [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/)). Nghĩa là câu hỏi này được cộng đồng coi là đáng hỏi.

---

## 3. Riêng cho tiếng Việt

### 3.1 Tài nguyên có thật (mỗi mục đã kiểm tồn tại, 2026-09-18)

**Dữ liệu song ngữ**

| Tài nguyên | Quy mô / nội dung | Nguồn đã kiểm |
|---|---|---|
| **PhoMT** | 3,02 triệu cặp Việt–Anh; bài EMNLP 2021 | [2021.emnlp-main.369](https://aclanthology.org/2021.emnlp-main.369/) · [github](https://github.com/VinAIResearch/PhoMT) · [HF (gated)](https://huggingface.co/datasets/vinai/PhoMT) |
| **MTet** | Abstract ghi **4,2 triệu cặp** huấn luyện chất lượng cao + tập test đa miền; **cộng với công trình trước thì tổng lên 6,2 triệu cặp** | [arXiv 2210.05610](https://arxiv.org/abs/2210.05610) · [github vietai/mTet](https://github.com/vietai/mTet) |
| **OPUS** | Tổng hợp corpus mở, có nhiều bộ vi–en | [opus.nlpl.eu](https://opus.nlpl.eu/) · [Helsinki-NLP/opus-100](https://huggingface.co/datasets/Helsinki-NLP/opus-100) |
| **VietMix** | Corpus song ngữ **trộn mã Việt–Anh** do chuyên gia dịch, xuất hiện tự nhiên; EACL 2026 | [arXiv 2505.24472](https://arxiv.org/abs/2505.24472) |
| **MedEV** | **khoảng 360 nghìn cặp câu** Việt–Anh **miền y khoa**; theo Abstract, kết quả tốt nhất đạt được khi fine-tune `vinai-translate` cho từng chiều dịch | [arXiv 2403.19161](https://arxiv.org/abs/2403.19161) |

⚠️ **PhoMT là gated và chỉ cho nghiên cứu/giáo dục, cấm phân phối lại** (§2.8). Nếu bạn định công bố mô hình fine-tune từ nó, đọc kỹ điều khoản trước.

**Benchmark có tiếng Việt**

| Benchmark | Tiếng Việt xuất hiện thế nào | Đã kiểm bằng |
|---|---|---|
| **FLORES+** | có cấu hình `vie_Latn` trong **231 cấu hình** | API HF của [openlanguagedata/flores_plus](https://huggingface.co/datasets/openlanguagedata/flores_plus) (gated: auto) |
| **WMT24++** | có cấu hình `en-vi_VN` trong **55 cấu hình** | API HF của [google/wmt24pp](https://huggingface.co/datasets/google/wmt24pp) · bài [arXiv 2502.12404](https://arxiv.org/abs/2502.12404) |
| **WMT25 General MT** | English→Vietnamese nằm trong **nhánh đa ngữ phụ, chỉ đánh giá tự động** | mục 1 của [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/) |
| **NTREX-128** | kho test 128 ngôn ngữ (có tiếng Việt — *xem ghi chú §7*) | [github](https://github.com/MicrosoftTranslator/NTREX) |
| **IWSLT15 En–Vi** | tập cổ điển, nhỏ, **đã bị dùng quá nhiều** | nêu trong `04-dich-may.md` |

**Mô hình**

| Mô hình | Ghi chú | Đã kiểm (HF API, mã 200) |
|---|---|---|
| `VietAI/envit5-translation` | mô hình dịch Anh↔Việt, đi kèm bài MTet | [link](https://huggingface.co/VietAI/envit5-translation) |
| `vinai/bartpho-syllable` | seq2seq đơn ngữ tiếng Việt đầu tiên quy mô lớn; [arXiv 2109.09701](https://arxiv.org/abs/2109.09701) | [link](https://huggingface.co/vinai/bartpho-syllable) |
| `vinai/phobert-base` | encoder tiếng Việt; [2020.findings-emnlp.92](https://aclanthology.org/2020.findings-emnlp.92/) | API 200 |
| `vinai/PhoGPT-4B` | 3,7B tham số, tiền huấn luyện trên **102 tỉ token** tiếng Việt, vocab 20.480, ngữ cảnh 8192; [arXiv 2311.02945](https://arxiv.org/abs/2311.02945) | API 200 |
| `facebook/nllb-200-distilled-600M` | **điểm khởi đầu thực tế nhất cho Colab** | [link](https://huggingface.co/facebook/nllb-200-distilled-600M) |
| `google/madlad400-3b-mt` | dịch >450 ngôn ngữ | [link](https://huggingface.co/google/madlad400-3b-mt) |
| SeaLLMs / Sailor | LLM chuyên Đông Nam Á, có tiếng Việt; [arXiv 2312.00738](https://arxiv.org/abs/2312.00738), [arXiv 2404.03608](https://arxiv.org/abs/2404.03608) | — |

**Tiếng nói và miền chuyên**

- **PhoST**: dịch nói Anh→Việt, **508 giờ audio**, **331 nghìn bộ ba** (audio cỡ câu, bản chép tiếng Anh, phụ đề tiếng Việt). Phát hiện đáng chú ý: **cách "cascaded" truyền thống vẫn vượt "end-to-end" hiện đại** — [arXiv 2208.04243](https://arxiv.org/abs/2208.04243), INTERSPEECH 2022, code tại [github](https://github.com/VinAIResearch/PhoST).
- **Dịch y khoa Anh–Việt**: bộ **MedEV** khoảng 360 nghìn cặp câu ([arXiv 2403.19161](https://arxiv.org/abs/2403.19161), đã đọc Abstract). Xem thêm ghi chú §7.3 về một preprint liên quan **đã bị rút**.

**Ngôn ngữ dân tộc thiểu số ở Việt Nam**

- **CKTN** ([arXiv 2607.08362](https://arxiv.org/abs/2607.08362), preprint tháng 7/2026, **chưa rõ đã qua bình duyệt**): corpus và benchmark **đầu tiên** cho **Chăm, Khmer, Tày–Nùng** — 44.367 tài liệu, 24 triệu subword token. Hai phát hiện đáng chú ý theo Abstract: (1) các encoder đa ngữ hiện có **cắt vụn nghiêm trọng** những ngôn ngữ này; (2) **các chỉ số thích nghi thông thường có thể đánh lừa** — mô hình có thể giảm được loss mô hình hoá ngôn ngữ hoặc giỏi truy hồi dựa trên chồng lấn từ vựng mà **vẫn thất bại ở khái quát hoá ngữ nghĩa**.
- VLSP 2022–2023 đã tổ chức shared task dịch **Việt–Trung** và **Việt–Lào**, test 1.000 cặp (miền tin tức và tổng quát), chấm bằng BLEU/SacreBLEU **cộng đánh giá người bởi chuyên gia** ([arXiv 2501.08621](https://arxiv.org/abs/2501.08621)).

### 3.2 Khoảng trống nghiên cứu cho tiếng Việt

Đây là phần tôi cho là có giá trị nhất của file này. Mỗi khoảng trống dưới đây là một chỗ **có thể làm được thật**, không phải ước mơ.

1. **Không có tập đánh giá người chuẩn (MQM/ESA) công khai cho tiếng Việt.** Bằng chứng gián tiếp nhưng mạnh: WMT25 xếp English→Vietnamese vào nhánh **chỉ đánh giá tự động**, trong khi 16 cặp khác có người chấm. Nghĩa là **mọi tuyên bố về chất lượng dịch tiếng Việt hiện nay đều dựa trên metric tự động** — mà §1.3 và §1.4 vừa cho thấy metric tự động có thể sai nghiêm trọng. *(Tôi tìm nhưng không thấy tập nào như vậy; xem §7.)*
2. **Không biết COMET/MetricX tốt đến đâu với tiếng Việt.** Không có dữ liệu chấm người tiếng Việt thì không meta-đánh giá được metric. AfriCOMET ([arXiv 2311.09828](https://arxiv.org/abs/2311.09828)) đã vạch sẵn công thức để lấp: **hướng dẫn MQM đơn giản hoá + người bản ngữ**. Công thức đó chuyển sang tiếng Việt được.
3. **Thiên lệch giới trong dịch sang tiếng Việt chưa được đo.** Tiếng Việt không đánh dấu giống ngữ pháp như tiếng Nga hay Serbia, nhưng **hệ thống xưng hô** (anh/chị/em/ông/bà/cô/chú...) buộc mô hình phải suy đoán **giới tính, tuổi tác và quan hệ quyền lực** ở gần như mọi câu đối thoại. Đây là một dạng thiên lệch **đặc thù tiếng Việt** mà WinoMT và GENDER1PERSON không bắt được. Chưa thấy bộ thử nào cho việc này (§7).
4. **Nhiễm dữ liệu chưa được kiểm cho các benchmark tiếng Việt.** IWSLT15 En–Vi nằm trên web hơn mười năm; PhoMT có bản sao không chính thức trên Hugging Face (tôi thấy hơn 15 repo mang tên PhoMT khi tìm qua API). Chưa ai đo mức thổi phồng điểm do nhiễm cho tiếng Việt.
5. **Ngôn ngữ dân tộc thiểu số gần như trắng.** CKTN mới mở đường cho ba nhóm ngôn ngữ, và **chưa có cặp dịch nào** trong đó có benchmark dịch công khai (CKTN là corpus + phân loại + truy hồi, không phải dịch — theo Abstract).
6. **Tokenizer tiếng Việt trong mô hình đa ngữ.** Đã biết là vấn đề chung (xem §2.1 và bài CKTN về "fragmentation"), nhưng **chưa thấy đo lường công bố** riêng cho tiếng Việt trong các LLM 2025–2026.

### 3.3 Nhóm và hội nghị liên quan

- **VLSP** — Hội thảo Xử lý ngôn ngữ và tiếng nói tiếng Việt, tổ chức shared task dịch máy ([vlsp.org.vn](https://vlsp.org.vn/), kiểm sống 200). Đây là nơi tự nhiên nhất để một người Việt nộp bài đầu tiên.
- **VinAI Research** — PhoBERT, BARTpho, PhoGPT, PhoMT, PhoST.
- **VietAI** — MTet, EnViT5.
- **SEACrowd** — liên minh dữ liệu/benchmark cho Đông Nam Á, **gần 1.000 ngôn ngữ**, ba phương thức ([2024.emnlp-main.296](https://aclanthology.org/2024.emnlp-main.296/)).
- **WMT** (cùng EMNLP) — nơi công bố chuẩn của dịch máy; có nhánh đa ngữ **đã bao gồm tiếng Việt**.
- **IWSLT** — dịch nói; có nhánh ngôn ngữ ít tài nguyên và nhánh nén mô hình, cả hai đều vừa tầm một người.
- **OLDI** — nhận đóng góp dữ liệu seed cho FLORES+; **đây là cách đóng góp nhỏ nhất mà vẫn có ích thật** ([2025.wmt-1.26](https://aclanthology.org/2025.wmt-1.26/)).

---

## 4. Làm nghiên cứu ở quy mô một người

### 4.1 Chọn câu hỏi đủ nhỏ

Một câu hỏi tốt cho một người có bốn tính chất:

1. **Một biến độc lập.** "Sampling hay beam khi back-translate" là tốt. "Làm sao cải thiện dịch tiếng Việt" là không phải câu hỏi.
2. **Kết quả nào cũng có ý nghĩa.** Nếu "không khác biệt" là một kết quả bạn sẵn sàng báo cáo, câu hỏi đó an toàn. Nếu chỉ một chiều mới đáng viết, bạn đang tự đặt bẫy.
3. **Chạy được trong một buổi.** Vòng lặp nhanh quan trọng hơn quy mô. Mười thí nghiệm nhỏ dạy nhiều hơn một thí nghiệm lớn.
4. **Bạn đo được.** Nếu bạn chưa có tập test trước khi bắt đầu, bạn chưa có câu hỏi.

Cách diễn đạt tốt: *"Với [mô hình X] trên [cặp Y], [can thiệp Z] thay đổi [metric M] bao nhiêu, so với [baseline B], ở cùng [ngân sách C]?"* — nếu bạn không điền được cả sáu ô, câu hỏi chưa đủ chín.

### 4.2 Baseline là bắt buộc, không phải tuỳ chọn

Một con số đứng một mình **không nói gì cả**. "COMET 0,82" là vô nghĩa; "COMET 0,82 so với 0,79 của cùng mô hình chưa fine-tune, trên cùng 500 câu" mới là kết quả.

Tối thiểu cần ba baseline:
- **Không làm gì** (mô hình gốc, chưa can thiệp).
- **Cách rẻ nhất** (prompt đơn giản, hoặc fine-tune tầm thường).
- **Giả dược** — cái làm giống can thiệp của bạn nhưng **rỗng nội dung**. Đây là baseline hay bị bỏ nhất và cũng quan trọng nhất. WMT25 Terminology dùng chính kỹ thuật này: nhánh **"từ điển ngẫu nhiên"** chứng minh rằng cải thiện đến từ **nội dung** từ điển chứ không phải từ việc prompt dài ra ([2025.wmt-1.30](https://aclanthology.org/2025.wmt-1.30/)).

### 4.3 Kiểm soát biến và ngân sách tính toán

Sai lầm phổ biến nhất trong so sánh mô hình: **so hai thứ tiêu tốn khác nhau**. Fine-tune 10.000 bước rồi so với baseline 1.000 bước không chứng minh phương pháp của bạn tốt hơn — nó chứng minh 10.000 lớn hơn 1.000.

Phải giữ bằng nhau: **số bước huấn luyện** (hoặc số token đã thấy), **learning rate và lịch trình**, **kích thước batch hiệu dụng**, **số câu huấn luyện**, **tokenizer**, **cấu hình giải mã** (beam size, độ dài tối đa, temperature), và **tập test**.

WMT25 Model Compression cho thấy chuẩn báo cáo hiện đại: không chỉ chất lượng, mà **chất lượng + kích thước + tốc độ**, đo trên **phần cứng ghi rõ** (A100) ([2025.wmt-1.25](https://aclanthology.org/2025.wmt-1.25/)). Bạn nên bắt chước: ghi luôn loại GPU Colab cấp cho bạn hôm đó.

### 4.4 Lặp lại được: seed và độ lệch

- **Đặt seed rõ ràng** cho Python, NumPy, và framework học sâu, và **ghi seed vào báo cáo**.
- **Chạy tối thiểu 3 seed.** Một lần chạy không phân biệt được cải thiện thật với may mắn.
- **Báo trung bình ± độ lệch chuẩn**, không báo con số đơn.
- **Nếu khác biệt nhỏ hơn độ lệch giữa các seed, nói thẳng là không kết luận được.** Đây là câu khó viết nhất và cũng là câu làm báo cáo của bạn đáng tin nhất.
- Ghi **phiên bản**: mô hình, thư viện, và với chrF/BLEU thì ghi **signature của sacreBLEU**. WMT làm đúng thế. [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/) in nguyên chữ ký ở chú thích 29 của mục 5: `nrefs:1|case:mixed|eff:yes|nc:6|nw:2|space:no|version:2.5.1` (đây là chrF++, nên `nw:2`). Còn [2025.wmt-1.24](https://aclanthology.org/2025.wmt-1.24/) in chữ ký chrF của nó là `chrF2|nrefs:1|case:mixed|eff:yes|nc:6|nw:0|...|v:2.3.1` — **khác phiên bản sacreBLEU và khác tham số**. Hai bài cùng một hội nghị, cùng năm, mà chữ ký đã khác nhau: đó chính là lý do phải ghi chữ ký. Không có nó thì điểm chrF/BLEU của bạn không so được với ai.

### 4.5 Sáu sai lầm kinh điển làm kết quả vô nghĩa

| Sai lầm | Vì sao chết người | Cách tránh |
|---|---|---|
| **Rò rỉ test** | Điểm tăng vì mô hình đã thấy đáp án. Đã đo có kiểm soát: nhiễm cả nguồn lẫn đích thổi BLEU **tới 30 điểm** ở mô hình 8B ([arXiv 2501.18771](https://arxiv.org/abs/2501.18771)) | Khử trùng bằng khớp chuỗi chuẩn hoá **trước** khi huấn luyện; với LLM thương mại thì **giả định là đã nhiễm** và tự làm tập test mới |
| **So khác ngân sách tính toán** | Đo số bước chứ không đo ý tưởng | Cố định bước/token/batch/dữ liệu; ghi rõ vào báo cáo |
| **Chỉ báo điểm tốt nhất** | Chọn lần chạy may nhất là dạng p-hacking | Báo mọi lần chạy, hoặc trung bình ± độ lệch, và nói rõ đã chạy bao nhiêu lần |
| **Chọn checkpoint trên tập test** | Test biến thành dev; con số cuối bị thổi | Tách **ba** tập: train / dev (chọn checkpoint) / test (chạy **một lần duy nhất**) |
| **Chỉ tin metric tự động** | Đúng cái bẫy Shy-hunyuan-MT: hạng 1,0 theo máy, hạng 11–16 theo người, cùng tập test ([2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/) mục 7.2/7.4) | Luôn **đọc tay ít nhất 50 câu**; và **đừng bao giờ tối ưu vào chính metric bạn dùng để báo cáo** |
| **Tin trung bình tổng** | Trung bình che giấu thiên lệch ngược chiều nhau: GENDER1PERSON cho thấy hệ "cân bằng" vẫn thiên lệch, chỉ khác hướng ở từng danh mục ([2025.wmt-1.56](https://aclanthology.org/2025.wmt-1.56/)) | Luôn **chia nhỏ theo miền, độ dài, loại nội dung** trước khi kết luận |

### 4.6 Trình tự tối thiểu cho một dự án nhỏ

1. Viết câu hỏi thành **một câu** theo khuôn ở §4.1. Nếu không viết nổi thì chưa bắt đầu.
2. Dựng **tập test trước tiên**, từ văn bản mới, và **khoá nó lại**.
3. Chạy **baseline** và ghi vào bảng.
4. Chạy **can thiệp** với đúng một biến thay đổi, **3 seed**.
5. **Đọc tay 50 câu** của baseline và 50 câu của can thiệp, cạnh nhau.
6. Viết kết quả **kể cả khi nó là "không khác biệt"**. Một kết quả âm được báo cáo trung thực có giá trị hơn một kết quả dương không lặp lại được.

---

## 5. Lộ trình đề xuất cho LAIFS

*Đây chỉ là **đề xuất**. Tôi không tạo file bài học nào.*

Web hiện đã có các khái niệm nền: `dich-may-nmt`, `dich-may-it-tai-nguyen`, `danh-gia-dich`, `llm-dich-may`, `tai-nguyen-ngon-ngu`, `du-lieu-song-ngu`, `tokenization`, `seq2seq`, `attention`, `transformer`, `colab-kaggle`, `train-val-test`. Chúng đủ để đưa người học tới **mép** của các hướng ở §2, nhưng còn thiếu **cầu nối sang tư duy nghiên cứu**.

### 5.1 Khoảng trống lớn nhất: chưa có bài nào dạy *cách làm thí nghiệm*

Người học hiện có thể hiểu COMET là gì nhưng vẫn không biết phải thiết kế một so sánh như thế nào cho có nghĩa. Đề xuất **ba khái niệm mới, ưu tiên cao nhất**:

| Đề xuất | Nội dung cốt lõi | Tiền quyết |
|---|---|---|
| `baseline-va-doi-chung` | Vì sao một con số đứng một mình là vô nghĩa; ba loại baseline; **nhóm giả dược** lấy ví dụ từ nhánh "từ điển ngẫu nhiên" của WMT25 Terminology | `danh-gia-dich` |
| `ro-ri-du-lieu-test` | Rò rỉ và nhiễm benchmark; con số 30 điểm BLEU của arXiv 2501.18771; cách khử trùng; vì sao điểm FLORES của LLM thương mại phải nghi ngờ | `train-val-test` |
| `lap-lai-duoc-seed-do-lech` | Seed, 3 lần chạy, trung bình ± độ lệch, chữ ký sacreBLEU, checkpoint chọn trên dev chứ không trên test | `danh-gia-dich` |

Ba bài này dùng được cho **mọi** lĩnh vực ML chứ không riêng dịch máy — nên giá trị trên mỗi bài viết ra là cao nhất.

### 5.2 Nhóm thứ hai: mở rộng phần đánh giá

| Đề xuất | Nội dung cốt lõi |
|---|---|
| `danh-gia-khong-can-tham-chieu` | QE là gì, CometKiwi, khi nào dùng được; và cảnh báo *"References Still Help"* của WMT25 |
| `metric-bi-toi-uu-nguoc` | Ví dụ Shy-hunyuan-MT: AutoRank 1,0 vs điểm người 3,2. Bài học: đừng huấn luyện vào chính metric bạn báo cáo. **Đây là bài đáng viết nhất trong cả danh sách** vì nó dạy một thói quen chứ không chỉ một khái niệm |
| `mqm-esa-danh-gia-nguoi` | Hai giao thức chấm người mà WMT dùng thật; vì sao chuẩn vàng vẫn là người |

### 5.3 Nhóm thứ ba: mở rộng phần kỹ thuật

| Đề xuất | Nội dung cốt lõi |
|---|---|
| `back-translation` | Kỹ thuật kinh điển, đã nhắc trong `04` nhưng chưa có bài riêng; kèm phát hiện sampling > beam của Edunov et al. |
| `lora-finetune-tiet-kiem` | LoRA/QLoRA — **cửa vào bắt buộc** để mọi câu hỏi ở §2 chạy được trên Colab |
| `dich-cap-tai-lieu` | Vì sao dịch cả đoạn khác dịch từng câu; xưng hô tiếng Việt là ví dụ tự nhiên nhất |
| `thuat-ngu-va-kiem-soat-dau-ra` | Ràng buộc thuật ngữ, glossary trong prompt, và vì sao phải đo **riêng** độ chính xác thuật ngữ |
| `ao-giac-trong-dich` | Ảo giác và bỏ sót; các tín hiệu phát hiện rẻ tiền |
| `thien-lech-gioi-trong-dich` | WinoMT; GENDER1PERSON; và trường hợp **xưng hô tiếng Việt** — phần này LAIFS có lợi thế nội dung mà tài liệu tiếng Anh không có |

### 5.4 Nhóm thứ tư: một bài tập xuyên suốt

Đề xuất **một bài tập lớn** thay vì nhiều bài nhỏ rời rạc: *"Nghiên cứu nhỏ đầu tiên của bạn"* — dẫn người học đi hết §4.6 trên một câu hỏi cụ thể (gợi ý: câu hỏi COMET–số–tên riêng ở §2.2, vì nó không cần huấn luyện gì cả, chạy trong một buổi, và **kết quả thật sự chưa ai công bố cho tiếng Việt**).

### 5.5 Thứ tự đề xuất

```
Đã có: dich-may-nmt → danh-gia-dich → dich-may-it-tai-nguyen → llm-dich-may
                              │
        ┌─────────────────────┴──────────────────────┐
        ▼                                            ▼
  (5.1) baseline-va-doi-chung                 (5.3) back-translation
        ro-ri-du-lieu-test                          lora-finetune-tiet-kiem
        lap-lai-duoc-seed-do-lech                         │
        │                                                 │
        ▼                                                 ▼
  (5.2) danh-gia-khong-can-tham-chieu          dich-cap-tai-lieu
        metric-bi-toi-uu-nguoc                 thuat-ngu-va-kiem-soat-dau-ra
        mqm-esa-danh-gia-nguoi                 ao-giac-trong-dich
        │                                      thien-lech-gioi-trong-dich
        └──────────────────┬───────────────────────────┘
                           ▼
              (5.4) Bài tập: nghiên cứu nhỏ đầu tiên
```

---

## 6. Nguồn đã xác minh

Tất cả kiểm ngày **2026-09-18**. Cột "Đọc" ghi mức độ tôi thật sự đọc: **PDF** = đã tải và đọc nội dung; **Abstract** = đã đọc abstract gốc trên arXiv qua API; **API** = đã kiểm tồn tại và siêu dữ liệu; **Trang** = đã mở trang đích.

### ACL Anthology (tất cả HTTP 200)

| ID | Tiêu đề | Đọc |
|---|---|---|
| 2025.wmt-1.22 | Findings of the WMT25 General MT Shared Task: Time to Stop Evaluating on Easy Test Sets | **PDF** |
| 2025.wmt-1.24 | Findings of the WMT25 Shared Task on Automated Translation Evaluation Systems | **PDF** |
| 2025.wmt-1.25 | Findings of the WMT 2025 Shared Task on Model Compression | **PDF** |
| 2025.wmt-1.30 | Findings of the WMT25 Terminology Translation Task | **PDF** |
| 2025.wmt-1.5 | Context is Ubiquitous, but Rarely Changes Judgments | **PDF** |
| 2025.wmt-1.26 | Findings of the WMT 2025 Shared Task of the Open Language Data Initiative | Trang |
| 2025.wmt-1.6 | GIIFT: Graph-guided Inductive Image-free Multimodal MT | Trang |
| 2025.wmt-1.17 | DocHPLT: A Massively Multilingual Document-Level Translation Dataset | Trang |
| 2025.wmt-1.19 | GAMBIT+: Challenge Set for Gender Bias in MT QE Metrics | Trang |
| 2025.wmt-1.56 | GENDER1PERSON: Test Suite for Gender Bias of First-person Singular Forms | Trang (+ mô tả trong PDF 1.22) |
| 2025.wmt-1.85 | SMOL: Professionally Translated Parallel Data for 115 Under-represented Languages | Trang |
| 2024.wmt-1.1 | Findings of WMT24 General MT: The LLM Era Is Here but MT Is Not Solved Yet | **PDF** |
| 2024.wmt-1.2 | Are LLMs Breaking MT Metrics? Results of the WMT24 Metrics Shared Task | **PDF** |
| 2024.wmt-1.34 | MSLC24: Further Challenges for Metrics on a Wide Landscape of Translation Quality | Trang |
| 2024.wmt-1.35 | MetricX-24: The Google Submission to the WMT 2024 Metrics Shared Task | Trang |
| 2025.iwslt-1.44 | Findings of the IWSLT 2025 Evaluation Campaign | **PDF** |
| 2020.emnlp-main.213 | COMET: A Neural Framework for MT Evaluation | Trang |
| 2022.wmt-1.60 | CometKiwi: IST-Unbabel 2022 Submission for the QE Shared Task | Trang |
| 2022.wmt-1.44 | ACES: Translation Accuracy Challenge Sets for Evaluating MT Metrics | Trang (+ Abstract arXiv 2210.15615) |
| 2022.aacl-main.83 | Identifying Weaknesses in MT Metrics Through MBR Decoding: A Case Study for COMET | Trang (+ Abstract arXiv 2202.05148) |
| 2022.naacl-main.100 | Quality-Aware Decoding for Neural Machine Translation | Trang (+ Abstract arXiv 2205.00978) |
| P19-1294 | Training Neural Machine Translation to Apply Terminology Constraints | Trang |
| P19-1116 | When a Good Translation is Wrong in Context | Trang |
| P19-1164 | Evaluating Gender Bias in Machine Translation | Trang |
| D16-1139 | Sequence-Level Knowledge Distillation | Trang |
| P16-1009 | Improving Neural Machine Translation Models with Monolingual Data | Trang |
| 2020.acl-main.560 | The State and Fate of Linguistic Diversity and Inclusion in the NLP World | Trang |
| 2021.emnlp-main.369 | PhoMT: A High-Quality and Large-Scale Benchmark for Vietnamese-English MT | Trang |
| 2020.findings-emnlp.92 | PhoBERT: Pre-trained language models for Vietnamese | Trang |
| 2022.naacl-srw.18 | ViT5: Pretrained Text-to-Text Transformer for Vietnamese | Trang |
| 2024.emnlp-main.296 | SEACrowd: Data Hub and Benchmark Suite for Southeast Asian Languages | Trang |

### arXiv (tất cả HTTP 200, abstract đọc qua API chính thức của arXiv)

| ID | Tiêu đề | Bản/ngày |
|---|---|---|
| 2207.04672 | No Language Left Behind: Scaling Human-Centered Machine Translation | v3, 2022-08-25 |
| 2309.04662 | MADLAD-400: A Multilingual And Document-Level Large Audited Dataset | v1, 2023-09-09 |
| 2402.17733 | Tower: An Open Multilingual LLM for Translation-Related Tasks | v1, 2024-02-27 |
| 2309.11674 | A Paradigm Shift in Machine Translation (ALMA) | v2, 2024-02-06 |
| 2401.08417 | Contrastive Preference Optimization (ALMA-R) | v4, 2024-06-03 |
| 2308.11596 | SeamlessM4T: Massively Multilingual & Multimodal Machine Translation | v3, 2023-10-25 |
| 2212.04356 | Robust Speech Recognition via Large-Scale Weak Supervision (Whisper) | v1, 2022-12-06 |
| 2502.12404 | WMT24++: Expanding the Language Coverage of WMT24 to 55 Languages & Dialects | v1, 2025-02-18 |
| 2210.05610 | MTet: Multi-domain Translation for English and Vietnamese | v2, 2022-10-19 |
| 2304.03245 | LLMs effectively leverage document-level context for literary translation | v3, 2023-05-22 |
| 1808.09381 | Understanding Back-Translation at Scale | v2, 2018-10-03 |
| 2208.05309 | Looking for a Needle in a Haystack: Hallucinations in NMT | v2, 2023-03-05 |
| 2305.11746 | HalOmi: Benchmark for Multilingual Hallucination and Omission Detection | v2, 2023-12-06 |
| 2305.14314 | QLoRA: Efficient Finetuning of Quantized LLMs | v1, 2023-05-23 |
| 2106.09685 | LoRA: Low-Rank Adaptation of Large Language Models | v2, 2021-10-16 |
| 2406.15625 | Shortcomings of LLMs for Low-Resource Translation | v3, 2024-10-24 |
| 2311.09828 | AfriMTE and AfriCOMET | v3, 2024-04-23 |
| 2404.11201 | Neuron Specialization: intrinsic task modularity for multilingual MT | v1, 2024-04-17 |
| 2501.18771 | Overestimation in LLM Evaluation: Data Contamination's Impact on MT | v1, 2025-01-30 |
| 2404.13813 | From LLM to NMT: Advancing Low-Resource MT with Claude | v1, 2024-04-22 |
| 2309.16575 | A Benchmark for Learning to Translate a New Language from One Grammar Book (MTOB) | v2 |
| 2310.16787 | The Data Provenance Initiative | v3, 2023-11-04 |
| 2505.24472 | VietMix: Vietnamese-English Code-Mixed MT (EACL 2026) | v2, 2026-01-09 |
| 2501.08621 | ViBidirectionMT-Eval: Vietnamese-Chinese and Vietnamese-Lao (VLSP 2022–2023) | v1, 2025-01-15 |
| 2208.04243 | A High-Quality and Large-Scale Dataset for English-Vietnamese Speech Translation (PhoST) | v1, 2022-08-08 |
| 2607.08362 | Echoes Across Vietnam's Highlands, Delta, and Coast: Cham, Khmer, Tay-Nung (CKTN) | v4, 2026-07-27, **preprint** |
| 2109.09701 | BARTpho | v3, 2022-06-27 |
| 2311.02945 | PhoGPT: Generative Pre-training for Vietnamese | v3, 2024-03-22 |
| 2404.03608 | Sailor: Open Language Models for South-East Asia | v1, 2024-04-04 |
| 2312.00738 | SeaLLMs — Large Language Models for Southeast Asia | v2, 2024-07-01 |
| 2403.19161 | Improving Vietnamese-English Medical Machine Translation (MedEV) | v1, 2024-03-28 |
| 2210.15615 | ACES: Translation Accuracy Challenge Sets | v2, 2022-12-06 |
| 2202.05148 | Identifying Weaknesses in MT Metrics Through MBR Decoding | v2, 2022-09-26 |
| 2205.00978 | Quality-Aware Decoding for Neural Machine Translation | v1, 2022-05-02 |

### Hugging Face (API trả 200)

Mô hình: `VietAI/envit5-translation`, `VietAI/vit5-base`, `vinai/phobert-base`, `vinai/bartpho-syllable`, `vinai/PhoGPT-4B`, `facebook/nllb-200-distilled-600M`, `facebook/nllb-200-3.3B`, `google/madlad400-3b-mt`, `Unbabel/wmt22-comet-da`, `Unbabel/wmt22-cometkiwi-da`, `Unbabel/XCOMET-XL`, `google/metricx-24-hybrid-xl-v2p6`, `Unbabel/TowerInstruct-7B-v0.2`, `haoranxu/ALMA-13B-R`, `openai/whisper-large-v3`, `facebook/seamless-m4t-v2-large`, `Prosho/sentinel-src-25`.

Dataset: `vinai/PhoMT` (**gated: auto**, đã đọc điều khoản), `openlanguagedata/flores_plus` (231 cấu hình, có `vie_Latn`, gated: auto), `google/wmt24pp` (55 cấu hình, có `en-vi_VN`), `google/smol`, `Helsinki-NLP/opus-100`, `allenai/nllb`, `facebook/flores`, `Muennighoff/flores200`.

### Trang web / mã nguồn (HTTP 200)

`github.com/VinAIResearch/PhoMT` · `github.com/VinAIResearch/PhoST` · `github.com/vietai/mTet` · `github.com/Unbabel/COMET` · `github.com/google-research/metricx` · `github.com/google-research/mt-metrics-eval` · `github.com/mjpost/sacrebleu` · `github.com/wmt-conference/wmt25-general-mt` · `github.com/MicrosoftTranslator/NTREX` · `opus.nlpl.eu` · `www2.statmt.org/wmt25/` · `vlsp.org.vn`

---

## 7. Những gì tôi **không** xác minh được, và những gì tôi phải bỏ

Phần này quan trọng ngang phần trên. Đọc kỹ trước khi trích lại bất cứ điều gì.

### 7.1 Mâu thuẫn trong chính bài báo

- **[2025.wmt-1.24](https://aclanthology.org/2025.wmt-1.24/)**: gạch đầu dòng tóm tắt (trang 415) liệt kê **"YiSi-1, chrF, và BERTScore"** là ba metric baseline lấp đầy ba cụm hạng đầu ở mức đoạn, trong khi mục 4.3 liệt kê **"YiSi-1, chrF, spBLEU, và BERTScore"** (bốn). Bảng 4 khớp với mục 4.3. Tôi đã ghi mâu thuẫn này ở §1.3 và **dùng con số của Bảng 4**.

### 7.2 Những khẳng định tôi tìm mà không xác minh được — nên đã viết là "chưa xác minh"

- **Không có tập đánh giá người (MQM/ESA) công khai cho dịch tiếng Việt.** Tôi tìm trên ACL Anthology, arXiv và Hugging Face nhưng không thấy. **Không tìm thấy ≠ không tồn tại.** Bằng chứng gián tiếp mà tôi thật sự có: WMT25 xếp En→Vi vào nhánh **chỉ đánh giá tự động**. Trong §3.2 tôi trình bày đúng ở mức đó.
- **Chất lượng của COMET/MetricX trên tiếng Việt.** Không tìm được nghiên cứu meta-đánh giá metric cho tiếng Việt. Tôi **không** đưa ra bất kỳ con số nào về việc này.
- **Bộ thử thiên lệch giới cho xưng hô tiếng Việt.** Tìm không thấy. Tôi trình bày như một **khoảng trống** chứ không phải một sự thật đã kiểm chứng.
- **Đo lường mức cắt vụn (fragmentation) của tokenizer với tiếng Việt trong LLM 2025–2026.** Tìm không thấy con số công bố. Chỉ nêu như khoảng trống.
- **NTREX-128 có tiếng Việt hay không.** Kho GitHub tồn tại (HTTP 200) nhưng tôi **chưa mở danh sách ngôn ngữ để xác nhận có tiếng Việt**. Trong §3.1 tôi đã đánh dấu chỗ này.
- **Cấu hình GPU miễn phí của Colab tính đến 2026-09-18.** Tôi **không kiểm được** và vì thế **không viết bất kỳ con số VRAM hay tên GPU nào** trong file. Mọi đề xuất ở §2 được thiết kế cho mô hình ≤ 1B hoặc LoRA trên ≤ 8B, là mức an toàn rộng rãi — nhưng bạn phải tự kiểm tra hạn mức thực tế của mình.
- **Các mốc "vài nghìn / vài chục nghìn / vài trăm nghìn cặp câu"** trong `04-dich-may.md` — file đó đã tự ghi là kinh nghiệm chung, không phải số từ nghiên cứu cụ thể. Tôi **không** tái khẳng định chúng ở đây.

### 7.3 Những thứ tôi đã chủ động bỏ

- **arXiv 2509.15640** (*Multilingual LLM Prompting Strategies for Medical English-Vietnamese MT*): bản v2 mang ghi chú của tác giả rằng bài **đã bị rút sau khi có kết quả phản biện hội nghị**, và đang được viết lại. Tôi đã đọc ghi chú này trực tiếp trên arXiv. **Không trích bất kỳ kết quả nào** của bài — dù nó rất đúng chủ đề.
- **Mọi bảng xếp hạng "hệ thống X tốt nhất"** mà tôi không mở được bảng gốc để đối chiếu **đánh giá người** so với **đánh giá tự động**. Sau trường hợp Shy-hunyuan-MT (§1.4), tôi coi mọi bảng xếp hạng chỉ-tự-động là **không đủ** để nói "ai thắng".
- **arXiv 2508.14909** — bản xếp hạng tự động sơ bộ của WMT25. `04-dich-may.md` đã cảnh báo đúng về bản này; tôi **không** dùng nó, chỉ dùng [2025.wmt-1.22](https://aclanthology.org/2025.wmt-1.22/).
- **Các con số chi tiết của WMT25 Terminology Track 2** (bảng MQM theo GPT-4o và GPT-5): tôi có đọc Bảng 8 nhưng **không trích số**, vì chính bài báo ghi rõ trong mục Outlook rằng **AutoMQM cấp tài liệu chưa được kiểm chứng đối chiếu với đánh giá của người**. Trích số từ một thước đo chưa được kiểm chứng sẽ là đúng loại sai lầm mà file này đang cảnh báo.
- **Mọi khẳng định về tình hình sau tháng 11/2025** (ngoài vài preprint arXiv 2026 đã ghi rõ là preprint). WMT26 và IWSLT 2026, nếu đã diễn ra tính tới 2026-09-18, **không** nằm trong bản khảo sát này.

### 7.4 Ba câu hỏi bạn nên tự kiểm trước khi dùng file này

1. **WMT26 đã có kết quả chưa?** Kiểm `www2.statmt.org` và ACL Anthology. Nếu có, các kết luận ở §1 cần đọc lại.
2. **Kết quả "chrF thắng metric nơ-ron ở mức đoạn" của WMT25 có được lặp lại ở kỳ sau không?** Nếu có, đó là một thay đổi lớn về hiểu biết. Nếu không, nó là hiện vật của tập test năm 2025. **Chưa ai biết** tính đến ngày soạn file này.
3. **PhoMT có còn gated không?** Điều khoản có thể đổi. Kiểm lại trước khi lập kế hoạch dựa vào nó.
