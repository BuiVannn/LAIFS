# 06 — Kỹ năng làm nghiên cứu: khảo sát và đề xuất cho LAIFS

> Ngày: **2026-09-18**. Mọi khẳng định về "hiện trạng" đều tính tới ngày này.
> Nối tiếp: `01-cach-hoc.md` (đặc biệt D2 *implement from scratch*, D3 *đọc paper*, tính năng F16) và `03-kien-truc.md` (giai đoạn G1, khu `nghien-cuu`, route `/[khu]/[...id]`).
> **Không** bàn nội dung dịch máy — xem `04-dich-may.md`.
> Phạm vi: kỹ năng **làm** nghiên cứu (đọc, tái lập, thiết kế thí nghiệm, ghi chép, viết, theo dõi ngành) và cách đưa vào web.

## Cách đọc

**Mức tin cậy** (giữ nguyên thang của 01):

| Mức | Nghĩa trong file này |
|---|---|
| **A** | Có nghiên cứu thực nghiệm đo đạc trực tiếp trên tập paper thật (khảo sát, replication study) |
| **B** | Quy tắc do hội nghị lớn ban hành và bắt buộc/khuyến nghị áp dụng — là *chuẩn cộng đồng*, không phải kết quả thí nghiệm |
| **C** | Hướng dẫn kinh nghiệm của chuyên gia, không có đối chứng |

**Quy tắc kiểm chứng đã áp dụng**: mọi link trong file đều được gọi `curl -sI -L -o /dev/null -w '%{http_code}'` ngày 2026-09-18 — mã trạng thái nằm ở **mục 8**. Mọi tóm tắt nội dung tài liệu đều dựa trên việc tải và đọc chính tài liệu đó (PDF/HTML), không dựa vào đoạn trích của máy tìm kiếm. Chỗ không đọc được thì ghi **[chưa xác minh]**.

---

## 0. Trả lời nhanh

| Câu hỏi | Trả lời ngắn |
|---|---|
| Dạy đọc paper theo phương pháp nào? | **Ba lượt của Keshav (2007)**, có nguồn gốc rõ, kèm "năm chữ C" của lượt 1. Mức C (bài hướng dẫn, không phải thực nghiệm) — nói thẳng điều đó với người học. |
| Bài tập nghiên cứu tốt nhất cho người tự học? | **Tái lập** một kết quả nhỏ. Chính Keshav định nghĩa lượt đọc thứ ba là "hầu như cài lại bài báo trong đầu" — tái lập bằng code là phiên bản có kiểm chứng được của lượt 3. |
| Có checklist chính thức để dạy không? | **Có 3 cái đang chạy thật**: NeurIPS Paper Checklist (16 mục, bắt buộc, thiếu là desk-reject), ARR Responsible NLP Research (A1–E1, thiếu hệ thống là desk-reject), ML Reproducibility Checklist v2.0 của Pineau. Cả ba **miễn phí, đọc công khai**. |
| Dạy thống kê ở mức nào? | Chỉ hai thứ: **bootstrap** (khoảng tin cậy) và **paired test** (so hai hệ trên cùng tập test). Đủ cho 95% tình huống người học gặp, và đúng khuyến nghị của Dror et al. (2018). |
| Công cụ theo dõi thí nghiệm nào? | Bắt đầu bằng **file CSV + Git**. Khi cần hơn: **MLflow** (Apache-2.0) hoặc **Aim** (Apache-2.0), tự host, 0 đ. Không cần W&B cho web phi thương mại. |
| Papers with Code còn dùng được không? | **Không.** `paperswithcode.com` hiện chuyển hướng 100% sang `huggingface.co/papers/trending` (kiểm 2026-09-18). Phải sửa mọi tài liệu còn nhắc nó như site sống. |
| Đặt nhánh "Nghiên cứu" ở tầng nào? | **Không phải tầng nào cả** — nó là **khu** `nghien-cuu` theo đúng thiết kế mục 6.1 của 03. Chỉ **2 khái niệm** thật sự thuộc lộ trình và nằm ở **tầng 2**, cạnh `train-val-test` và `danh-gia-mo-hinh`. |

---

## 1. Đọc bài báo

### 1.1 Ba lượt đọc — nguồn gốc và nội dung thật

**Nguồn gốc.** Phương pháp "three-pass" là của **S. Keshav**, *How to Read a Paper*, ACM SIGCOMM Computer Communication Review, tập 37 số 3 (tháng 7/2007), doi:10.1145/1273445.1273458. Tác giả ở David R. Cheriton School of Computer Science, University of Waterloo. Trong mục Acknowledgments, Keshav ghi rõ **bản đầu tiên do ba sinh viên của ông soạn**: Hossein Falaki, Earl Oliver, Sumair Ur Rahman. Bài tự nhận là "living document" và mời góp ý qua email. Đây là **bài hướng dẫn kinh nghiệm, không phải nghiên cứu thực nghiệm** — mức **C**. (Đã đọc toàn văn bản PDF ở mirror Stanford; trang DOI của ACM trả 403 khi gọi bằng curl, xem mục 8.)

Keshav tự dẫn nguồn của mình: Roscoe (viết review), Schulzrinne (viết bài kỹ thuật), Whitesides (viết paper), Simon Peyton Jones (kỹ năng nghiên cứu nói chung) — tức là bản thân bài này nằm trong một chuỗi hướng dẫn nghề, không phải phát minh riêng lẻ.

**Nội dung thật của ba lượt** (tóm từ bản gốc, không diễn giải thêm):

| Lượt | Thời gian Keshav nêu | Làm gì | Ra khỏi lượt với cái gì |
|---|---|---|---|
| 1 | 5–10 phút | Đọc kỹ tiêu đề, abstract, mở đầu; đọc **tiêu đề mục và tiểu mục**, bỏ qua phần còn lại; đọc kết luận; lướt danh mục tham khảo, đánh dấu bài đã đọc | Trả lời được **năm chữ C**: **Category** (loại bài: đo đạc? phân tích hệ có sẵn? mô tả nguyên mẫu?), **Context** (liên quan bài nào, dùng nền lý thuyết nào), **Correctness** (giả định có hợp lý không), **Contributions** (đóng góp chính), **Clarity** (viết có tốt không) |
| 2 | tối đa 1 giờ | Đọc kỹ nhưng **bỏ qua chứng minh**; ghi chú lề; **nhìn kỹ hình và đồ thị** — trục có ghi nhãn không, kết quả có thanh sai số không; đánh dấu tài liệu tham khảo chưa đọc cần đọc thêm | Tóm tắt lại được luận điểm chính kèm bằng chứng cho người khác nghe |
| 3 | 4–5 giờ với người mới, ~1 giờ với người có kinh nghiệm | **"Hầu như cài lại bài báo"**: lấy cùng giả định như tác giả, tự tái tạo công trình, rồi so bản tái tạo với bản thật; nghi ngờ **từng giả định trong từng câu**; nghĩ xem mình sẽ trình bày ý đó thế nào | Dựng lại được toàn bộ cấu trúc bài từ trí nhớ; chỉ ra được **giả định ngầm**, **trích dẫn còn thiếu**, **vấn đề trong kỹ thuật thí nghiệm** |

Hai câu đáng dạy nguyên văn (dịch): (a) *"Khi bạn viết bài, hãy chờ đợi rằng đa số người phản biện và người đọc chỉ đọc một lượt"* — nên tiêu đề mục và abstract phải tự đứng được; (b) *"Nếu người đọc không nắm được điểm nổi bật sau năm phút, bài đó gần như sẽ không bao giờ được đọc"*.

Keshav còn có phần 3 về **khảo sát tài liệu** (đọc kỹ trong 6.2 dưới đây): tìm 3–5 bài gần đây → đọc lượt 1 từng bài → đọc phần *related work* của chúng → tìm trích dẫn và tên tác giả **lặp lại nhiều lần** → vào trang web các tác giả đó xem họ đăng ở đâu → vào kỷ yếu các hội nghị đó.

### 1.2 Đọc phần thí nghiệm để phát hiện khẳng định quá mức

Đây là phần **có bằng chứng thực nghiệm** (mức A), khác hẳn mục 1.1. Bốn công trình đã đọc abstract/nội dung trực tiếp:

**Lipton & Steinhardt (2018), *Troubling Trends in Machine Learning Scholarship*** (arXiv:1807.03341, trình bày tại ICML 2018: The Debates). Bốn mẫu hình hỏng, dịch sát abstract:
1. **Không phân biệt giải thích với suy đoán** — viết phỏng đoán bằng giọng kết luận.
2. **Không chỉ ra được nguồn thật của mức cải thiện** — "nhấn mạnh những thay đổi kiến trúc không cần thiết trong khi mức tăng thực ra đến từ việc dò siêu tham số".
3. **"Mathiness"** — dùng toán để gây ấn tượng hoặc làm mờ, trộn lẫn khái niệm kỹ thuật với khái niệm phi kỹ thuật.
4. **Lạm dụng ngôn ngữ** — chọn thuật ngữ có hàm ý đời thường, hoặc chất thêm nghĩa mới lên thuật ngữ đã có.

**Musgrave, Belongie & Lim (2020), *A Metric Learning Reality Check*** (arXiv:2003.08505). Đã đọc mục 2 của bản PDF. Abstract: các bài deep metric learning bốn năm liền tuyên bố tiến bộ lớn, "đôi khi hơn gấp đôi so với phương pháp cũ mười năm"; kiểm lại thì **"mức cải thiện thực tế là không đáng kể"**. Hai lỗi cụ thể, rất đáng làm ví dụ giảng dạy:
- **So sánh không công bằng (2.1)**: kiến trúc mạng nền không được giữ cố định giữa các bài — bài này dùng GoogleNet, bài kia BN-Inception, "một bài được trích dẫn rộng rãi từ 2017 dùng ResNet50 rồi tuyên bố mức tăng lớn". Vì mạng được tiền huấn luyện trên ImageNet, độ chính xác **khởi điểm** đã khác nhau. Số chiều không gian embedding cũng bị đổi giữa các bài, mà tăng số chiều thì tăng độ chính xác.
- **Huấn luyện có phản hồi từ tập test (2.2)**: đa số bài chia 50% lớp đầu làm train, phần còn lại làm test, rồi **kiểm độ chính xác trên tập test định kỳ trong lúc huấn luyện và báo cáo kết quả tốt nhất**. Tức là **không có tập validation**; chọn mô hình và dò siêu tham số lấy phản hồi trực tiếp từ test. Musgrave gọi đây là phá "một trong những điều răn cơ bản nhất của học máy".

**Melis, Dyer & Blunsom (2018), *On the State of the Art of Evaluation in Neural Language Models*** (arXiv:1707.05589). Các kiến trúc RNN mới liên tục lập "state of the art", nhưng được đánh giá trên **các code base khác nhau và ngân sách tính toán hạn chế** — đó là "nguồn biến thiên thí nghiệm không được kiểm soát". Khi đánh giá lại bằng dò siêu tham số hộp đen quy mô lớn, kết luận là **LSTM chuẩn, nếu được regularize đúng, vượt các mô hình mới hơn**.

**Lucic et al. (2018), *Are GANs Created Equal? A Large-Scale Study*** (arXiv:1711.10337, NeurIPS 2018). "Hầu hết các mô hình đạt điểm tương đương nhau nếu được tối ưu siêu tham số và khởi động lại ngẫu nhiên đủ nhiều" → cải thiện có thể đến từ **ngân sách tính toán và việc tinh chỉnh**, chứ không từ thay đổi thuật toán. Không tìm thấy bằng chứng thuật toán nào liên tục thắng GAN non-saturating gốc.

**Sáu câu hỏi để hỏi phần thí nghiệm** (rút từ bốn bài trên, dùng làm checklist dạy được):

1. Baseline được huấn luyện bằng **cùng** kiến trúc nền, cùng số tham số, cùng dữ liệu tiền huấn luyện chưa?
2. Baseline được dò siêu tham số **bằng ngân sách bằng** với phương pháp mới chưa? Hay baseline lấy số từ bài cũ?
3. Kết quả là **một lần chạy** hay trung bình nhiều seed? Nếu là "tốt nhất trong N lần" thì N bằng bao nhiêu?
4. Có tập validation riêng không, hay siêu tham số được chọn bằng điểm test?
5. Mức cải thiện có lớn hơn **dao động giữa các seed** không?
6. Câu "vì X nên Y" trong bài là **kết quả đo được** hay **suy đoán của tác giả**? (Lipton mẫu 1)

### 1.3 Đọc bảng kết quả

Thứ tự đọc một bảng, trước khi nhìn số in đậm:

1. **Đọc caption và chú thích trước.** Số này là accuracy hay F1? Trên tập nào — validation hay test? Cao hơn là tốt hơn hay ngược lại?
2. **Tìm đơn vị của độ lệch.** NeurIPS Paper Checklist mục 7 yêu cầu nói rõ thanh sai số **là độ lệch chuẩn hay sai số chuẩn của trung bình**, và **tính bằng cách nào** (công thức đóng, gọi hàm thư viện, hay bootstrap). Bảng không nói → coi như chưa biết.
3. **Tìm nguồn biến thiên.** Vẫn mục 7: thanh sai số đang bắt biến thiên **nào** — chia train/test, khởi tạo, rút ngẫu nhiên tham số, hay toàn bộ lần chạy? Cùng con số ±0,3 mà nguồn khác nhau thì nghĩa khác hẳn.
4. **Đối chiếu cột baseline với bài gốc của baseline đó.** Nếu thấp hơn số công bố ban đầu → baseline bị huấn luyện yếu.
5. **Đếm số chỗ in đậm.** Phương pháp mới thắng ở 2/9 cột mà abstract viết "vượt trội" là dấu hiệu Lipton mẫu 1.
6. **Cảnh báo phân phối lệch**: mục 7 NeurIPS nhắc riêng — với phân phối bất đối xứng, đừng vẽ thanh sai số đối xứng vì sẽ cho ra giá trị **ngoài miền hợp lệ** (ví dụ tỉ lệ lỗi âm).

### 1.4 Kiểm nhanh một bài có tái lập được không

Ba câu, trả lời trong 10 phút, dùng chính ngôn ngữ của hai checklist chính thức (chi tiết ở mục 2.3):

| Kiểm | Tìm ở đâu | Chuẩn của hội nghị nói gì |
|---|---|---|
| **Có code không?** | Link trong abstract/footnote trang 1, mục "Reproducibility", phụ lục | NeurIPS mục 5: hỏi có kèm "code, data, và **hướng dẫn** cần để tái lập kết quả chính không"; hướng dẫn phải chứa **câu lệnh chính xác và môi trường**. NeurIPS **không bắt buộc** thả code, nhưng bắt buộc phải có *một con đường nào đó* để tái lập (mục 4) |
| **Có seed không?** | Mục experimental setup, phụ lục, file config trong repo | ARR C3: phải rõ kết quả là **một lần chạy, max qua N seed, hay trung bình**. Sandve et al. Rule 6: "với phân tích có yếu tố ngẫu nhiên, ghi lại seed" |
| **Có ngân sách tính toán không?** | Mục setup hoặc phụ lục "Compute" | ARR C1: **số tham số mô hình + tổng ngân sách tính toán (ví dụ GPU-giờ) + hạ tầng**, và **phải tính cả các lần chạy không vào bài**. NeurIPS mục 8: loại máy (CPU/GPU, cụm nội bộ hay cloud), bộ nhớ, lưu trữ, thời gian **mỗi lần chạy** lẫn **tổng**, và phải nói rõ nếu cả dự án tốn nhiều tính toán hơn phần báo cáo (thí nghiệm sơ bộ, thí nghiệm thất bại) |

Bài trả lời "không" cả ba không nhất thiết là bài dở — nhưng **không nên chọn nó làm bài tập tái lập đầu tiên**.

---

## 2. Tái lập kết quả

### 2.1 Vì sao tái lập là bài tập học tốt nhất

- **Chính định nghĩa của lượt đọc thứ ba.** Keshav: lượt 3 là "virtually re-implement the paper... so sánh bản tái tạo với bản thật thì chẳng những thấy được cái mới của bài, mà còn thấy **những chỗ hỏng và giả định ngầm**". Tái lập bằng code chỉ là biến lượt 3 từ việc trong đầu thành việc **có thể kiểm chứng đúng/sai**.
- **Khớp nguyên lý đã khảo sát ở 01.** Đây là dạng cực đoan của *implement from scratch* (01/D2) và của tự giải thích ở mức Constructive (01/A5): người học phải tự sinh ra mọi chi tiết mà bài báo bỏ sót.
- **Phản hồi khách quan.** Khác bài tập tự chấm, tái lập có một con số để đối chiếu: hoặc bạn ra gần số của tác giả, hoặc không. Khi không, việc **tìm ra vì sao lệch** mới là bài học thật.
- **Có sân chơi thật.** Xem MLRC ở 2.3 — người học không tự tập một mình.

**Cảnh báo cần nói trước với người học**: thất bại khi tái lập là **kết quả bình thường và có giá trị**, không phải lỗi của người học. Kapoor & Narayanan (2022, arXiv:2207.07048, *Leakage and the Reproducibility Crisis in ML-based Science*) khảo sát tài liệu và tìm thấy **17 lĩnh vực có lỗi rò rỉ dữ liệu, ảnh hưởng tổng cộng 329 bài báo**, có trường hợp dẫn tới kết luận lạc quan quá mức; họ đưa ra phân loại **8 kiểu rò rỉ**.

### 2.2 Bốn cấp độ tái lập

Thang này để LAIFS xếp độ khó bài tập; cấp 0 nên là bài tập bắt buộc trước khi cho làm cấp 2.

| Cấp | Việc | Thời gian ước | Học được gì | Cái bẫy hay gặp |
|---|---|---|---|---|
| **0. Chạy lại** | Clone repo tác giả, chạy đúng lệnh trong README, xem số có khớp bảng không | 1–3 giờ (nếu repo tốt) | Kỹ năng môi trường: phiên bản thư viện, CUDA, dữ liệu tải ở đâu | Repo chạy được nhưng số không khớp → phải đọc kỹ xem bảng nào ứng với lệnh nào. ML Reproducibility Checklist yêu cầu README có **bảng kết quả kèm câu lệnh chính xác sinh ra kết quả đó** — repo nào không có là repo chưa đạt chuẩn |
| **1. Viết lại từ mô tả** | Không nhìn code tác giả, chỉ đọc bài, tự cài lại, so số | 1–3 ngày cho mô hình nhỏ | Phát hiện chỗ bài báo **mô tả thiếu** (khởi tạo? thứ tự chuẩn hoá? tiền xử lý?) | Dễ nản. Cách chữa: cho phép nhìn code sau khi đã tự viết xong và ghi lại **danh sách chỗ mình đoán khác tác giả** — chính danh sách đó là sản phẩm học tập |
| **2. Đổi điều kiện** | Giữ nguyên cài đặt, đổi **một** thứ: seed khác, dữ liệu khác, ngôn ngữ khác, kích thước nhỏ hơn | 1–2 ngày | Kết luận của bài có **bền** không, hay chỉ đúng trên đúng một cấu hình | Đổi hai thứ cùng lúc → không quy được nguyên nhân. Đây là bài học kiểm soát biến của mục 3 |
| **3. Tái lập lệch (negative result)** | Ghi lại và công bố trường hợp **không** tái lập được, kèm đủ chi tiết để người khác kiểm | vài ngày | Viết báo cáo khoa học thật | Phải cẩn thận với giọng văn: báo cáo "tôi không tái lập được với cấu hình X" khác hẳn "bài báo sai" |

### 2.3 Các checklist tái lập đang được dùng ở hội nghị lớn

Cả ba đều **đọc công khai, miễn phí**, và đều đã được tải về đọc trực tiếp ngày 2026-09-18.

**(a) NeurIPS Paper Checklist** — `https://neurips.cc/public/guides/PaperChecklist` (trang đang ở phiên bản **2026**). Mức **B**.
- Nằm trong **file style LaTeX**; **bỏ checklist ra là bị desk-reject**. Nộp dạng PDF duy nhất theo thứ tự: (1) bài, (2) phụ lục kỹ thuật tuỳ chọn, (3) checklist. **Không tính vào giới hạn trang.**
- Mỗi mục trả lời **yes / no / n/a**, kèm giải thích ngắn 1–2 câu và số mục trong bài. Câu trả lời **hiển thị cho reviewer, AC, SAC và ethics reviewer**, và **được công bố cùng bài** ở bản cuối.
- Nguyên tắc đáng dạy: **"no" có lý do chính đáng thì chấp nhận được** — trang nêu ví dụ nguyên văn "không báo thanh sai số vì quá tốn tính toán" và "chúng tôi không tìm được license của tập dữ liệu". Trả lời "no"/"n/a" **tự nó không phải căn cứ từ chối bài**.
- **16 mục**: 1 Claims · 2 Limitations · 3 Theory, Assumptions and Proofs · 4 Experimental Result Reproducibility · 5 Open Access to Data and Code · 6 Experimental Setting/Details · 7 Experiment Statistical Significance · 8 Experiments Compute Resource · 9 Code of Ethics · 10 Broader Impacts · 11 Safeguards · 12 Licenses · 13 Assets · 14 Crowdsourcing and Research with Human Subjects · 15 IRB Approvals · 16 Declaration of LLM usage.
- Mục 16 (LLM) đáng chú ý: **chỉ phải khai báo khi LLM là thành phần quan trọng, mới, hoặc bất thường của phương pháp lõi**; dùng LLM để viết/sửa/định dạng thì **không cần khai**.
- Mục 2 (Limitations) có đoạn nên dịch nguyên cho người học: tác giả sợ thành thật về hạn chế sẽ bị đánh rớt, nhưng "kết cục tệ hơn là reviewer **tự phát hiện** ra hạn chế mà bài không nhắc" — và reviewer được chỉ thị rõ **không phạt sự thành thật về hạn chế**.

**(b) ARR Responsible NLP Research checklist** (ACL Rolling Review, cửa ngõ nộp bài của ACL/NAACL/EMNLP) — `https://aclrollingreview.org/responsibleNLPresearch/`. Mức **B**.
- Trang tự khai nguồn gốc: dựa chủ yếu trên **NeurIPS 2021 paper checklist**, trên checklist dữ liệu của **Rogers, Baldwin & Leins (EMNLP 2021)**, và trên **NLP Reproducibility Checklist** dựng từ **Dodge et al. (EMNLP 2019), *Show Your Work***. Soạn bởi Marine Carpuat, Marie-Catherine de Marneffe, Ivan Vladimir Meza Ruiz (program chairs NAACL 2022) cùng Jesse Dodge; **cập nhật cho chu kỳ ARR tháng 10/2024 bởi Anna Rogers**.
- Điền **trong form nộp bài** (trước tháng 2/2024 thì nộp thành PDF riêng). **Bài liên tục bỏ trống các mục liên quan sẽ bị desk-reject.**
- **19 mục, 5 nhóm**:
  - **A (mọi bài)**: A1 hạn chế · A2 rủi ro.
  - **B (dùng/tạo artifact)**: B1 trích dẫn người tạo · B2 license & điều kiện dùng (ghi **tên license**, ví dụ CC-BY 4.0) · B3 dùng có đúng mục đích đã nêu không · B4 kiểm dữ liệu có thông tin định danh cá nhân/nội dung xúc phạm không · B5 tài liệu hoá artifact (miền, ngôn ngữ, nhóm nhân khẩu) · B6 thống kê dữ liệu, chi tiết chia train/test/dev.
  - **C (có thí nghiệm tính toán)**: C1 số tham số + tổng ngân sách + hạ tầng · C2 thiết lập thí nghiệm, quá trình dò siêu tham số **và giá trị tốt nhất tìm được** · C3 thống kê mô tả/thanh sai số và nói rõ đang báo max hay mean hay một lần chạy · C4 phiên bản/cấu hình của thư viện dùng sẵn.
  - **D (có người tham gia/gán nhãn)**: D1 toàn văn hướng dẫn cho người gán nhãn · D2 cách tuyển và **mức trả công, có đủ sống không** · D3 đồng thuận · D4 phê duyệt của hội đồng đạo đức · D5 đặc điểm nhân khẩu/địa lý của nhóm gán nhãn.
  - **E**: E1 khai báo dùng trợ lý AI, phải phù hợp **chính sách đạo đức xuất bản của ACL**, đặc biệt về tiêu chuẩn quyền tác giả.
- Ba câu trong C đáng dạy nguyên văn: **"trừ trường hợp đặc biệt, siêu tham số không được tinh chỉnh trên tập đánh giá (held-out)"**; **"báo cả kết quả của các lần chạy bị dừng sớm hoặc không cho kết quả tốt nhất"**; **"khi báo kết quả trên tập test, hãy báo kèm kết quả của cùng mô hình đó trên tập validation, để người tái lập không phải chạm vào tập test"**.

**(c) The Machine Learning Reproducibility Checklist v2.0** (Joelle Pineau, 07/04/2020) — `https://www.cs.mcgill.ca/~jpineau/ReproducibilityChecklist.pdf`. Mức **B**. Đây là bản gốc mà NeurIPS và ARR đều kế thừa. Đã đọc toàn văn PDF; **5 nhóm**:
- *Mô hình & thuật toán*: mô tả toán học rõ; giả định rõ; phân tích độ phức tạp (thời gian, bộ nhớ, cỡ mẫu).
- *Khẳng định lý thuyết*: phát biểu rõ; chứng minh đầy đủ.
- *Dữ liệu*: thống kê (số mẫu); chi tiết chia train/validation/test; giải thích dữ liệu bị loại và mọi bước tiền xử lý; **link tải được**; với dữ liệu tự thu: mô tả đầy đủ quy trình thu, gồm hướng dẫn cho người gán nhãn và cách kiểm soát chất lượng.
- *Code*: khai báo dependency; code huấn luyện; code đánh giá; mô hình đã huấn luyện; **README có bảng kết quả kèm câu lệnh chính xác tạo ra chúng**.
- *Kết quả thí nghiệm*: khoảng siêu tham số đã thử + cách chọn cấu hình tốt nhất + mọi giá trị đã dùng; **số lần huấn luyện và đánh giá chính xác**; định nghĩa rõ thước đo; **xu hướng trung tâm (mean) kèm biến thiên (thanh sai số)**; thời gian chạy trung bình hoặc ước tính chi phí năng lượng; mô tả hạ tầng tính toán.
- PDF còn gợi ý vận hành: mỗi câu nên có **2 ô trả lời** — ô phân loại {Yes, No, Not applicable} và ô bình luận tự do; và nên bắt nộp checklist **sớm hơn hạn nộp bài ~1 tuần** (cùng hạn nộp abstract) để không bị làm vội.
- Báo cáo đánh giá chương trình này: Pineau et al. (2021), *Improving Reproducibility in Machine Learning Research (A Report from the NeurIPS 2019 Reproducibility Program)*, **JMLR 22(164):1−20** — mô tả ba cấu phần: chính sách nộp code, cuộc thi tái lập toàn cộng đồng, và việc đưa checklist vào quy trình nộp bài.

**(d) Nơi để nộp kết quả tái lập.**
- **ML Reproducibility Challenge (MLRC)** — `https://reproml.org/`. Kiểm ngày 2026-09-18: trang đang chạy **MLRC 2026**, và **là một track chính thức của NeurIPS 2026** (tháng 12/2026, Sydney). Hạn mềm 04/06/2026 đã qua nhưng vẫn nhận bài; hạn cứng tự đề cử bài TMLR là **30/09/2026**. Sự kiện thường niên, đã qua 8 phiên bản (v1–v8, từ ICLR 2018).
- **ReScience C** — `https://rescience.github.io/`. Tạp chí **platinum open-access, bình duyệt**, chuyên đăng **bản cài lại** của nghiên cứu đã công bố. Toàn bộ quy trình chạy trên GitHub: mỗi bài nộp là một **issue**, được bình duyệt và chạy thử công khai. Tuyên bố thẳng: *"nếu bạn từng tái lập (hoặc thất bại khi tái lập) kết quả tính toán từ tài liệu, ReScience C là nơi phù hợp để đăng bản cài lại của bạn"*. Miễn phí cả hai chiều (platinum = không thu phí tác giả, không thu phí đọc).

---

## 3. Thiết kế thí nghiệm

### 3.1 Baseline

- **Baseline phải là baseline mạnh nhất bạn dựng được, không phải yếu nhất bạn chấp nhận được.** Melis et al. (2018) là bằng chứng: LSTM "cũ" khi được regularize và dò siêu tham số đúng mức thì vượt các kiến trúc mới hơn — nghĩa là nhiều "tiến bộ" trước đó chỉ là baseline bị bỏ bê.
- **Ba baseline luôn phải có** trong mọi bài tập của LAIFS: (1) **đoán đa số / đoán trung bình** — cho biết sàn; (2) **mô hình tuyến tính đơn giản nhất** — cho biết bài toán có thật sự cần mô hình sâu không; (3) **phương pháp đang dùng trong bài gốc**, chạy lại bởi chính bạn.
- **Không lấy số baseline từ bài khác** trừ khi mọi điều kiện y hệt. Musgrave 2.1 là phản ví dụ kinh điển: đổi mạng nền từ GoogleNet sang ResNet50 rồi quy mức tăng cho thuật toán mới.

### 3.2 Ablation

Ablation = bỏ **một** thành phần, giữ mọi thứ khác nguyên, đo lại. Mục đích là trả lời đúng câu hỏi mà Lipton mẫu 2 nói mọi người hay né: **mức cải thiện đến từ đâu?**

Quy tắc làm ablation dùng được:
1. Liệt kê thành phần bạn **thêm vào** so với baseline (ví dụ: chuẩn hoá mới + hàm mất mát mới + tăng cường dữ liệu = 3 thành phần).
2. Chạy baseline, chạy bản đầy đủ, rồi chạy **bản đầy đủ trừ đi từng thành phần một**. Với 3 thành phần là 5 cấu hình, không phải 8 — không cần toàn bộ tổ hợp trừ khi nghi có tương tác.
3. Mỗi cấu hình chạy **cùng số seed** như nhau.
4. Thành phần nào bỏ đi mà điểm **không giảm quá dao động seed** thì **không được tính là đóng góp**.

### 3.3 Kiểm soát biến

Danh sách những thứ phải giữ cố định khi so hai phương pháp (rút từ Musgrave 2.1 và ARR C1–C2):

| Nhóm | Phải giữ nguyên |
|---|---|
| Mô hình | Kiến trúc nền, số tham số, trọng số tiền huấn luyện, số chiều biểu diễn |
| Dữ liệu | Cùng tập, cùng cách chia, cùng tiền xử lý, cùng tăng cường dữ liệu |
| Huấn luyện | Số epoch/bước, batch size, bộ tối ưu, lịch learning rate — **hoặc**, nếu phải khác, thì dò siêu tham số cho cả hai bên với ngân sách bằng nhau |
| Đánh giá | Cùng thước đo, cùng cài đặt thư viện đo (ARR C4: **các cài đặt khác nhau của cùng một thước đo cho ra số khác nhau** — bản thân ARR lấy ROUGE làm ví dụ) |
| Môi trường | Cùng phiên bản thư viện; ghi lại phiên bản |

### 3.4 Seed và độ lệch

Đây là mục có bằng chứng thực nghiệm mạnh nhất trong phần này (mức **A**).

- **Reimers & Gurevych (2017), *Reporting Score Distributions Makes a Difference*** (EMNLP 2017, aclanthology D17-1035). Đã đọc abstract: với các bài toán gán nhãn chuỗi thông dụng, **chỉ riêng giá trị seed của bộ sinh số ngẫu nhiên đã tạo ra khác biệt có ý nghĩa thống kê (p < 10⁻⁴)** giữa các hệ hiện đại. Với hai hệ NER gần đây, họ quan sát **chênh lệch tuyệt đối tới 1 điểm phần trăm F₁ chỉ do seed** — đủ để cùng một hệ được nhìn nhận hoặc là "state of the art" hoặc là "tầm thường". Kết luận của bài: **đừng công bố một điểm số đơn lẻ, hãy so sánh phân phối điểm từ nhiều lần chạy.** (Nền tảng: đánh giá 50.000 mạng LSTM trên 5 bài toán.)
- **Bouthillier et al. (2021), *Accounting for Variance in Machine Learning Benchmarks*** (arXiv:2103.03098, MLSys 2021). Mô hình hoá toàn bộ quy trình benchmark và cho thấy biến thiên do **lấy mẫu dữ liệu, khởi tạo tham số và lựa chọn siêu tham số** đều ảnh hưởng rõ rệt tới kết quả. Kết quả phản trực giác đáng dạy: **thêm nhiều nguồn biến thiên vào một ước lượng không hoàn hảo lại tiến gần ước lượng lý tưởng hơn, với chi phí tính toán giảm 51 lần** — tức là "chạy 10 seed với mỗi seed đổi cả cách chia dữ liệu" tốt hơn "chạy 10 seed trên đúng một cách chia".
- **Henderson et al. (2018), *Deep Reinforcement Learning that Matters*** (arXiv:1709.06560, AAAI 2018). Tính bất định của môi trường benchmark cộng với phương sai nội tại của phương pháp khiến **kết quả công bố khó diễn giải**; không có thước đo ý nghĩa thống kê và chuẩn hoá báo cáo chặt hơn thì **không xác định được cải thiện có thật hay không**.

**Quy tắc tối thiểu cho LAIFS**: mọi bài tập có huấn luyện đều phải chạy **≥ 5 seed** và báo **trung bình ± độ lệch chuẩn**, nêu rõ đó là độ lệch chuẩn (không phải sai số chuẩn).

### 3.5 Kiểm định ý nghĩa thống kê ở mức dùng được

Chỉ dạy **hai** công cụ. Cơ sở: **Dror, Baumer, Shlomov & Reichart (2018), *The Hitchhiker's Guide to Testing Statistical Significance in Natural Language Processing*** (ACL 2018, aclanthology P18-1128). Bài này đề xuất **một giao thức đơn giản, thực dụng để chọn kiểm định**, kèm khảo sát ngắn các kiểm định liên quan nhất; và khi khảo sát các bài thực nghiệm đăng ở ACL và TACL trong năm 2017 thì thấy **kiểm định ý nghĩa thống kê thường bị bỏ qua hoặc dùng sai**. Bổ sung: **Berg-Kirkpatrick, Burkett & Klein (2012), *An Empirical Investigation of Statistical Significance in NLP*** (EMNLP 2012, aclanthology D12-1091).

| Công cụ | Dùng khi | Trả lời câu gì | Cài bằng gì |
|---|---|---|---|
| **Bootstrap phần trăm** | Có **một** hệ, muốn biết điểm của nó chắc tới đâu | "Khoảng tin cậy 95% của điểm này là bao nhiêu?" | Lấy mẫu có hoàn lại **các mẫu trong tập test** B = 10.000 lần, tính điểm mỗi lần, lấy phân vị 2,5% và 97,5%. ~15 dòng numpy |
| **Paired test (hoán vị / bootstrap ghép cặp)** | Có **hai** hệ chạy trên **cùng** tập test | "Chênh lệch này có thể do ngẫu nhiên không?" | Ghép cặp theo **từng mẫu** (hệ A và hệ B cùng mẫu i), hoán vị ngẫu nhiên nhãn A/B trong từng cặp B = 10.000 lần, đếm tỉ lệ lần chênh lệch hoán vị ≥ chênh lệch quan sát | 

**Bốn điều phải nói cùng lúc, không được tách:**
1. Ghép cặp là bắt buộc khi hai hệ chạy trên cùng tập test — bỏ ghép cặp làm mất sức mạnh kiểm định.
2. p-value **không** đo độ lớn của cải thiện. Luôn báo **khoảng tin cậy hoặc effect size** kèm theo.
3. Test nhiều lần thì phải hiệu chỉnh. So một phương pháp mới với 8 baseline = 8 kiểm định.
4. Kiểm định **không** cứu được một thiết kế hỏng. Nếu baseline bị huấn luyện yếu (3.1) thì p < 0,001 cũng vô nghĩa.

### 3.6 Cạm bẫy "chọn điểm tốt nhất"

Biểu hiện, theo mức độ nặng dần:

| Hành vi | Vì sao hỏng | Nguồn |
|---|---|---|
| Chạy 20 seed, báo seed tốt nhất, không nói là tốt nhất | Đang báo **cực đại của mẫu**, không phải kỳ vọng. Reimers cho thấy biên độ do seed đủ lớn để làm điều này "hiệu quả" | Reimers & Gurevych (2017); ARR C3 |
| Kiểm điểm test định kỳ trong lúc huấn luyện, báo điểm tốt nhất | Không còn tập test nữa — nó đã thành tập validation. "Phá một trong những điều răn cơ bản nhất của học máy" | Musgrave et al. (2020), mục 2.2 |
| Dò siêu tham số cho phương pháp mới nhiều hơn cho baseline | Đang đo ngân sách tính toán, không đo thuật toán | Lucic et al. (2018); Melis et al. (2018) |
| Chọn tập dữ liệu/thước đo **sau khi** đã xem kết quả | Chọn lọc kết quả có lợi | Lipton & Steinhardt (2018), mẫu 2 |
| Dùng một tập test công khai suốt nhiều năm | Cả cộng đồng dần overfit lên nó | Recht, Roelofs, Schmidt & Shankar (2019) |

Về mục cuối: **Recht et al. (2019), *Do ImageNet Classifiers Generalize to ImageNet?*** (ICML 2019, PMLR v97; arXiv:1902.10811) dựng **tập test mới** cho CIFAR-10 và ImageNet theo đúng quy trình gốc, và thấy độ chính xác **tụt 3–15% trên CIFAR-10 và 11–14% trên ImageNet**. Điểm tinh tế phải dạy kèm, nếu không sẽ hiểu sai bài: các tác giả kết luận mức tụt này **không phải do tính thích nghi (adaptivity/overfit lên tập test), mà do mô hình không tổng quát hoá được sang ảnh "khó hơn" một chút**; và mức tăng trên tập test gốc **vẫn chuyển thành mức tăng lớn hơn** trên tập mới.

**Cách chữa được khuyến nghị chính thức**: khai báo trước ("chúng tôi chạy N seed, báo trung bình"), và theo Dodge et al. (2019) thì báo **hiệu năng validation kỳ vọng của mô hình tốt nhất như một hàm của ngân sách tính toán**.

### 3.7 Tách validation khỏi test

- **Quy tắc**: tập test được chạm **đúng một lần**, sau khi mọi quyết định đã chốt trên validation. Mọi lần chạm thêm phải được khai báo.
- **ARR C2** nói thẳng: "trừ trường hợp đặc biệt, siêu tham số **không** được tinh chỉnh trên tập đánh giá (held-out)"; và phải **ghi rõ tập nào đã dùng để chọn siêu tham số**.
- **ARR C3** cho một mẹo vận hành đắt giá: khi báo kết quả test, **báo kèm kết quả của cùng mô hình đó trên validation**, để người tái lập không phải động vào tập test mới xác nhận được.
- **Chia chuẩn (standard split) cũng không an toàn.** **Gorman & Bedrick (2019), *We Need to Talk about Standard Splits*** (ACL 2019, aclanthology P19-1267): họ làm lại thí nghiệm với **9 bộ gán nhãn từ loại công bố giữa 2000 và 2018**, mỗi bộ đều từng tuyên bố state-of-the-art trên một "standard split" phổ biến. Kết quả: **tái hiện được thứ hạng trên standard split, nhưng không tái lập được một số thứ hạng khi lặp lại phân tích với các cách chia train/test sinh ngẫu nhiên**. Khuyến nghị của họ: **dùng cách chia ngẫu nhiên khi đánh giá hệ thống**.
- **Rò rỉ dữ liệu** là dạng hỏng nặng hơn: Kapoor & Narayanan (2022) đưa **phân loại 8 kiểu rò rỉ**, từ lỗi sách giáo khoa tới vấn đề nghiên cứu mở, và ghi nhận **329 bài ở 17 lĩnh vực** bị ảnh hưởng.

### 3.8 Ngân sách tính toán ngang nhau

- **Dodge, Gururangan, Card, Schwartz & Smith (2019), *Show Your Work: Improved Reporting of Experimental Results*** (EMNLP-IJCNLP 2019, aclanthology D19-1224). Đã đọc abstract: điểm trên tập test **một mình là không đủ** để kết luận mô hình nào tốt hơn. Họ đề xuất báo **hiệu năng validation kỳ vọng của mô hình tốt nhất tìm được, như một hàm của ngân sách tính toán** (số lượt thử siêu tham số, hoặc tổng thời gian huấn luyện). Dùng cách này, họ tìm được **nhiều so sánh mô hình gần đây mà tác giả sẽ đi tới kết luận khác nếu dùng nhiều (hoặc ít) tính toán hơn**. Phương pháp còn cho ước tính lượng tính toán cần để đạt một mức chính xác — và khi áp lên vài kết quả đã công bố thì thấy **biến thiên khổng lồ giữa các bài, từ vài giờ tới vài tuần**.
- **Quy tắc thực hành**: khi so A với B, ghi lại và cân bằng **số lượt thử siêu tham số**, chứ không chỉ số epoch. Nếu không cân bằng được thì phải **công bố ngân sách của từng bên** (ARR C1 bắt buộc, và nhắc phải tính cả các lần chạy không vào bài; NeurIPS mục 8 cũng yêu cầu khai nếu toàn dự án tốn nhiều hơn phần báo cáo).

---

## 4. Ghi chép và công cụ

### 4.1 Mười quy tắc nền

Sandve, Nekrutenko, Taylor & Hovig (2013), ***Ten Simple Rules for Reproducible Computational Research***, PLOS Computational Biology, 24/10/2013, doi:10.1371/journal.pcbi.1003285 — **open access, CC BY** (được phép dịch và đăng lại trên LAIFS nếu ghi nguồn). Mười quy tắc, đọc trực tiếp từ bài:

1. Với **mọi** kết quả, ghi lại nó được tạo ra như thế nào.
2. Tránh mọi bước thao tác dữ liệu bằng tay.
3. Lưu trữ **đúng phiên bản** của mọi chương trình ngoài đã dùng.
4. Đặt mọi script tự viết dưới quản lý phiên bản.
5. Ghi lại các kết quả trung gian, tốt nhất ở định dạng chuẩn.
6. Với phân tích có yếu tố ngẫu nhiên, **ghi lại seed**.
7. Luôn lưu **dữ liệu thô đằng sau mỗi đồ thị**.
8. Sinh đầu ra phân tích theo tầng, cho phép soi từng mức chi tiết.
9. Nối **câu chữ trong bài** với **kết quả** làm cơ sở cho câu đó.
10. Cho phép truy cập công khai vào script, các lần chạy và kết quả.

Quy tắc 7 và 9 là hai quy tắc ít người làm nhất và rẻ nhất để làm — đáng biến thành bài tập riêng.

### 4.2 Nhật ký thí nghiệm (mức thấp nhất, làm được ngay)

Một file `nhat-ky.md` trong repo, mỗi lần chạy một khối:

```
## 2026-09-18 14:02 — run 017
Giả thuyết: thêm dropout 0.3 sau lớp 2 sẽ giảm khoảng cách train/val.
Đổi so với run 016: chỉ dropout (0.0 -> 0.3). Không đổi gì khác.
Lệnh:   python train.py --config cfg/016.yaml --dropout 0.3 --seed 0,1,2,3,4
Commit: a3f91c2
Kết quả: val acc 0.812 ± 0.006 (5 seed) | run 016: 0.809 ± 0.011
Kết luận: KHÔNG kết luận được — chênh 0.003 nhỏ hơn độ lệch. Cần thêm seed hoặc bỏ ý này.
```

Năm trường bắt buộc: **giả thuyết viết trước khi chạy**, **đúng một thứ đã đổi**, **lệnh chạy nguyên văn**, **commit hash**, **kết luận kèm chữ "không kết luận được" khi đúng là vậy**. Trường thứ nhất là trường quan trọng nhất và hay bị bỏ nhất — nó là thứ chặn hành vi "chạy xong mới nghĩ ra vì sao mình chạy".

### 4.3 Quản lý cấu hình

- **Nguyên tắc**: không có siêu tham số nào nằm rải trong code. Mọi con số vào **một file config** (YAML/JSON), file config được commit, và **kết quả được đặt tên theo hash của config**.
- Quy tắc 3 của Sandve (lưu đúng phiên bản chương trình ngoài) ở Python là `requirements.txt` ghim phiên bản chính xác (`==`), hoặc file lock của `uv`/`poetry`.
- **Hydra** (`https://hydra.cc/`, repo `facebookresearch/hydra` — nay chuyển hướng tới `hydra-ecosystem/hydra`, **MIT**) làm được: gộp config theo nhóm, ghi đè từ dòng lệnh, và tự lưu config đã dùng vào thư mục output mỗi lần chạy. Miễn phí, không có bản trả tiền.

### 4.4 Theo dõi chạy thử — bảng công cụ, license và giá

Tất cả license lấy từ **GitHub API** (`spdx_id`) ngày 2026-09-18; "hoạt động gần nhất" là `pushed_at` cùng ngày kiểm.

| Công cụ | License | Giá | Hoạt động gần nhất | Ghi chú cho LAIFS |
|---|---|---|---|---|
| **File CSV + Git** | — | 0 đ | — | **Bắt đầu ở đây.** Với vài chục lần chạy, một file `ket-qua.csv` commit vào repo là đủ và đọc được 10 năm sau |
| **MLflow** (`mlflow/mlflow`) | **Apache-2.0** | Bản mã nguồn mở **miễn phí**, tự host `mlflow ui` tại máy. Bản quản lý trên Databricks tính phí — **[chưa xác minh]** mức giá | 2026-09-18 | Lựa chọn mặc định nếu cần hơn CSV. Lưu vào SQLite/thư mục, không cần server |
| **Aim** (`aimhubio/aim`) | **Apache-2.0** | Miễn phí, tự host | 2026-09-17 | Nhẹ hơn MLflow, giao diện so sánh nhiều lần chạy tốt |
| **TensorBoard** (`tensorflow/tensorboard`) | **Apache-2.0** | Miễn phí | 2026-08-24 | Dùng được độc lập với TensorFlow (PyTorch có `SummaryWriter`). Mạnh về đường cong, yếu về quản lý siêu tham số |
| **Sacred** (`IDSIA/sacred`) | **MIT** | Miễn phí | **2025-10-22** | Kinh điển trong học thuật nhưng **nhịp cập nhật đã chậm** — cân nhắc trước khi dạy |
| **ClearML** (`allegroai/clearml` → `clearml/clearml`) | **Apache-2.0** | Client mã nguồn mở miễn phí; server có bản SaaS với gói trả tiền — **[chưa xác minh]** mức giá | 2026-09-17 | Nhiều tính năng hơn nhu cầu của người tự học |
| **Weights & Biases** (`wandb/wandb`) | Client **MIT**; **dịch vụ là SaaS thương mại, mã nguồn đóng** | Có gói cá nhân/học thuật miễn phí — **[chưa xác minh]**: trang `wandb.ai/site/pricing/` trả 200 nhưng nội dung giá dựng bằng JavaScript, curl không đọc được | 2026-09-18 | **Không khuyến nghị cho LAIFS**: web phi thương mại lâu dài không nên phụ thuộc một dịch vụ mà điều khoản có thể đổi |

### 4.5 Quản lý phiên bản dữ liệu

| Công cụ | License | Giá | Ghi chú |
|---|---|---|---|
| **Git LFS** (`git-lfs/git-lfs`) | **MIT** (đọc trực tiếp `LICENSE.md`; GitHub API trả `NOASSERTION` do định dạng file) | Bản thân miễn phí; **dung lượng LFS trên GitHub có hạn mức và phần vượt phải trả tiền** — [chưa xác minh] hạn mức hiện tại | Đủ cho dữ liệu vài trăm MB |
| **DVC** (`iterative/dvc` — repo nay chuyển hướng tới `treeverse/dvc`) | **Apache-2.0** | Miễn phí, tự host; lưu trữ đặt ở bất kỳ đâu (thư mục, S3, Google Drive) | Ghi **hash của dữ liệu** vào Git, dữ liệu thật để ngoài. Đúng bài toán "đổi dữ liệu" ở cấp tái lập 2 |
| **Zenodo** (`zenodo.org`) | Dịch vụ của CERN | **Miễn phí**, cấp **DOI** vĩnh viễn | Nơi công bố dữ liệu/code kèm DOI trích dẫn được. ReScience C cũng cấp DOI qua Zenodo |
| **Hugging Face Datasets** | Thư viện `huggingface/datasets`: **Apache-2.0** | Hub có gói miễn phí | Tiện cho dữ liệu công khai; phụ thuộc một công ty |
| **OpenML** (`openml.org`) | — [chưa xác minh license nền tảng] | Miễn phí | Dữ liệu ML cổ điển kèm metadata chuẩn |

**Quy tắc tối thiểu nếu không dùng công cụ nào**: mỗi tập dữ liệu có một file `README` ghi **nguồn tải, ngày tải, license, số mẫu, và checksum SHA-256** của file. Ba dòng này chặn được đa số lỗi "tôi tưởng cùng dữ liệu".

### 4.6 Tổ chức repo nghiên cứu

Bố cục tối thiểu (đủ cho một bài tập tái lập, không hơn):

```
├── README.md          # bảng kết quả + ĐÚNG câu lệnh sinh ra từng dòng  (yêu cầu của ML Repro Checklist)
├── requirements.txt   # phiên bản ghim bằng ==
├── nhat-ky.md         # mục 4.2
├── cfg/               # config theo lần chạy: 001.yaml, 002.yaml...
├── data/
│   ├── README.md      # nguồn, ngày tải, license, số mẫu, SHA-256
│   └── raw/           # .gitignore — KHÔNG commit dữ liệu thô
├── src/               # code, không chứa siêu tham số hard-code
├── ket-qua/           # CSV thô đằng sau mọi đồ thị (Sandve Rule 7)
└── hinh/              # hình sinh bằng script, không sửa tay
```

Mẫu sẵn có: **Cookiecutter Data Science** (`drivendataorg/cookiecutter-data-science`, **MIT**, miễn phí, hoạt động 2026-08-07). Nó nặng hơn mức trên; chỉ giới thiệu như tham khảo, đừng bắt người mới dùng ngay.

**Hai quy tắc đáng nhấn**: (a) **hình phải sinh bằng script từ file trong `ket-qua/`** — không bao giờ sửa hình bằng tay, vì như vậy hình không tái lập được và Sandve Rule 7 bị phá; (b) **`data/raw/` không bao giờ vào Git** — dùng DVC hoặc chỉ ghi checksum.

---

## 5. Viết

### 5.1 Cấu trúc một bài báo

Nguồn chính: **Mensh & Kording (2017), *Ten simple rules for structuring papers***, PLOS Computational Biology, 28/09/2017, doi:10.1371/journal.pcbi.1005619 — **open access, CC BY**. Mười quy tắc (đọc trực tiếp tiêu đề mục trong bài):

*Nguyên tắc (1–4)*
1. Tập trung bài vào **một đóng góp trung tâm**, và truyền đạt nó **ngay trong tiêu đề**.
2. Viết cho **người bằng xương bằng thịt chưa biết công trình của bạn**.
3. Bám sơ đồ **Context – Content – Conclusion (C-C-C)**.
4. Tối ưu mạch lý lẽ bằng cách **tránh zig-zag** và **dùng cấu trúc song song**.

*Các thành phần (5–8)*

5. **Kể trọn câu chuyện trong abstract.**
6. Nói rõ **vì sao bài này đáng kể** trong phần mở đầu.
7. Trình bày kết quả như **một chuỗi phát biểu**, mỗi phát biểu được một hình chống đỡ, nối logic về đóng góp trung tâm.
8. Phần thảo luận: **khoảng trống đã được lấp thế nào**, **giới hạn của cách diễn giải**, và **liên quan gì tới ngành**.

*Quy trình (9–10)*

9. **Dồn thời gian vào nơi đáng dồn: tiêu đề, abstract, hình, và dàn ý.**
10. Xin phản hồi để **rút gọn, dùng lại và tái chế** câu chuyện.

Bổ sung: **Simon Peyton Jones, *How to Write a Great Research Paper*** (`https://simon.peytonjones.org/great-research-paper/`). Trang tự mô tả: bài nói đưa ra **bảy gợi ý đơn giản, cụ thể** để cải thiện bài báo; có slide PDF/PPT kèm lời cho phép dùng lại nếu ghi nguồn, và có bản dịch tiếng Ả Rập và tiếng Nhật do cộng đồng làm. **[chưa xác minh]** nội dung bảy gợi ý: file slide đặt trên `microsoft.com` và trả **403** khi tải bằng curl — không chép danh sách bảy mục vào đây vì chưa đọc được bản gốc.

### 5.2 Viết abstract

Áp Rule 3 + Rule 5 của Mensh & Kording thành khuôn năm câu:

| Câu | Vai trò (C-C-C) | Kiểm tra |
|---|---|---|
| 1 | **Context** — điều cả ngành đồng ý | Người ngoài chuyên ngành hẹp đọc có hiểu không? |
| 2 | **Context** — khoảng trống / vấn đề | Có đúng **một** khoảng trống không? |
| 3 | **Content** — bài này làm gì | Có động từ cụ thể ("chúng tôi đo", "chúng tôi chứng minh") không? |
| 4 | **Content** — kết quả chính, **kèm số** | Có con số không? Có nói rõ trên tập nào không? |
| 5 | **Conclusion** — nghĩa là gì | Câu này có vượt quá dữ liệu ở câu 4 không? |

Đối chiếu bắt buộc: **NeurIPS Paper Checklist mục 1 (Claims)** — "các khẳng định trong bài phải khớp với kết quả lý thuyết và thực nghiệm **về mức độ có thể kỳ vọng kết quả tổng quát hoá**"; đóng góp phải nêu rõ trong abstract và mở đầu **kèm mọi giả định và hạn chế quan trọng**; mục tiêu mang tính khát vọng thì được phép nêu làm động lực **miễn là rõ rằng bài chưa đạt được chúng**.

### 5.3 Làm bảng và hình trung thực

Nguồn: **Rougier, Droettboom & Bourne (2014), *Ten Simple Rules for Better Figures***, PLOS Computational Biology, 11/09/2014, doi:10.1371/journal.pcbi.1003833 — open access. Quy tắc 9 của bài: **"Message Trumps Beauty"** (thông điệp quan trọng hơn cái đẹp).

Danh sách kiểm trung thực, dùng ngay khi phản biện bài của bạn học:

- [ ] Trục y có **bắt đầu từ 0** không? Nếu không, có nói rõ và có lý do không? (Cắt trục là cách phóng đại chênh lệch nhỏ thông dụng nhất)
- [ ] Có **thanh sai số** không, và caption có nói nó là gì không? (NeurIPS mục 7; Keshav lượt 2 dạy người đọc kiểm đúng chỗ này)
- [ ] Thang log có được ghi nhãn là log không?
- [ ] Hình đọc được khi **in đen trắng** và với người **mù màu** không?
- [ ] **Dữ liệu thô đằng sau hình có được lưu trong repo không?** (Sandve Rule 7)
- [ ] Hình có được sinh **bằng script** không, hay sửa tay?
- [ ] Bảng: có in đậm số tốt nhất từng cột không, và có ghi rõ cao hơn là tốt hơn không?
- [ ] Bảng: các phương pháp có được so **ở cùng ngân sách tính toán** không? Nếu không, ngân sách của từng bên nằm ở đâu? (ARR C1)

### 5.4 Đạo đức trích dẫn

- **Trích dẫn người tạo ra artifact bạn dùng** — ARR B1, nguyên văn: với artifact tổng hợp như benchmark GLUE thì phải trích dẫn **tất cả** người tạo; trích dẫn **bài gốc** đã tạo ra gói code hoặc tập dữ liệu; **ghi rõ bạn đang dùng phiên bản nào**; nếu có thể thì kèm URL.
- **Ghi tên license** của mọi artifact — ARR B2: nêu đúng tên (ví dụ "CC-BY 4.0"); nếu bạn cào dữ liệu thì phải nêu bản quyền và điều khoản dịch vụ của nguồn; nếu đóng gói lại một tập có sẵn thì **nêu cả license gốc lẫn license của bản dẫn xuất**.
- **Dùng đúng mục đích đã công bố** — ARR B3.
- **Trợ lý AI** — ARR E1: nếu dùng thì phải khai, và phải phù hợp **chính sách đạo đức xuất bản của ACL**, đặc biệt về **tiêu chuẩn quyền tác giả**. NeurIPS mục 16 đặt ngưỡng khác: chỉ phải khai khi LLM là **thành phần quan trọng/mới/bất thường của phương pháp lõi**; dùng để viết hay định dạng thì không cần. Hai hội nghị có ngưỡng khác nhau — người học phải đọc quy định của **nơi mình nộp**, không suy từ nơi khác.
- **Quy tắc riêng cho LAIFS** (nối tiếp mục 0 của `02-repo-tham-khao.md`): dẫn link tới nguồn, **không đăng lại** file paper hay sách; nội dung CC BY (như ba bài PLOS ở trên) thì được dịch và đăng lại **kèm ghi công**; ACL Anthology: tài liệu **từ 2016 trở đi là CC BY 4.0**, tài liệu **trước 2016 là CC BY-NC-SA 3.0** (đọc tại `aclanthology.org/info/credits/`) — khác biệt này quan trọng khi muốn dịch lại.

### 5.5 Ranh giới giữa "kết quả" và "diễn giải"

Đây là mẫu hỏng số 1 của Lipton & Steinhardt: **không phân biệt giải thích với suy đoán**.

| Loại câu | Thuộc mục nào | Ví dụ | Kiểm được không |
|---|---|---|---|
| **Kết quả** | Results | "Mô hình A đạt 81,2 ± 0,6 trên tập validation qua 5 seed." | Có — chạy lại là biết |
| **Diễn giải** | Discussion | "Chúng tôi cho rằng mức tăng đến từ việc dropout giảm đồng thích nghi." | Không, trừ khi có ablation |
| **Suy đoán** | Discussion, **và phải có từ đánh dấu** | "Có thể cách này cũng có ích cho mô hình lớn hơn." | Không |

Quy tắc viết: mọi câu trong mục Results phải **chỉ được** tới một bảng, một hình, hoặc một con số (Sandve Rule 9: nối câu chữ với kết quả cơ sở). Mọi câu bắt đầu bằng "vì", "do", "nhờ" mà **không có ablation chống lưng** phải chuyển xuống Discussion và gắn từ đánh dấu ("chúng tôi cho rằng", "một giải thích khả dĩ là").

Và phải có mục **Limitations**. NeurIPS khuyến khích **tách riêng một mục "Limitations"**, yêu cầu nêu mọi giả định mạnh, mức bền của kết quả khi giả định bị vi phạm, phạm vi của khẳng định (ví dụ: chỉ thử trên vài tập dữ liệu, hoặc chỉ vài lần chạy), và các yếu tố ảnh hưởng tới hiệu năng. ARR A1 yêu cầu gần y hệt.

---

## 6. Tìm và theo dõi nghiên cứu

### 6.1 Nguồn — hiện trạng ngày 2026-09-18

| Nguồn | Có gì | Miễn phí / license | Trạng thái kiểm |
|---|---|---|---|
| **arXiv** (`arxiv.org/list/cs.LG/recent`) | Tiền ấn phẩm. `cs.LG` (ML), `cs.CL` (ngôn ngữ), `cs.CV` (thị giác), `stat.ML` | Đọc miễn phí. License **do tác giả chọn cho từng bài** — phải xem `arxiv.org/help/license` trước khi dùng lại | 200 |
| **ACL Anthology** (`aclanthology.org`) | Toàn bộ kỷ yếu ACL/NAACL/EMNLP/COLING, kèm BibTeX | Miễn phí. **≥2016: CC BY 4.0; <2016: CC BY-NC-SA 3.0** | 200 |
| **OpenReview** (`openreview.net`) | **Nhận xét phản biện công khai** của ICLR, NeurIPS và nhiều hội nghị | Miễn phí; thư viện `openreview-py` **MIT** | 200 |
| **Semantic Scholar** (`semanticscholar.org`) | Tìm kiếm, đồ thị trích dẫn, **API công khai** (Academic Graph, Recommendations, Datasets; có SPECTER2 embedding) | Miễn phí, **cần xin API key** cho hạn mức cao | 200 (trang `api.semanticscholar.org/api-docs/` 200; `api.semanticscholar.org` gốc 403) |
| **OpenAlex** (`api.openalex.org`) | Catalog học thuật mở, dữ liệu tải về được | Miễn phí, dữ liệu mở | API 200; **trang web `openalex.org` trả 403 khi curl** |
| **Hugging Face Papers** (`huggingface.co/papers`) | Bài arXiv đang được chú ý, có thảo luận | Miễn phí | 200 |
| **Papers with Code** (`paperswithcode.com`) | **ĐÃ NGỪNG.** Kiểm 2026-09-18: tên miền **chuyển hướng toàn bộ sang `huggingface.co/papers/trending`**, tiêu đề trang là "Trending Papers - Hugging Face" | — | 200 nhưng **URL cuối là huggingface.co** |
| **MLRC** (`reproml.org`) | Kỷ yếu các báo cáo tái lập — kho đề tài và mẫu viết | Miễn phí | 200 |
| **ReScience C** (`rescience.github.io`) | Bài cài lại, bình duyệt công khai trên GitHub | **Platinum open access** — miễn phí cả đọc lẫn đăng | 200 |
| **Retraction Watch** (`retractionwatch.com`) | Tin về bài bị rút | Miễn phí đọc | 200 |

### 6.2 Cách lọc nhiễu

**Chiến lược khảo sát tài liệu của Keshav** (mục 3 bài gốc, đã đọc) — vẫn là cách rẻ nhất:
1. Tìm **3–5 bài gần đây** trong lĩnh vực bằng một máy tìm kiếm học thuật và vài từ khoá chọn kỹ. Đọc **lượt 1** từng bài, rồi đọc **phần related work** của chúng. Nếu may mắn thấy một **bài khảo sát (survey)** → đọc nó, xong việc.
2. Nếu không: tìm **trích dẫn chung** và **tên tác giả lặp lại** trong danh mục tham khảo. Đó là các bài then chốt và các nhà nghiên cứu then chốt. Tải về để riêng. Rồi vào trang web của các tác giả đó xem gần đây họ đăng ở đâu — việc này **chỉ ra luôn hội nghị hàng đầu** của lĩnh vực.
3. Vào trang các hội nghị đó, lướt kỷ yếu gần nhất. Đọc **lượt 2** cho toàn bộ tập bài đã gom. Nếu tất cả đều trích một bài mà bạn chưa có → lấy và đọc, lặp lại.

**Bốn bộ lọc bổ sung cho thời đại arXiv** (mức **C**, ý kiến thực hành):
- Đặt **hạn mức thời gian**, không đặt hạn mức số bài: 30 phút/tuần lướt `cs.LG` mới, không phải "đọc hết".
- **Chờ 6 tháng** với mọi bài không nằm đúng việc đang làm. Bài quan trọng sẽ được nhắc lại; bài còn lại tự biến mất.
- Ưu tiên bài **đã qua phản biện** khi học kiến thức nền; dùng arXiv cho việc theo dõi hướng đi.
- Với bài ở ICLR/NeurIPS: **đọc phản biện trên OpenReview trước khi đọc bài**. Người phản biện thường đã chỉ ra điểm yếu nhanh hơn bạn đọc 40 phút.

**Theo dõi hạn nộp hội nghị** — hai trang, và có khác biệt quan trọng:

| Trang | License | Trạng thái 2026-09-18 |
|---|---|---|
| `ccfddl.com` (repo `ccfddl/ccf-deadlines`) | **MIT** | **Đang sống**: repo có commit ngày **2026-09-18**. Trang là SPA dựng bằng JS nên curl không đọc được nội dung — kiểm qua repo |
| `aideadlin.es` (repo `paperswithcode/ai-deadlines`) | **MIT** | **ĐÃ CŨ, đừng dùng**: trang trả 200 nhưng nội dung còn liệt kê AISTATS 2025, CVPR 2025, NAACL 2025 với hạn nộp 2024; repo **commit cuối 2024-09-15**. Trang vẫn đề "AI Deadlines by Papers With Code" trong khi Papers with Code đã ngừng |

**Quản lý tài liệu đã đọc**: **Zotero** (`zotero.org`, repo `zotero/zotero`) — file `COPYING` ghi rõ **GNU Affero General Public License phiên bản 3 (AGPLv3)**, bản quyền Corporation for Digital Scholarship. Phần mềm miễn phí; dung lượng đồng bộ trên máy chủ Zotero có hạn mức miễn phí và gói trả tiền — **[chưa xác minh]** mức cụ thể. Có thể tự cấu hình đồng bộ WebDAV để khỏi trả tiền.

### 6.3 Nhận biết bài kém chất lượng

**Dấu hiệu trong chính bài** (xếp theo thứ tự kiểm nhanh):

| Dấu hiệu | Vì sao đáng ngại | Nguồn |
|---|---|---|
| Không có mục Limitations | ARR A1 và NeurIPS mục 2 đều bắt buộc/khuyến khích mạnh; bài bỏ hẳn là bài chưa qua quy trình nào | NeurIPS ck.2, ARR A1 |
| Kết quả một lần chạy, không thanh sai số | Reimers: chỉ seed đã đủ tạo chênh 1 điểm F₁ | Reimers & Gurevych (2017) |
| Không nêu ngân sách tính toán | ARR C1 bắt buộc; thiếu nó thì không so được công bằng | ARR C1, NeurIPS ck.8 |
| Bảng so với baseline lấy số từ bài cũ, kiến trúc nền khác nhau | Lỗi Musgrave 2.1 | Musgrave et al. (2020) |
| Không có tập validation; siêu tham số chọn trên test | Lỗi Musgrave 2.2; ARR C2 cấm | Musgrave (2020), ARR C2 |
| Toán nhiều mà không dùng để suy ra kết luận nào | "Mathiness" | Lipton & Steinhardt (2018) |
| Abstract dùng từ mạnh ("human-level", "solves") mà kết quả chỉ trên một tập | Lạm dụng ngôn ngữ + claim vượt phạm vi | Lipton (2018), NeurIPS ck.1 |
| Nơi đăng lạ, hứa duyệt trong vài ngày, thu phí cao | Nhà xuất bản săn mồi | **Think. Check. Submit.** (`thinkchecksubmit.org`) — sáng kiến liên ngành quốc tế, có **checklist riêng cho tạp chí và cho sách/chương sách** |

**Ba câu hỏi chốt trước khi tin một con số**: (1) số này trên tập nào và ai chọn tập đó? (2) chạy bao nhiêu lần? (3) baseline có được đối xử ngang không? Ba câu này bao trùm gần hết các lỗi ở mục 3.

---

## 7. Đề xuất cho LAIFS

### 7.1 Đặt ở đâu — và vì sao *không* phải một tầng mới

Theo mục 6.1 của `03-kien-truc.md`, "khu" là **dữ liệu** (`enum khu` + route động `[khu]`), còn lộ trình 7 tầng là **đồ thị khái niệm có tiền quyết**. Kỹ năng nghiên cứu **không có tiền quyết toán học** và **không phải khái niệm ML** — nên nhét nó thành "tầng 7" sẽ phá đúng cái làm nên giá trị của lộ trình.

**Đề xuất:**

| Nội dung | Đặt ở đâu | Điều kiện kích hoạt |
|---|---|---|
| Phần lớn (N1–N9 dưới đây) | `content/huong-dan/nghien-cuu/<slug>.mdx` → `/nghien-cuu/<slug>`, tức **khu `nghien-cuu` của G1** | Đúng điều kiện G1 trong 03: **có ít nhất 1 bài đã viết xong nháp**. Không mở khu rỗng |
| **2 khái niệm thật** (xem 7.3) | `content/khai-niem/`, **tầng 2**, chèn sau `danh-gia-mo-hinh` (`thu_tu` 20) và trước `knn` (21) | Ngay được — chúng là khái niệm ML cơ bản đang thiếu, không phải nội dung nghiên cứu nâng cao |
| Bài "Đọc paper có hướng dẫn" (F16 của 01) | Là **một bài trong khu `nghien-cuu`** (N1 + N2), không phải tính năng riêng | Sau khi có N1 |

Ba móc nối rẻ, không phải sửa kiến trúc:
- Mỗi bài trong khu `nghien-cuu` khai trường `khai_niem: [...]` → trang khái niệm tự hiện "Bài viết liên quan" (cơ chế đã có sẵn theo 03 mục 6.1).
- Mỗi bài có thể kèm quiz theo **đúng schema `quiz` hiện tại**, không cần schema mới.
- `hienThi()` trong `src/lib.ts` vẫn là cổng duyệt duy nhất — không đụng vào.

### 7.2 Chín bài đề xuất cho khu "Nghiên cứu"

Cột "Bài tập kiểm tra được" chỉ chứa bài **chấm tự động được bằng hạ tầng đang có**: quiz YAML (`mot` / `nhieu` / `so`) hoặc bài code chạy trên Pyodide (như `content/bai-tap/`). Slug và id câu hỏi dưới đây là **đề xuất**; id phải cố định sau khi đăng.

| # | Bài | Một dòng | Bài tập kiểm tra được | Nguồn chính |
|---|---|---|---|---|
| **N1** | **Ba lượt đọc một bài báo** | Quy trình Keshav 2007 và năm chữ C của lượt 1, kèm cảnh báo đây là kinh nghiệm chứ không phải kết quả thí nghiệm | Quiz `nhieu`: cho 6 hành động, chọn những hành động thuộc **lượt 1** (đáp án: đọc tiêu đề/abstract/mở đầu, đọc tiêu đề mục, đọc kết luận, lướt tham khảo — **không** gồm đọc chứng minh, không gồm cài lại). Quiz `so`: lượt 3 tốn khoảng bao nhiêu giờ với người mới (4–5) | Keshav (2007) |
| **N2** | **Bắt khẳng định quá mức trong phần thí nghiệm** | Sáu câu hỏi phải hỏi một bảng kết quả, minh hoạ bằng bốn mẫu hỏng của Lipton & Steinhardt | Quiz `mot` × 5: mỗi câu là một trích đoạn abstract/bảng thật, chọn mẫu hỏng tương ứng (1 giải thích-vs-suy đoán / 2 nguồn cải thiện / 3 mathiness / 4 lạm dụng ngôn ngữ / 5 không lỗi) | Lipton & Steinhardt (2018); Musgrave (2020) |
| **N3** | **Bài này có tái lập được không?** | Ba câu kiểm trong 10 phút: có code, có seed, có ngân sách tính toán | Bài code Pyodide: cho sẵn 8 dict mô tả metadata bài báo, viết `kiem_tai_lap(bai) -> dict` trả `{"code":bool,"seed":bool,"ngan_sach":bool,"diem":int}`; test so với đáp án cố định | NeurIPS ck.4–8; ARR C1–C3 |
| **N4** | **Checklist của hội nghị lớn nói gì** | So NeurIPS (16 mục) với ARR (A1–E1) — giống, khác, và vì sao cả hai đều cho phép trả lời "no" | Quiz `nhieu`: checklist nào bắt khai báo **mức trả công cho người gán nhãn** (ARR D2, không phải NeurIPS)? Quiz `so`: NeurIPS Paper Checklist có bao nhiêu mục (16) | NeurIPS ck.; ARR ck.; Pineau et al. (2021) |
| **N5** | **Seed và độ lệch: con số của bạn chắc tới đâu** | Vì sao một điểm số đơn lẻ không nói lên gì, và tối thiểu phải chạy bao nhiêu lần | Bài code Pyodide: cho mảng điểm 5 seed của hai hệ, viết `co_khac_nhau(a, b) -> bool` trả True chỉ khi chênh trung bình **lớn hơn** tổng độ lệch chuẩn; test có 4 ca, trong đó 2 ca phải trả False | Reimers & Gurevych (2017); Bouthillier et al. (2021) |
| **N6** | **Bootstrap và paired test bằng 20 dòng numpy** | Hai công cụ thống kê đủ dùng, cài từ đầu, không thư viện | Bài code Pyodide: (a) `bootstrap_ci(diem, B=10000, seed=0)` trả `(thap, cao)` — test kiểm khoảng phủ giá trị thật với dữ liệu sinh sẵn; (b) `paired_permutation_p(a, b, B=10000, seed=0)` — test kiểm p < 0,05 trên cặp có chênh rõ và p > 0,2 trên cặp giống nhau | Dror et al. (2018); Berg-Kirkpatrick et al. (2012) |
| **N7** | **Thiết kế so sánh công bằng: baseline, ablation, ngân sách** | Ba baseline bắt buộc, cách chạy ablation đúng, và vì sao phải cân ngân sách dò siêu tham số | Quiz `mot` × 4: cho mô tả một thí nghiệm, chọn biến **chưa** được kiểm soát. Quiz `so`: thí nghiệm có 3 thành phần thêm vào cần tối thiểu bao nhiêu cấu hình cho ablation kiểu "bỏ từng cái" (5) | Musgrave (2020); Melis (2018); Dodge (2019); Lucic (2018) |
| **N8** | **Nhật ký thí nghiệm và repo tái lập được** | Mẫu nhật ký 5 trường, bố cục repo tối thiểu, và mười quy tắc của Sandve | Bài code Pyodide: viết `kiem_repo(cay_thu_muc) -> list` trả danh sách vi phạm, phát hiện được ≥3 lỗi (dữ liệu thô trong Git, README không có câu lệnh, siêu tham số hard-code trong `src/`). Quiz `nhieu`: quy tắc nào của Sandve bị vi phạm khi sửa hình bằng tay (Rule 7 + Rule 2) | Sandve et al. (2013); ML Repro Checklist v2.0 |
| **N9** | **Viết: cấu trúc, abstract, hình trung thực** | C-C-C, khuôn abstract 5 câu, checklist hình, và ranh giới kết quả/diễn giải | Quiz `nhieu`: trong 8 câu cho sẵn, chọn những câu **thuộc mục Results** (câu có số + có chỉ tới bảng/hình) và những câu phải chuyển xuống Discussion. Bài viết tự do + `y_chinh` để tự đối chiếu (dùng cơ chế F8 "giải thích lại bằng lời của bạn" đã có) | Mensh & Kording (2017); Rougier et al. (2014); NeurIPS ck.1–2 |

**Bài dự án xuyên suốt (không phải bài đọc)**: **"Tái lập một kết quả nhỏ"** — người học chọn một bài có code, chạy lại (cấp 0), rồi đổi một thứ (cấp 2), rồi viết báo cáo 1 trang theo khuôn N9. Nộp là một repo theo bố cục 4.6. Chấm bằng **checklist tự chấm** lấy thẳng từ ML Reproducibility Checklist v2.0 — không cần chấm tự động, và đó cũng là bài tập gần nghề nhất trên toàn LAIFS.

### 7.3 Hai khái niệm nên vào **tầng 2** của lộ trình hiện có

Đây là hai thứ **đang thiếu trong 48 khái niệm hiện tại** và thực sự là khái niệm ML cơ bản, không phải nội dung nghiên cứu:

| id đề xuất | Tên | Tầng / thứ tự | Tiền quyết | Vì sao thuộc lộ trình chứ không thuộc khu |
|---|---|---|---|---|
| `do-lech-va-seed` | **Độ lệch giữa các lần chạy** | tầng **2**, `thu_tu` **20.5** (giữa `danh-gia-mo-hinh` 20 và `knn` 21) | `danh-gia-mo-hinh`, `ky-vong-phuong-sai`, `train-val-test` | Người học gặp nó ngay ở bài tập gradient descent đầu tiên — đổi seed ra số khác. Nếu để tới khu nghiên cứu thì đã học sai thói quen mất 20 khái niệm rồi |
| `khoang-tin-cay-bootstrap` | **Khoảng tin cậy bằng bootstrap** | tầng **2**, `thu_tu` **20.6** | `do-lech-va-seed`, `ky-vong-phuong-sai`, `xac-suat-co-ban` | Là ứng dụng trực tiếp của `ky-vong-phuong-sai` đã có ở tầng 1, và là công cụ duy nhất người học cần để báo cáo kết quả trung thực |

Lưu ý kỹ thuật: `thu_tu` trong `content.config.ts` là `z.number().int()` — **số nguyên**, nên không dùng được 20.5. Phải **đánh số lại** `knn`/`k-means`/`cay-quyet-dinh`/`hop-ly-cuc-dai`/`on-dinh-so` lên 2 bậc, hoặc chèn vào cuối tầng 2 với `thu_tu` 25–26. Đây là việc của người sửa nội dung, không nên làm trong đợt này vì nhiều agent đang chạy song song.

### 7.4 Thứ tự làm gợi ý

1. **N1 + N2** — rẻ nhất (chỉ cần văn bản + quiz), và biến được tính năng F16 của 01 thành thứ dùng được ngay. Đủ điều kiện kích hoạt G1.
2. **N3 + N5** — hai bài code Pyodide ngắn, dùng lại y nguyên hạ tầng `bai-tap` hiện có.
3. **Hai khái niệm tầng 2** (7.3) — làm trong một đợt riêng vì phải đánh số lại `thu_tu`.
4. **N6 + N7** — phần nặng nhất về nội dung, nhưng là phần khác biệt nhất so với các trang học AI tiếng Việt khác.
5. **N4, N8, N9** — làm sau, khi đã có người thật đi qua bài dự án tái lập và biết họ vấp ở đâu.

**Không nên làm ngay**: cơ chế bình duyệt chéo giữa người học (cần tài khoản → G2/G3), tự động kiểm link paper (bảo trì tốn), kho paper tự host (vi phạm license, và mục 0 của `02-repo-tham-khao.md` đã cấm đăng lại file).

---

## 8. Nguồn đã kiểm

Lệnh: `curl -sI -L -o /dev/null -w '%{http_code}' <url>`, ngày **2026-09-18**.

### 8.1 Phương pháp đọc và phê bình

| Mã | URL | Ghi chú |
|---|---|---|
| **403** | `https://dl.acm.org/doi/10.1145/1273445.1273458` | Keshav (2007) bản DOI — ACM chặn curl; mở bằng trình duyệt vẫn được |
| **200** | `https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf` | **Toàn văn Keshav — đã tải và đọc hết bằng `pdftotext`** |
| **200** | `https://arxiv.org/abs/1807.03341` | Lipton & Steinhardt, *Troubling Trends* — đã đọc toàn bộ abstract qua arXiv API |
| **200** | `https://arxiv.org/abs/2003.08505` | Musgrave et al., *A Metric Learning Reality Check* — **đã tải PDF và đọc mục 2 (2.1, 2.2)** |
| **200** | `https://arxiv.org/abs/1707.05589` | Melis, Dyer & Blunsom — abstract |
| **200** | `https://arxiv.org/abs/1711.10337` | Lucic et al., *Are GANs Created Equal?* — abstract |
| **200** | `https://arxiv.org/abs/1709.06560` | Henderson et al., *Deep RL that Matters* — abstract |

### 8.2 Checklist và tái lập

| Mã | URL | Ghi chú |
|---|---|---|
| **200** | `https://neurips.cc/public/guides/PaperChecklist` | **Đã tải HTML và đọc toàn bộ 16 mục** (trang phiên bản 2026). Lần gọi đầu trả `000` do hết thời gian chờ; gọi lại với `--max-time 40` trả 200 |
| **200** | `https://aclrollingreview.org/responsibleNLPresearch/` | **Đã tải HTML và đọc toàn bộ 19 mục A1–E1 + phần Credits** |
| **200** | `https://www.cs.mcgill.ca/~jpineau/ReproducibilityChecklist.pdf` | **Đã tải PDF và đọc hết** — ML Reproducibility Checklist v2.0, 07/04/2020 |
| **200** | `https://jmlr.org/papers/v22/20-303.html` | Pineau et al. (2021), JMLR 22(164):1−20 — đã đọc trang abstract |
| **200** | `https://reproml.org/` | **Đã đọc nội dung trang**: MLRC 2026 là track chính thức NeurIPS 2026, hạn cứng 30/09/2026 |
| **200** | `https://rescience.github.io/` | **Đã đọc nội dung trang**: platinum open access, bình duyệt trên GitHub |
| **200** | `https://arxiv.org/abs/2207.07048` | Kapoor & Narayanan, *Leakage and the Reproducibility Crisis* — abstract (17 lĩnh vực, 329 bài, 8 kiểu rò rỉ) |
| **403** | `https://www.cell.com/patterns/fulltext/S2666-3899(23)00159-9` | Bản tạp chí Patterns của bài trên — Cell chặn curl; dùng bản arXiv thay thế |

### 8.3 Thiết kế thí nghiệm và thống kê

| Mã | URL | Ghi chú |
|---|---|---|
| **200** | `https://aclanthology.org/P18-1128/` | Dror, Baumer, Shlomov & Reichart (2018), ACL — **đã đọc abstract + BibTeX** |
| **200** | `https://aclanthology.org/D12-1091/` | Berg-Kirkpatrick, Burkett & Klein (2012), EMNLP — đã đọc BibTeX |
| **200** | `https://aclanthology.org/D17-1035/` | Reimers & Gurevych (2017), EMNLP — **đã đọc abstract** (p < 10⁻⁴; 1 điểm F₁; 50.000 mạng LSTM) |
| **200** | `https://aclanthology.org/D19-1224/` | Dodge et al. (2019), EMNLP-IJCNLP — **đã đọc abstract** |
| **200** | `https://aclanthology.org/P19-1267/` | Gorman & Bedrick (2019), ACL — **đã đọc abstract** (9 bộ gán nhãn từ loại, 2000–2018) |
| **200** | `https://arxiv.org/abs/2103.03098` | Bouthillier et al. (2021), MLSys — abstract (giảm 51 lần chi phí) |
| **200** | `https://arxiv.org/abs/1902.10811` | Recht et al. (2019) — **đã đọc abstract**; con số 3–15% / 11–14% và kết luận "không phải do adaptivity" lấy từ đây |
| **200** | `https://proceedings.mlr.press/v97/recht19a.html` | Bản ICML/PMLR của bài trên — trang mở được nhưng **không trích được abstract bằng script**, nên nội dung lấy từ arXiv |

### 8.4 Ghi chép, công cụ, viết

| Mã | URL | Ghi chú |
|---|---|---|
| **200** | `https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003285` | Sandve et al. (2013) — **đã đọc đủ 10 tiêu đề quy tắc**; CC BY |
| **200** | `https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005619` | Mensh & Kording (2017) — **đã đọc đủ 10 tiêu đề quy tắc**; CC BY |
| **200** | `https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003833` | Rougier, Droettboom & Bourne (2014) — đã lấy được tiêu đề Rule 9 "Message Trumps Beauty" |
| **200** | `https://simon.peytonjones.org/great-research-paper/` | **Đã đọc trang**: "bảy gợi ý đơn giản, cụ thể". Nội dung bảy gợi ý **chưa xác minh** (xem 8.6) |
| **200** | `https://www.aclweb.org/portal/content/acl-code-ethics` | ACL Code of Ethics — chỉ kiểm sống, **chưa đọc nội dung** |
| **200** | `https://aclanthology.org/info/credits/` | **Đã đọc**: ≥2016 CC BY 4.0, <2016 CC BY-NC-SA 3.0 |
| **200** | `https://mlflow.org/` · `https://github.com/mlflow/mlflow` | **Apache-2.0** (GitHub API), hoạt động 2026-09-18 |
| **200** | `https://github.com/aimhubio/aim` | **Apache-2.0**, hoạt động 2026-09-17 |
| **200** | `https://github.com/tensorflow/tensorboard` | **Apache-2.0**, hoạt động 2026-08-24 |
| **200** | `https://github.com/IDSIA/sacred` | **MIT**, hoạt động gần nhất **2025-10-22** |
| **200** | `https://github.com/clearml/clearml` | **Apache-2.0**, hoạt động 2026-09-17 |
| **200** | `https://github.com/wandb/wandb` | Client **MIT**, hoạt động 2026-09-18; dịch vụ là SaaS đóng |
| **200** | `https://hydra.cc/` · `https://github.com/facebookresearch/hydra` | **MIT**; repo chuyển hướng tới `hydra-ecosystem/hydra` |
| **200** | `https://dvc.org/` · `https://github.com/iterative/dvc` | **Apache-2.0**; repo chuyển hướng tới `treeverse/dvc`, hoạt động 2026-09-14 |
| **200** | `https://github.com/git-lfs/git-lfs` | **MIT** — đọc trực tiếp `LICENSE.md` (GitHub API báo `NOASSERTION`) |
| **200** | `https://github.com/drivendataorg/cookiecutter-data-science` | **MIT**, hoạt động 2026-08-07 |
| **200** | `https://github.com/zotero/zotero` · `https://www.zotero.org/` | **AGPLv3** — đọc trực tiếp `COPYING` |
| **200** | `https://zenodo.org/` · `https://about.zenodo.org/` · `https://help.zenodo.org/` | Miễn phí, cấp DOI. (`https://zenodo.org/help/` trả **404** — dùng `help.zenodo.org`) |
| **200** | `https://github.com/huggingface/datasets` | **Apache-2.0** |
| **200** | `https://www.openml.org/` | Kiểm sống; **chưa xác minh** license nền tảng |

### 8.5 Tìm và theo dõi nghiên cứu

| Mã | URL | Ghi chú |
|---|---|---|
| **200** | `https://arxiv.org/list/cs.LG/recent` · `https://arxiv.org/help/license` · `https://arxiv.org/help/moderation` | Kiểm sống |
| **200** | `https://aclanthology.org/` | Kiểm sống; site build gần nhất **15/09/2026** theo chân trang |
| **200** | `https://openreview.net/` · `https://github.com/openreview/openreview-py` (**MIT**) | Kiểm sống |
| **200** | `https://www.semanticscholar.org/` · `https://api.semanticscholar.org/api-docs/` | **Đã đọc trang API**: 3 dịch vụ Academic Graph / Recommendations / Datasets, có SPECTER2 embedding, phải xin API key. (`https://api.semanticscholar.org/` gốc trả **403**) |
| **200** | `https://api.openalex.org/works?per-page=1` | API sống. **Trang `https://openalex.org/` trả 403** khi curl |
| **200 → huggingface.co** | `https://paperswithcode.com/` | **Chuyển hướng toàn bộ sang `https://huggingface.co/papers/trending`**; tiêu đề trang đích là "Trending Papers - Hugging Face" |
| **200** | `https://huggingface.co/papers` | Kiểm sống |
| **200** | `https://ccfddl.com/` · `https://github.com/ccfddl/ccf-deadlines` | **MIT**, repo hoạt động **2026-09-18**. Trang là SPA, curl không đọc được nội dung |
| **200** | `https://aideadlin.es/` · `https://github.com/paperswithcode/ai-deadlines` | **MIT** nhưng **nội dung đã cũ**: đọc được trang, còn liệt kê AISTATS/CVPR/NAACL 2025 với hạn 2024; repo commit cuối **2024-09-15** |
| **200** | `https://thinkchecksubmit.org/` | **Đã đọc trang**: sáng kiến quốc tế liên ngành, có checklist riêng cho tạp chí và cho sách/chương sách |
| **200** | `https://retractionwatch.com/` | Kiểm sống |
| **403** | `https://doaj.org/` | Chặn curl — đã bỏ khỏi phần khuyến nghị |

### 8.6 Đã bỏ vì không xác minh được

| Thứ bị bỏ | Lý do |
|---|---|
| **Bảy gợi ý của Simon Peyton Jones** (danh sách cụ thể) | File slide `microsoft.com/.../How-to-write-a-great-research-paper.pdf` trả **403** với cả HEAD lẫn GET có User-Agent giả; tải về chỉ được 4 KB rác. Chỉ giữ lại điều trang `simon.peytonjones.org` **tự nói**: bài nói có bảy gợi ý. Trang gốc MSR `microsoft.com/en-us/research/academic-program/write-great-research-paper/` cũng **403** |
| **Whitesides (2004), *Writing a Paper*** | `https://doi.org/10.1002/adma.200400767` trả **403**; không tìm được bản đọc được hợp pháp. Chỉ còn được nhắc gián tiếp qua danh mục tham khảo của Keshav |
| **Giá cụ thể của Weights & Biases** | Trang `wandb.ai/site/pricing/` trả 200 nhưng bảng giá dựng bằng JavaScript; curl chỉ lấy được menu điều hướng |
| **Giá cụ thể của MLflow trên Databricks, của ClearML SaaS, của Zotero storage, hạn mức Git LFS trên GitHub** | Chưa kiểm được trên trang chính thức bằng curl trong đợt này |
| **License nền tảng OpenML** | Trang sống nhưng chưa tìm thấy tuyên bố license rõ ràng |
| **Abstract bản ICML của Recht et al.** | Trang PMLR mở được nhưng script không trích được khối abstract; đã dùng bản arXiv thay thế |
| **Nội dung ACL Code of Ethics** | Chỉ kiểm link sống (200), chưa đọc toàn văn — nên trong mục 5.4 chỉ nhắc rằng ARR E1 **trỏ tới** chính sách đó, không tóm tắt nội dung chính sách |
| **Con số cụ thể về tỉ lệ bài ML có thả code** | Không tìm được nguồn có phương pháp rõ trong đợt này; đã bỏ hẳn, không ước lượng |
| **Thống kê về hiệu quả học tập của việc tái lập paper** | Giống kết luận 01/D3: **không tìm thấy nghiên cứu có đối chứng**. Mục 2.1 vì vậy chỉ lập luận từ (a) định nghĩa lượt 3 của Keshav và (b) các nguyên lý đã có bằng chứng ở 01 (A1, A5, D2) — **không** tự khẳng định hiệu quả đã được đo |
