# Repo GitHub có thể mượn cho LAIFS

> Khảo sát ngày **2026-09-17**. Mọi repo dưới đây đã được kiểm tra thật qua GitHub API (`search/repositories` với `repo:` + `repos/OWNER/REPO`), gồm: tồn tại, SPDX license, số sao, `pushed_at` (lần push cuối). Với license `NOASSERTION`/không có, đã đọc trực tiếp file `LICENSE`/README.
> Ký hiệu cột **⭐ / cập nhật**: số sao · tháng push cuối (YYYY-MM). `ARCHIVED` = repo đã lưu trữ, không còn phát triển.
> Cột **Ưu tiên**: **P1** dùng ngay · **P2** dùng khi làm tới module đó · **P3** tham khảo / để sau.

---

## 0. Quy tắc license áp dụng cho LAIFS (đọc trước)

LAIFS hiện là code của mình + nội dung MDX/YAML. Nên tách rõ **license code** và **license nội dung** (ví dụ `LICENSE` cho code, `content/LICENSE` hoặc front-matter `license:` + `nguon:` cho từng bài).

| License gặp phải | Được làm gì | Ràng buộc cho LAIFS |
|---|---|---|
| **MIT / BSD / ISC / Apache-2.0** | Dùng, sửa, port, dịch | Giữ copyright notice (MIT/BSD) hoặc `LICENSE` + `NOTICE` (Apache). Ghi nguồn trong file port hoặc trang "Ghi công". Trộn vào code MIT thoải mái. |
| **MPL-2.0** (Pyodide), **LGPL-3.0** (JSXGraph) | Dùng như thư viện không sửa | Sửa file của thư viện thì phải công bố phần sửa. Dùng qua npm/CDN là an toàn. |
| **GPL-3.0** (code fastbook) | Chỉ tham khảo | Không chép code GPL vào code LAIFS nếu không muốn cả site thành GPL. Tự viết lại ý tưởng. |
| **AGPL-3.0** (Anki) | Không đụng | Dùng `ts-fsrs` (MIT) thay thế. |
| **CC BY 4.0** | Dịch, sửa, dùng thương mại | Ghi tác giả, link nguồn, link license, ghi rõ "đã dịch/chỉnh sửa". |
| **CC BY-SA 4.0** (d2l, MLU-Explain text, ebookMLCB, ml-engineering) | Dịch, sửa | **Bản dịch/phái sinh phải giữ CC BY-SA 4.0.** Chỉ áp cho phần nội dung đó, không lan sang code site. Đánh dấu license theo từng bài. |
| **CC BY-NC-SA** (mlcourse.ai, NYU-DLSP20) | Dịch, phi thương mại | Nếu LAIFS có thu phí/quảng cáo thì không được dùng. Phái sinh giữ BY-NC-SA. |
| **CC BY-NC-ND** (text PythonDataScienceHandbook, udlbook, ChatPaper) | Chỉ chia sẻ nguyên văn | **Không được dịch** (ND = không phái sinh). Chỉ link. |
| **License riêng / "Educational Use Only"** (Deep-ML), **"personal use only"** (roadmap.sh) | Rất hạn chế | Không chép đề/nội dung. Chỉ lấy ý tưởng UX. |
| **Không có license** | Mặc định **mọi quyền được bảo lưu** | **Không được dùng code/nội dung.** Chỉ link và lấy ý tưởng. |

---

## 1. Trực quan hoá ML/DL tương tác

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [tensorflow/playground](https://github.com/tensorflow/playground) | Huấn luyện MLP nhỏ trên dữ liệu 2D, TS + d3 | Apache-2.0 | 13.0k · 2026-06 | **Fork + Việt hoá + tự host**, nhúng iframe vào bài MLP/activation/regularization. Có thể mở URL kèm tham số (hash state) để gắn với từng câu hỏi. | P1 |
| [poloclub/transformer-explainer](https://github.com/poloclub/transformer-explainer) | GPT-2 chạy trong trình duyệt, giải thích attention từng bước | MIT | 8.6k · 2026-06 | Svelte + d3 → **nhúng/link** (port sang React quá tốn). Có thể fork Việt hoá chú thích. | P1 |
| [poloclub/cnn-explainer](https://github.com/poloclub/cnn-explainer) | Trực quan CNN (conv, ReLU, pooling) trên ảnh | MIT | 9.0k · 2023-10 | Svelte → **nhúng/link**; lấy ý tưởng "click nơ-ron → thấy phép tính" để port 1 component conv 3×3 nhỏ sang React. | P2 |
| [bbycroft/llm-viz](https://github.com/bbycroft/llm-viz) | Mô hình GPT 3D, đi qua từng phép tính | MIT (trừ `src/homepage/`, ảnh cá nhân, asset bên thứ ba) | 5.5k · 2026-08 | React/Next + WebGL → **port được từng phần** (hoặc link). Tránh chép thư mục homepage. | P2 |
| [poloclub/ganlab](https://github.com/poloclub/ganlab) | Huấn luyện GAN 2D trực tiếp (tfjs) | Apache-2.0 | 1.5k · 2026-03 | **Link/nhúng** cho bài GAN. | P3 |
| [poloclub/diffusion-explainer](https://github.com/poloclub/diffusion-explainer) | Giải thích Stable Diffusion từng bước | MIT | 494 · 2024-08 | **Link/nhúng** cho bài diffusion. | P3 |
| [aws-samples/aws-mlu-explain](https://github.com/aws-samples/aws-mlu-explain) | Bài viết cuộn tương tác (bias-variance, ROC, logistic, CV…) | Text **CC BY-SA 4.0**, code "modified MIT" | 945 · 2024-11 · ARCHIVED | **Dịch nội dung (giữ CC BY-SA)** + port ý tưởng scrollytelling sang React. Repo đã archive nhưng dùng được. | P1 |
| [PAIR-code/ai-explorables](https://github.com/PAIR-code/ai-explorables) | Mã nguồn các "explorables" của Google PAIR (fairness, memorization, grokking…) | Apache-2.0 | 69 · 2026-06 | **Port/Việt hoá** từng bài; phong cách rất hợp người mới. | P2 |
| [lilipads/gradient_descent_viz](https://github.com/lilipads/gradient_descent_viz) | So sánh 5 thuật toán GD (momentum, Adam…) từng bước | MIT | 1.4k · 2024-08 | App desktop (Qt) → **chỉ lấy ý tưởng** để nâng cấp `src/viz/GradientDescent1D.tsx` lên 2D có Adam/RMSProp. | P1 (ý tưởng) |
| [distillpub/post--momentum](https://github.com/distillpub/post--momentum) | Bài "Why Momentum Really Works" với slider tương tác | CC BY 4.0 | 211 · 2019-08 | **Dịch sang tiếng Việt + ghi công** (BY cho phép), port slider sang React. | P2 |
| [distillpub/template](https://github.com/distillpub/template) | Khung bài viết kiểu Distill (footnote, citation, figure) | Apache-2.0 | 998 · 2022-12 | **Lấy ý tưởng** component: chú thích bên lề, hover citation. | P3 |
| [vicapow/explained-visually](https://github.com/vicapow/explained-visually) | Setosa "Explained Visually": PCA, eigenvector, xác suất có điều kiện | MIT | 882 · 2023-08 | **Port** các viz toán nền (PCA, eigen) sang React. | P2 |
| [seeingtheory/Seeing-Theory](https://github.com/seeingtheory/Seeing-Theory) | Xác suất thống kê trực quan | Apache-2.0 | 2.2k · 2023-09 | **Port/lấy ý tưởng** cho phần toán nền (phân phối, Bayes). | P3 |
| [poloclub/wizmap](https://github.com/poloclub/wizmap) | Khám phá hàng triệu embedding trong trình duyệt | MIT | 535 · 2026-01 | Svelte → **nhúng** cho bài embedding/word2vec với dữ liệu tiếng Việt đã chiếu 2D sẵn. | P2 |
| [tensorflow/embedding-projector-standalone](https://github.com/tensorflow/embedding-projector-standalone) | Embedding Projector (PCA/t-SNE/UMAP) bản tĩnh | **Không license** (API trả null) | 309 · 2019-05 · ARCHIVED | **Chỉ link** projector.tensorflow.org; bản code gốc nằm trong tensorboard (Apache-2.0). | P3 |
| [tensorflow/tensorboard](https://github.com/tensorflow/tensorboard) | Chứa mã Embedding Projector | Apache-2.0 | 7.2k · 2026-08 | Nếu cần tự host projector thì lấy từ đây. | P3 |
| [jessevig/bertviz](https://github.com/jessevig/bertviz) | Vẽ attention head của Transformer | Apache-2.0 | 8.2k · 2026-01 | Python/Jupyter → **xuất JSON attention trước**, render lại bằng React (ý tưởng layout head-view). | P2 |
| [catherinesyeh/attention-viz](https://github.com/catherinesyeh/attention-viz) | Trực quan query-key (VIS 2023) | MIT | 170 · 2024-05 | **Ý tưởng** cho bài attention nâng cao. | P3 |
| [poloclub/dodrio](https://github.com/poloclub/dodrio) | Khám phá attention weight theo ngôn ngữ học | MIT | 378 · 2023-10 | **Ý tưởng/link**. | P3 |
| [jalammar/ecco](https://github.com/jalammar/ecco) | Giải thích LM (saliency, neuron activation) | BSD-3-Clause | 2.1k · 2024-08 | **Ý tưởng** cho bài interpretability. | P3 |
| [tomgoldstein/loss-landscape](https://github.com/tomgoldstein/loss-landscape) | Code bài báo "Visualizing the Loss Landscape of Neural Nets" | MIT | 3.2k · 2022-04 | **Chạy offline sinh lưới loss** (ResNet có/không skip) → render 3D/contour trong trình duyệt. | P3 |
| [karpathy/convnetjs](https://github.com/karpathy/convnetjs) | Huấn luyện NN bằng JS thuần trong trình duyệt | MIT | 11.2k · 2023-01 | Cũ nhưng nhỏ gọn → **mượn code** cho demo "train MNIST ngay trên trang" không cần Pyodide. | P3 |
| [tensorspace-team/tensorspace](https://github.com/tensorspace-team/tensorspace) | Mô hình NN 3D (three.js) | Apache-2.0 | 5.2k · 2022-12 | Ngừng phát triển → **ý tưởng**. | P3 |
| [alexlenail/NN-SVG](https://github.com/alexlenail/NN-SVG) | Vẽ sơ đồ kiến trúc NN ra SVG | MIT | 5.7k · 2026-06 | **Dùng làm công cụ** sinh hình minh hoạ cho bài học. | P2 |
| [vdumoulin/conv_arithmetic](https://github.com/vdumoulin/conv_arithmetic) | GIF padding/stride/dilation/transposed conv | MIT | 14.7k · 2023-06 · ARCHIVED | **Dùng lại ảnh GIF** (ghi công) cho bài convolution. | P1 |
| [dair-ai/ml-visuals](https://github.com/dair-ai/ml-visuals) | Bộ hình/template minh hoạ ML | MIT | 17.4k · 2023-02 | **Dùng lại hình** (ghi công). | P2 |
| [lutzroeder/netron](https://github.com/lutzroeder/netron) | Xem kiến trúc model (ONNX, PyTorch, …) | MIT | 33.5k · 2026-09 | **Link** trong bài "đọc kiến trúc model". | P3 |
| [idyll-lang/idyll](https://github.com/idyll-lang/idyll) | Ngôn ngữ viết explorable essay | MIT | 2.0k · 2023-02 | **Ý tưởng**: MDX + React đã thay thế được. | P3 |
| [Machine-Learning-Tokyo/Interactive_Tools](https://github.com/Machine-Learning-Tokyo/Interactive_Tools) | Danh sách tool tương tác ML | **Không license** | 2.9k · 2024-08 | **Chỉ dùng làm danh mục tra cứu**, không chép. | P2 |
| [mlu-explain/mlu-explain.github.io](https://github.com/mlu-explain/mlu-explain.github.io) | Bản build site MLU-Explain | **Không license** | 85 · 2026-06 | Không dùng; dùng repo `aws-samples/aws-mlu-explain` ở trên. | — |

---

## 2. Nội dung học mở (dịch / dùng lại)

### 2a. Sách & khoá học

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [d2l-ai/d2l-vi](https://github.com/d2l-ai/d2l-vi) | **Bản tiếng Việt** "Đắm mình vào Học Sâu" | Text CC BY-SA 4.0, code MIT (sửa đổi) | 662 · 2022-07 | **Dùng lại thuật ngữ + đoạn giải thích** (giữ CC BY-SA, ghi nguồn). Nguồn tốt cho từ điển Anh–Việt. | P1 |
| [d2l-ai/d2l-en](https://github.com/d2l-ai/d2l-en) | Dive into Deep Learning bản gốc | Text CC BY-SA 4.0, code MIT (sửa đổi) | 29.6k · 2024-08 | Dịch các chương mới hơn bản VI; lấy bài tập cuối chương. | P1 |
| [tiepvupsu/ebookMLCB](https://github.com/tiepvupsu/ebookMLCB) | Sách "Machine Learning cơ bản" (Vũ Hữu Tiệp) | CC BY-SA 4.0 | 1.9k · 2024-07 | **Nguồn tiếng Việt gốc**: trích/tóm tắt có ghi nguồn, giữ BY-SA. Chuẩn thuật ngữ quen thuộc với người Việt. | P1 |
| [tiepvupsu/tabml_book](https://github.com/tiepvupsu/tabml_book) | Sách "Machine Learning cho dữ liệu dạng bảng" | BSD (theo file LICENSE) | 43 · 2021-08 | Tham khảo nội dung tiếng Việt về feature engineering. | P3 |
| [cs231n/cs231n.github.io](https://github.com/cs231n/cs231n.github.io) | Ghi chú môn CS231n Stanford | MIT | 11.0k · 2026-05 | **Dịch ghi chú** (backprop, CNN, optimization) giữ notice. Bài tập assignment không có ở repo này. | P1 |
| [microsoft/ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners) | 26 bài ML cổ điển, **52 quiz**, có sẵn `translations/vi` | MIT | 90.6k · 2026-09 | **Lấy quiz → chuyển YAML** gắn tag khái niệm; tham khảo bản dịch tiếng Việt. | P1 |
| [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) | 24 bài AI/DL kèm quiz | MIT | 68.6k · 2026-09 | Như trên cho phần DL. | P2 |
| [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners) | 21 bài GenAI | MIT | 119.9k · 2026-09 | Nguồn cho mục AI engineering sau này. | P3 |
| [karpathy/nn-zero-to-hero](https://github.com/karpathy/nn-zero-to-hero) | Notebook đi kèm series video Zero to Hero | MIT | 24.4k · 2024-08 | Gắn video + notebook vào mục "Đào sâu"; chuyển notebook micrograd/makemore thành bài code. | P1 |
| [karpathy/micrograd](https://github.com/karpathy/micrograd) | Autograd vô hướng ~100 dòng | MIT | 17.6k · 2026-08 | **Chạy thẳng trong Pyodide** (Python thuần) → bài "tự viết backprop"; vẽ đồ thị tính toán bằng React Flow. | P1 |
| [karpathy/makemore](https://github.com/karpathy/makemore) | LM mức ký tự | MIT | 4.3k · 2024-06 | Cần PyTorch → chỉ lấy phần bigram viết lại bằng NumPy. | P3 |
| [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) | GPT tối giản | MIT | 63.2k · 2025-11 | Tài liệu đọc/giải thích code; không chạy được trong Pyodide (PyTorch). | P2 |
| [karpathy/nanochat](https://github.com/karpathy/nanochat) | Pipeline ChatGPT mini đầy đủ ($100) | MIT | 58.1k · 2026-09 | Đề tài cho mục AI engineering / nghiên cứu. | P3 |
| [karpathy/minbpe](https://github.com/karpathy/minbpe) | BPE tokenizer tối giản | MIT | 10.7k · 2024-07 | **Python thuần → chạy trong Pyodide**: bài tập "tự viết BPE". | P1 |
| [jaymody/picoGPT](https://github.com/jaymody/picoGPT) | GPT-2 bằng NumPy (~60 dòng) | MIT | 3.5k · 2023-04 | Bài tập forward pass Transformer bằng NumPy trong Pyodide (dùng trọng số đồ chơi). | P2 |
| [harvardnlp/annotated-transformer](https://github.com/harvardnlp/annotated-transformer) | Transformer chú thích từng dòng | MIT | 7.5k · 2024-04 | Dịch/tóm tắt, dùng làm bài đọc song song. | P2 |
| [labmlai/annotated_deep_learning_paper_implementations](https://github.com/labmlai/annotated_deep_learning_paper_implementations) | 60+ paper cài đặt kèm chú thích song song | MIT | 67.5k · 2026-01 | **Ý tưởng hiển thị code–giải thích song song**; dịch chọn lọc cho mục nghiên cứu. | P2 |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Xây LLM từ đầu (notebook của sách) | Apache-2.0 (code; văn bản sách vẫn thuộc bản quyền sách) | 105.1k · 2026-09 | Lấy code notebook làm bài tập; không chép lời giảng. | P2 |
| [eriklindernoren/ML-From-Scratch](https://github.com/eriklindernoren/ML-From-Scratch) | Thuật toán ML bằng NumPy thuần | MIT | 32.9k · 2023-10 | **Nguồn lời giải mẫu** cho bài code NumPy (chạy được Pyodide). | P1 |
| [trekhleb/homemade-machine-learning](https://github.com/trekhleb/homemade-machine-learning) | ML từ đầu + demo Jupyter | MIT | 24.8k · 2025-11 | Như trên, thêm demo trực quan. | P2 |
| [google-deepmind/educational](https://github.com/google-deepmind/educational) | Colab dạy học của DeepMind | Apache-2.0 | 1.5k · 2022-09 | Tham khảo bài tập. | P3 |
| [dataflowr/notebooks](https://github.com/dataflowr/notebooks) | Notebook khoá DL (Marc Lelarge) | Apache-2.0 | 1.3k · 2026-05 | Nguồn bài tập DL. | P3 |
| [ageron/handson-ml3](https://github.com/ageron/handson-ml3) | Notebook sách Hands-On ML | Apache-2.0 (code) | 14.2k · 2026-05 | Lấy code ví dụ; không chép văn bản sách. | P3 |
| [jakevdp/PythonDataScienceHandbook](https://github.com/jakevdp/PythonDataScienceHandbook) | Sách NumPy/pandas/sklearn | Code MIT, **text CC BY-NC-ND** | 49.9k · 2024-06 | Code dùng được; **text không được dịch** → chỉ link. | P3 |
| [mrdbourke/pytorch-deep-learning](https://github.com/mrdbourke/pytorch-deep-learning) | Khoá PyTorch Zero to Mastery | MIT | 19.0k · 2026-02 | Tham khảo cấu trúc bài + bài tập. | P3 |
| [fchollet/deep-learning-with-python-notebooks](https://github.com/fchollet/deep-learning-with-python-notebooks) | Notebook sách DLwP | MIT | 20.3k · 2025-09 | Code ví dụ Keras. | P3 |
| [huggingface/course](https://github.com/huggingface/course) | Khoá HF (có nhiều bản dịch) | Apache-2.0 | 4.2k · 2026-09 | Dịch cho mục NLP/Transformers. | P3 |
| [stas00/ml-engineering](https://github.com/stas00/ml-engineering) | Sách mở về ML engineering (train/infra) | CC BY-SA 4.0 | 19.0k · 2026-09 | Dịch cho mục AI engineering, giữ BY-SA. | P3 |
| [google-research/tuning_playbook](https://github.com/google-research/tuning_playbook) | Quy trình tune model deep learning | CC BY 4.0 | 30.3k · 2024-06 | **Dịch toàn bộ** (BY cho phép) cho mục "hướng dẫn nghiên cứu". | P2 |
| [probml/pml-book](https://github.com/probml/pml-book) | Trang sách PML của Kevin Murphy | MIT (repo) | 5.7k · 2025-12 | Link; PDF sách có điều khoản riêng. | P3 |
| [mml-book/mml-book.github.io](https://github.com/mml-book/mml-book.github.io) | Sách Mathematics for ML | **Không license** | 16.0k · 2025-03 | Chỉ link. | P3 |
| [udlbook/udlbook](https://github.com/udlbook/udlbook) | Understanding Deep Learning + notebook | **CC BY-NC-ND 4.0** | 9.9k · 2026-07 | Chỉ link (không được dịch). | P3 |
| [Yorko/mlcourse.ai](https://github.com/Yorko/mlcourse.ai) | Khoá ML mở | CC BY-NC-SA 4.0 | 10.7k · 2026-09 | Chỉ dùng nếu LAIFS phi thương mại vĩnh viễn. | P3 |
| [Atcold/NYU-DLSP20](https://github.com/Atcold/NYU-DLSP20) | Khoá DL NYU 2020 (có bản dịch tiếng Việt) | CC BY-NC-SA 4.0 | 6.8k · 2025-06 | Như trên; tham khảo bản dịch VI. | P3 |
| [fastai/fastbook](https://github.com/fastai/fastbook) | Sách fastai dạng notebook | Code **GPL-3.0**, prose **không cho phép phân phối lại** | 25.3k · 2026-09 | **Chỉ link.** | P3 |
| [fastai/course22](https://github.com/fastai/course22) | Notebook khoá fast.ai 2022 | **Không license** | 3.7k · 2024-10 | Chỉ link. | P3 |

### 2b. Bài tập "implement from scratch" & câu hỏi phỏng vấn

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [rougier/numpy-100](https://github.com/rougier/numpy-100) | 100 bài NumPy có lời giải (sinh từ file ktx) | MIT | 14.5k · 2026-08 | **Dịch + chuyển thành bài code chấm tự động** trong Pyodide. Bộ khởi động lý tưởng cho `bai-tap`. | P1 |
| [Kyubyong/numpy_exercises](https://github.com/Kyubyong/numpy_exercises) | Bài tập NumPy theo chủ đề | MIT | 1.7k · 2023-05 | Bổ sung cho numpy-100. | P2 |
| [guipsamora/pandas_exercises](https://github.com/guipsamora/pandas_exercises) | Bài tập pandas | BSD-3-Clause | 13.1k · 2025-10 | pandas chạy được Pyodide → bài xử lý dữ liệu. | P3 |
| [srush/Tensor-Puzzles](https://github.com/srush/Tensor-Puzzles) | 21 câu đố broadcasting, cấm dùng hàm có sẵn | MIT | 4.3k · 2024-07 | **Port sang NumPy** (gốc dùng torch/numpy-like) → loạt "câu đố tensor" rất độc. | P1 |
| [srush/Autodiff-Puzzles](https://github.com/srush/Autodiff-Puzzles) | Câu đố tự tính đạo hàm | MIT | 511 · 2024-10 | Port thành bài luyện đạo hàm/backprop. | P2 |
| [srush/GPU-Puzzles](https://github.com/srush/GPU-Puzzles) | Câu đố học CUDA (numba) | MIT | 12.5k · 2024-09 | Cần GPU → chỉ ý tưởng cho mục AI engineering. | P3 |
| [Exorust/TorchLeet](https://github.com/Exorust/TorchLeet) | 68 bài PyTorch từ phỏng vấn thật | MIT | 2.5k · 2026-09 | Đề **được phép dùng lại**; viết lại bằng NumPy để chạy Pyodide (torch không có trong Pyodide). **Thay thế hợp pháp cho Deep-ML.** | P1 |
| [Open-Deep-ML/DML-OpenProblem](https://github.com/Open-Deep-ML/DML-OpenProblem) | Đề bài Deep-ML (có public) | **"Educational Use Only License"** (license riêng) | 698 · 2025-11 | **Không chép đề** vào LAIFS nếu chưa đọc kỹ điều khoản; lấy ý tưởng format đề + test. | P3 |
| [stanford-cs336/assignment1-basics](https://github.com/stanford-cs336/assignment1-basics) | Bài tập CS336 (tokenizer, Transformer từ đầu) | MIT | 2.8k · 2026-04 | Lấy khung đề + test cho bài nâng cao. | P3 |
| [alexeygrigorev/data-science-interviews](https://github.com/alexeygrigorev/data-science-interviews) | Câu hỏi + đáp án phỏng vấn DS/ML | CC BY 4.0 | 10.1k · 2026-08 | **Dịch thành quiz** (ghi công) — bộ câu hỏi có license rõ nhất. | P1 |
| [alirezadir/AIMLInterviews](https://github.com/alirezadir/AIMLInterviews) | Hướng dẫn phỏng vấn ML/AI (đổi tên từ Machine-Learning-Interviews) | MIT | 9.7k · 2026-09 | Nguồn câu hỏi ML system design. | P2 |
| [chiphuyen/ml-interviews-book](https://github.com/chiphuyen/ml-interviews-book) | Sách phỏng vấn ML | **Không license** | 4.8k · 2025-03 | Chỉ link. | P3 |
| [andrewekhalel/MLQuestions](https://github.com/andrewekhalel/MLQuestions) | Câu hỏi phỏng vấn ML/CV | **Không license** | 4.9k · 2026-09 | Chỉ link / tự viết lại câu hỏi. | P3 |
| [khangich/machine-learning-interview](https://github.com/khangich/machine-learning-interview) | Tài liệu phỏng vấn ML | **Không license** | 12.8k · 2023-08 | Chỉ link. | P3 |
| [youssefHosni/Data-Science-Interview-Questions-Answers](https://github.com/youssefHosni/Data-Science-Interview-Questions-Answers) | Câu hỏi DS | **Không license** | 5.9k · 2024-09 | Chỉ link. | P3 |
| [BoltzmannEntropy/interviews.ai](https://github.com/BoltzmannEntropy/interviews.ai) | Sách "Deep Learning Interviews" | **Không license** | 4.9k · 2025-08 | Chỉ link. | P3 |

---

## 3. Hạ tầng học tập

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | Thuật toán FSRS bằng TypeScript | MIT | 791 · 2026-09 | **Thư viện**: lưu thẻ ôn trong localStorage, chưa cần backend. | P1 |
| [open-spaced-repetition/fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki) | FSRS cho Anki, tài liệu thuật toán | MIT | 4.1k · 2026-08 | Đọc wiki để hiểu tham số. | P3 |
| [ankitects/anki](https://github.com/ankitects/anki) | Anki | **AGPL-3.0** | 31.1k · 2026-09 | Chỉ ý tưởng UX; không dùng code. Có thể xuất deck `.apkg` sau này. | P3 |
| [xyflow/xyflow](https://github.com/xyflow/xyflow) | React Flow – UI đồ thị nút | MIT | 38.4k · 2026-09 | **Thư viện** vẽ đồ thị khái niệm / lộ trình, và đồ thị tính toán micrograd. | P1 |
| [cytoscape/cytoscape.js](https://github.com/cytoscape/cytoscape.js) | Thư viện đồ thị + layout tự động | MIT | 11.2k · 2026-09 | Phương án thay React Flow khi đồ thị khái niệm lớn cần auto-layout. | P3 |
| [vasturiano/react-force-graph](https://github.com/vasturiano/react-force-graph) | Đồ thị force 2D/3D cho React | MIT | 3.3k · 2026-02 | Trang "bản đồ kiến thức" dạng tinh vân. | P3 |
| [uiwjs/react-codemirror](https://github.com/uiwjs/react-codemirror) | CodeMirror 6 cho React | MIT | 2.3k · 2026-07 | **Thư viện editor** cho `CodeRunner.tsx` (nhẹ hơn Monaco nhiều). | P1 |
| [codemirror/dev](https://github.com/codemirror/dev) | CodeMirror 6 (gốc) | MIT | 7.8k · 2026-04 · ARCHIVED | Repo GitHub đã **chuyển sang code.haverbeke.berlin**; gói npm `@codemirror/*` vẫn là nguồn chính. | — |
| [microsoft/monaco-editor](https://github.com/microsoft/monaco-editor) | Editor của VS Code | MIT | 46.8k · 2026-09 | Không khuyến nghị (nặng, kém trên mobile). | P3 |
| [pyodide/pyodide](https://github.com/pyodide/pyodide) | Python + NumPy trên WASM | MPL-2.0 | 14.8k · 2026-09 | Đã dùng. Ghi chú: dùng `setInterruptBuffer` để dừng vòng lặp vô hạn. | (đang dùng) |
| [elilambnz/react-py](https://github.com/elilambnz/react-py) | Hook React chạy Python (Pyodide worker, `input()`, interrupt) | MIT | 300 · 2026-03 | **Đọc code để mượn** cách xử lý `input()`/interrupt/package; không nhất thiết thêm dependency vì đã có CodeRunner. | P2 |
| [alexmojaki/futurecoder](https://github.com/alexmojaki/futurecoder) | Khoá Python cho người mới, chạy Pyodide, kiểm tra từng bước, gợi ý dần | MIT | 1.5k · 2026-05 | **Ý tưởng + code** cho chấm bài theo bước, hint lũy tiến, traceback thân thiện. Rất gần mô hình LAIFS. | P1 |
| [jupyterlite/jupyterlite](https://github.com/jupyterlite/jupyterlite) | JupyterLab chạy hoàn toàn trong trình duyệt | BSD-3-Clause | 4.9k · 2026-09 | Nút "Mở trong notebook" cho bài dài (host tĩnh). | P2 |
| [marimo-team/marimo](https://github.com/marimo-team/marimo) | Notebook Python reactive, xuất WASM/HTML | Apache-2.0 | 22.8k · 2026-09 | Làm viz Python tương tác (slider) xuất HTML tĩnh rồi nhúng. | P2 |
| [jupyter-book/thebe](https://github.com/jupyter-book/thebe) | Biến code block tĩnh thành chạy được | BSD-3-Clause | 442 · 2026-06 | Không cần (CodeRunner đã làm việc này). | P3 |
| [pyscript/pyscript](https://github.com/pyscript/pyscript) | Python trong HTML | Apache-2.0 | 18.7k · 2026-09 | Không cần; Pyodide trực tiếp gọn hơn. | P3 |
| [nalgeon/codapi-js](https://github.com/nalgeon/codapi-js) | Snippet code tương tác cho tài liệu | MIT | 620 · 2026-08 | Ý tưởng UI snippet nhỏ. | P3 |
| [jupyter/nbgrader](https://github.com/jupyter/nbgrader) | Chấm bài notebook | BSD-3-Clause | 1.4k · 2026-09 | Ý tưởng format "ô lời giải / ô test ẩn" cho `scripts/kiem_tra_bai_tap.py`. | P3 |
| [wingkwong/react-quiz-component](https://github.com/wingkwong/react-quiz-component) | Component quiz React từ JSON | MIT | 403 · 2026-09 | Đã có `Quiz.tsx` → chỉ lấy ý tưởng (hẹn giờ, chấm điểm từng phần). | P3 |
| [stevenpetryk/mafs](https://github.com/stevenpetryk/mafs) | Component React cho toán tương tác (điểm kéo được, đồ thị hàm, vector) | MIT | 3.4k · 2025-03 | **Thư viện chính cho viz tự làm**: GD, hồi quy tuyến tính, tích vô hướng, ma trận biến đổi. | P1 |
| [jsxgraph/jsxgraph](https://github.com/jsxgraph/jsxgraph) | Hình học/đồ thị tương tác | LGPL-3.0 | 1.4k · 2026-09 | Phương án thay Mafs khi cần hình phức tạp. | P3 |
| [observablehq/plot](https://github.com/observablehq/plot) | Biểu đồ khai báo gọn | ISC | 5.4k · 2026-09 | Vẽ loss curve, histogram trong viz. | P2 |
| [code-hike/codehike](https://github.com/code-hike/codehike) | Code walkthrough trong MDX (cuộn → highlight dòng) | MIT | 5.4k · 2026-03 | Bài "đọc code micrograd/nanoGPT từng đoạn". | P2 |
| [codesandbox/sandpack](https://github.com/codesandbox/sandpack) | Editor + chạy JS | Apache-2.0 | 6.2k · 2025-04 | Không cần (bài là Python). | — |
| [mermaid-js/mermaid](https://github.com/mermaid-js/mermaid) | Sơ đồ từ text | MIT | 90.3k · 2026-09 | Sơ đồ quy trình trong MDX (render lúc build). | P2 |
| [nilbuild/developer-roadmap](https://github.com/nilbuild/developer-roadmap) | roadmap.sh (đổi từ kamranahmedse/developer-roadmap) | **License riêng: chỉ dùng cá nhân** | 367.5k · 2026-09 | **Chỉ ý tưởng UI** (roadmap có tick "đã học"). Không chép nội dung/ảnh. | P2 (ý tưởng) |
| [AMAI-GmbH/AI-Expert-Roadmap](https://github.com/AMAI-GmbH/AI-Expert-Roadmap) | Roadmap AI expert (SVG + trang web) | MIT | 31.2k · 2025-09 | **Dùng lại cấu trúc lộ trình** (ghi công) làm dữ liệu khởi đầu cho đồ thị khái niệm. Nội dung hơi cũ (2022). | P2 |

---

## 4. Tài liệu, blog, tìm kiếm, bình luận, CMS cho Astro

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [Pagefind/pagefind](https://github.com/Pagefind/pagefind) | Tìm kiếm tĩnh, index lúc build | MIT | 5.5k · 2026-09 | **Thư viện**: chạy sau `astro build`, không cần server (tiếng Việt tách từ theo khoảng trắng, cần thử chất lượng). | P1 |
| [giscus/giscus](https://github.com/giscus/giscus) | Bình luận qua GitHub Discussions | MIT | 12.1k · 2026-05 | Bình luận/hỏi đáp dưới bài mà không cần backend. | P2 |
| [withastro/starlight](https://github.com/withastro/starlight) | Theme tài liệu chính thức của Astro | MIT | 9.3k · 2026-09 | Không thay site hiện tại; cân nhắc cho mục "Hướng dẫn nghiên cứu AI" dạng docs, hoặc lấy ý tưởng sidebar/TOC. | P2 |
| [HiDeoo/starlight-blog](https://github.com/HiDeoo/starlight-blog) | Plugin blog cho Starlight | MIT | 275 · 2026-09 | Nếu mục docs dùng Starlight. | P3 |
| [expressive-code/expressive-code](https://github.com/expressive-code/expressive-code) | Khối code đẹp (tiêu đề, diff, đánh dấu dòng) | MIT | 966 · 2026-08 | **Tích hợp Astro** (`astro-expressive-code`) cho code block tĩnh trong bài. | P2 |
| [satnaing/astro-paper](https://github.com/satnaing/astro-paper) | Theme blog Astro tối giản, a11y tốt | MIT | 5.1k · 2026-09 | Mượn layout/SEO/RSS khi thêm blog. | P2 |
| [chrismwilliams/astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus) | Theme blog Astro | MIT | 1.7k · 2026-09 | Phương án thứ hai. | P3 |
| [saicaca/fuwari](https://github.com/saicaca/fuwari) | Theme blog Astro nhiều hiệu ứng | MIT | 5.0k · 2026-03 | Tham khảo UI. | P3 |
| [Thinkmill/keystatic](https://github.com/Thinkmill/keystatic) | CMS git-based, sửa MD/YAML, có tích hợp Astro | MIT | 2.4k · 2026-09 | **Cho người không rành Git** thêm câu quiz/khái niệm qua form, lưu thẳng vào repo. | P2 |
| [decaporg/decap-cms](https://github.com/decaporg/decap-cms) | CMS git-based (Netlify CMS cũ) | MIT | 19.4k · 2026-09 | Phương án thay Keystatic. | P3 |
| [tinacms/tinacms](https://github.com/tinacms/tinacms) | CMS Markdown có visual editing | Apache-2.0 | 13.8k · 2026-09 | Nặng hơn, cần Tina Cloud hoặc tự host backend. | P3 |
| [KaTeX/KaTeX](https://github.com/KaTeX/KaTeX) | Công thức toán | MIT | 20.4k · 2026-09 | Đã dùng. | (đang dùng) |

---

## 5. Độc lạ & thú vị cho người học AI

| Repo | Làm gì | License | ⭐ / cập nhật | Cách dùng cho LAIFS | Ưu tiên |
|---|---|---|---|---|---|
| [huggingface/transformers.js](https://github.com/huggingface/transformers.js) | Chạy model HF (sentiment, embedding, Whisper…) trong trình duyệt, WebGPU | Apache-2.0 | 16.3k · 2026-09 | **Viz "model thật"**: gõ câu tiếng Việt → thấy embedding / độ tương đồng / xác suất token. | P1 |
| [huggingface/transformers.js-examples](https://github.com/huggingface/transformers.js-examples) | Demo mẫu của transformers.js | Apache-2.0 | 2.1k · 2026-02 | Copy demo làm điểm xuất phát. | P2 |
| [niieani/gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) | Tokenizer BPE của OpenAI bằng JS thuần | MIT | 844 · 2026-08 | **Tokenizer playground** trong React: tô màu token, so sánh tiếng Việt vs tiếng Anh tốn bao nhiêu token. | P1 |
| [dqbd/tiktokenizer](https://github.com/dqbd/tiktokenizer) | Web playground tokenizer (Next.js) | MIT | 1.7k · 2025-04 | Mượn UI tô màu token. | P2 |
| [dqbd/tiktoken](https://github.com/dqbd/tiktoken) | tiktoken bản JS/WASM (fork của openai/tiktoken) | MIT | 1.1k · 2025-08 | Phương án thay gpt-tokenizer. | P3 |
| [mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) | Chạy LLM trong trình duyệt bằng WebGPU | Apache-2.0 | 19.1k · 2026-09 | Demo "chỉnh temperature/top-p và thấy output thay đổi" không cần server. | P2 |
| [ngxson/wllama](https://github.com/ngxson/wllama) | llama.cpp WASM (chạy cả khi không có WebGPU) | MIT | 1.2k · 2026-09 | Phương án dự phòng cho máy yếu. | P3 |
| [mlc-ai/web-stable-diffusion](https://github.com/mlc-ai/web-stable-diffusion) | Stable Diffusion trong trình duyệt | Apache-2.0 | 3.7k · 2024-03 | Demo cho bài diffusion (nặng). | P3 |
| [xenova/whisper-web](https://github.com/xenova/whisper-web) | Nhận dạng giọng nói trong trình duyệt | MIT | 3.3k · 2024-10 | Demo speech. | P3 |
| [googlecreativelab/teachablemachine-community](https://github.com/googlecreativelab/teachablemachine-community) | Code của Teachable Machine (train bằng webcam) | Apache-2.0 | 1.7k · 2026-06 | Bài mở đầu "tự dạy máy nhận diện cử chỉ trong 1 phút" cho người mới. | P2 |
| [tensorflow/tfjs](https://github.com/tensorflow/tfjs) | ML bằng JS, WebGL | Apache-2.0 | 19.1k · 2026-06 | Train model nhỏ thật trong viz (thay vì mô phỏng). | P3 |
| [ml5js/ml5-next-gen](https://github.com/ml5js/ml5-next-gen) | ml5.js – ML thân thiện cho web | License riêng ml5.js (bản trước 5/2021 là MIT) | 183 · 2026-09 | Đọc license trước khi dùng; tham khảo cách dạy người mới. | P3 |
| [karpathy/llama2.c](https://github.com/karpathy/llama2.c) | Suy luận Llama 2 trong 1 file C | MIT | 20.1k · 2024-08 | Bài đọc "LLM thực chất chỉ là vài trăm dòng" (có bản port WASM ngoài cộng đồng). | P3 |
| [karpathy/arxiv-sanity-lite](https://github.com/karpathy/arxiv-sanity-lite) | Gắn tag paper arXiv, gợi ý paper tương tự | MIT | 1.7k · 2023-06 | Ý tưởng cho mục "đọc paper": danh sách paper theo khái niệm. | P3 |
| [allenai/scholarphi](https://github.com/allenai/scholarphi) | Trình đọc PDF paper, hover ký hiệu/thuật ngữ để xem định nghĩa | Apache-2.0 | 428 · 2023-07 | **Ý tưởng**: hover thuật ngữ trong bài → hiện thẻ khái niệm LAIFS. | P2 (ý tưởng) |
| [kaixindelele/ChatPaper](https://github.com/kaixindelele/ChatPaper) | Tóm tắt/dịch paper arXiv bằng LLM | CC BY-NC-ND 4.0 | 19.9k · 2026-03 | Chỉ ý tưởng (ND, NC). | P3 |
| [dair-ai/AI-Papers-of-the-Week](https://github.com/dair-ai/AI-Papers-of-the-Week) | Paper AI nổi bật mỗi tuần (đổi tên từ ML-Papers-of-the-Week) | **Không license** | 13.2k · 2026-09 | Chỉ link làm nguồn chọn paper cho blog. | P3 |
| [hzwer/WritingAIPaper](https://github.com/hzwer/WritingAIPaper) | Cẩm nang viết paper hội nghị AI cho người mới | **Không license** | 4.1k · 2025-07 | Chỉ link cho mục "hướng dẫn nghiên cứu". | P3 |
| [jbhuang0604/awesome-tips](https://github.com/jbhuang0604/awesome-tips) | Mẹo nghiên cứu, viết paper, rebuttal (Jia-Bin Huang) | MIT | 4.7k · 2025-12 | **Dịch/tóm tắt** cho mục "hướng dẫn nghiên cứu AI". | P2 |
| [papers-we-love/papers-we-love](https://github.com/papers-we-love/papers-we-love) | Tuyển paper CS để đọc | **Không license** (phần lớn là link) | 109.8k · 2026-09 | Link. | P3 |
| [mlabonne/llm-course](https://github.com/mlabonne/llm-course) | Lộ trình LLM + notebook | Apache-2.0 | 83.0k · 2026-02 | Khung lộ trình cho mục AI engineering. | P2 |
| [chiphuyen/aie-book](https://github.com/chiphuyen/aie-book) | Tài nguyên sách AI Engineering | **Không license** | 17.5k · 2026-07 | Chỉ link. | P3 |
| [huggingface/agents-course](https://github.com/huggingface/agents-course) | Khoá AI agents | Apache-2.0 | 32.6k · 2026-09 | Dịch chọn lọc cho AI engineering. | P3 |
| [huggingface/smol-course](https://github.com/huggingface/smol-course) | Khoá fine-tune/align model nhỏ | Apache-2.0 | 6.7k · 2026-09 | Như trên. | P3 |
| [decodingai-magazine/llm-twin-course](https://github.com/decodingai-magazine/llm-twin-course) | Xây hệ thống LLM + RAG production | MIT | 4.4k · 2026-04 | Dự án capstone cho AI engineering. | P3 |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | Hướng dẫn prompt/context engineering | MIT | 78.4k · 2026-03 | Dịch chọn lọc. | P3 |
| [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) | Tutorial prompt tương tác | **Không license** | 38.2k · 2026-08 | Chỉ link. | P3 |
| [openai/openai-cookbook](https://github.com/openai/openai-cookbook) · [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) | Công thức dùng API LLM | MIT · MIT | 76.0k · 2026-09 / 52.8k · 2026-09 | Ví dụ cho AI engineering. | P3 |
| [motion-canvas/motion-canvas](https://github.com/motion-canvas/motion-canvas) | Tạo animation giải thích bằng TypeScript | MIT | 19.1k · 2026-07 | Làm video/animation ngắn kiểu 3Blue1Brown bằng TS (cùng hệ với site). | P3 |
| [ManimCommunity/manim](https://github.com/ManimCommunity/manim) · [3b1b/manim](https://github.com/3b1b/manim) | Engine animation toán | MIT · MIT | 40.9k / 94.0k · 2026-09 | Làm clip minh hoạ nhúng vào bài. | P3 |
| [algorithm-visualizer/algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) | Trực quan thuật toán từ code chạy thật | MIT | 48.7k · 2024-06 | Ý tưởng "chạy code → phát lại từng bước" cho KNN, k-means. | P3 |
| [anvaka/word2vec-graph](https://github.com/anvaka/word2vec-graph) | Đồ thị láng giềng word2vec | **Không license** | 713 · 2020-12 | Chỉ ý tưởng. | P3 |
| [amitlevy/justaneuron](https://github.com/amitlevy/justaneuron) | Backprop qua 1 nơ-ron bằng React Flow + micrograd JS | **Không license** | 3 · 2024-01 | **Chỉ ý tưởng** — đúng thứ LAIFS nên tự làm bằng xyflow. | P2 (ý tưởng) |

### Awesome-lists đáng theo dõi

| Repo | License | ⭐ / cập nhật | Ghi chú |
|---|---|---|---|
| [josephmisiti/awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | NOASSERTION (tự ghi) | 74.4k · 2026-09 | Link tra cứu. |
| [Hannibal046/Awesome-LLM](https://github.com/Hannibal046/Awesome-LLM) | CC0-1.0 | 27.4k · 2025-07 | CC0 → dùng lại tự do. |
| [ChristosChristofidis/awesome-deep-learning](https://github.com/ChristosChristofidis/awesome-deep-learning) | Không license | 28.9k · 2025-05 | Link. |
| [terryum/awesome-deep-learning-papers](https://github.com/terryum/awesome-deep-learning-papers) | Không license | 26.2k · 2024-01 | Danh sách paper kinh điển (cũ). |
| [eugeneyan/applied-ml](https://github.com/eugeneyan/applied-ml) | MIT | 30.2k · 2024-07 | Case study ML thực tế của các công ty. |
| [EthicalML/awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning) | MIT | 20.9k · 2026-09 | Cho mục AI engineering. |
| [academic/awesome-datascience](https://github.com/academic/awesome-datascience) | MIT | 30.0k · 2026-09 | Nhập môn DS. |
| [visenger/awesome-mlops](https://github.com/visenger/awesome-mlops) | Không license | 14.2k · 2024-11 | Link. |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | Apache-2.0 | 138.6k · 2026-09 | Ý tưởng dự án cho AI engineering. |
| [patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub) | MIT | 37.6k · 2026-09 | Tutorial LLM/RAG/agent. |

---

## Top 10 nên dùng ngay

1. **[rougier/numpy-100](https://github.com/rougier/numpy-100)** (MIT) — dịch + chuyển thành 100 bài code chấm tự động trong Pyodide; lấp đầy `bai-tap` nhanh nhất.
2. **[karpathy/micrograd](https://github.com/karpathy/micrograd)** (MIT) + **[xyflow/xyflow](https://github.com/xyflow/xyflow)** (MIT) — bài "tự viết backprop" chạy Pyodide, vẽ đồ thị tính toán và gradient bằng React Flow. Cùng React Flow dùng luôn cho đồ thị khái niệm.
3. **[stevenpetryk/mafs](https://github.com/stevenpetryk/mafs)** (MIT) — nền cho mọi viz toán tự làm (GD 2D, hồi quy, vector); nâng cấp `GradientDescent1D.tsx`, lấy ý tưởng từ `lilipads/gradient_descent_viz`.
4. **[open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)** (MIT) — ôn lại câu sai theo FSRS, lưu localStorage, không cần backend.
5. **[microsoft/ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners)** (MIT) + **[alexeygrigorev/data-science-interviews](https://github.com/alexeygrigorev/data-science-interviews)** (CC BY 4.0) — nguồn quiz có license rõ, ML-For-Beginners có sẵn bản dịch tiếng Việt.
6. **[d2l-ai/d2l-vi](https://github.com/d2l-ai/d2l-vi)** + **[tiepvupsu/ebookMLCB](https://github.com/tiepvupsu/ebookMLCB)** (CC BY-SA 4.0) — nội dung và thuật ngữ tiếng Việt có sẵn; bài dẫn xuất gắn nhãn `license: CC BY-SA 4.0`.
7. **[tensorflow/playground](https://github.com/tensorflow/playground)** (Apache-2.0) — fork, Việt hoá, tự host, nhúng iframe có sẵn tham số theo từng bài.
8. **[aws-samples/aws-mlu-explain](https://github.com/aws-samples/aws-mlu-explain)** (text CC BY-SA) + **[vdumoulin/conv_arithmetic](https://github.com/vdumoulin/conv_arithmetic)** (MIT) — dịch bài viết tương tác sẵn có, dùng lại GIF convolution.
9. **[uiwjs/react-codemirror](https://github.com/uiwjs/react-codemirror)** (MIT) + đọc **[alexmojaki/futurecoder](https://github.com/alexmojaki/futurecoder)** (MIT) — editor nhẹ cho CodeRunner; mượn cách chấm từng bước, gợi ý dần và traceback thân thiện.
10. **[Pagefind/pagefind](https://github.com/Pagefind/pagefind)** (MIT) — tìm kiếm tĩnh toàn site sau build, không cần server.

## Top 5 độc lạ đáng thử

1. **[srush/Tensor-Puzzles](https://github.com/srush/Tensor-Puzzles)** (MIT) — "câu đố tensor" cấm dùng hàm có sẵn, chỉ được broadcasting. Port sang NumPy chạy Pyodide thành loạt thử thách có bảng xếp hạng.
2. **Tokenizer playground tiếng Việt** với **[niieani/gpt-tokenizer](https://github.com/niieani/gpt-tokenizer)** (MIT) + **[karpathy/minbpe](https://github.com/karpathy/minbpe)** (MIT) — tô màu token để người học thấy câu tiếng Việt tốn token hơn tiếng Anh, rồi tự viết BPE bằng Python trong Pyodide.
3. **[huggingface/transformers.js](https://github.com/huggingface/transformers.js)** (Apache-2.0) — chạy model embedding thật trong trình duyệt: gõ vài câu tiếng Việt, xem độ tương đồng cosine và bản đồ 2D (kết hợp ý tưởng [poloclub/wizmap](https://github.com/poloclub/wizmap)).
4. **[Exorust/TorchLeet](https://github.com/Exorust/TorchLeet)** (MIT) — bộ đề phỏng vấn ML được phép dùng lại (Deep-ML thì không). Viết lại bằng NumPy thành chế độ "LeetCode ML" tiếng Việt.
5. **Hover thuật ngữ → thẻ khái niệm**, lấy ý tưởng từ **[allenai/scholarphi](https://github.com/allenai/scholarphi)** (Apache-2.0) — trong mọi bài học và blog, di chuột vào "gradient" sẽ hiện thẻ khái niệm LAIFS. Tận dụng đúng mô hình dữ liệu "khái niệm là trung tâm".

---

### Ghi chú kiểm chứng
- Repo đã đổi tên/chuyển chỗ (GitHub redirect 301): `kamranahmedse/developer-roadmap` → `nilbuild/developer-roadmap`; `alirezadir/Machine-Learning-Interviews` → `alirezadir/AIMLInterviews`; `dair-ai/ML-Papers-of-the-Week` → `dair-ai/AI-Papers-of-the-Week`; `executablebooks/thebe` → `jupyter-book/thebe`; `Atcold/pytorch-Deep-Learning` → `Atcold/NYU-DLSP20`; `decodingml/llm-twin-course` → `decodingai-magazine/llm-twin-course`; `callummcdougall/ARENA_3.0` → `ARENA-education/ARENA_materials` (không license, nên không đưa vào bảng).
- `livecodes/livecodes` trả về 404 lúc kiểm tra nên không đưa vào.
- Deep-ML **có** repo public (`Open-Deep-ML/DML-OpenProblem`) nhưng dùng license "Educational Use Only" tự soạn, không phải license mở chuẩn.
- Số sao và ngày cập nhật là số liệu tại thời điểm kiểm tra; cần xem lại license trước khi chép thật, vì license có thể thay đổi.
