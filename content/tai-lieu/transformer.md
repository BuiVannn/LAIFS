---
tieu_de: "Attention Is All You Need"
tac_gia: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"]
nam: 2017
loai: paper
nha_xb: "NeurIPS 2017"
nguon: "https://arxiv.org/abs/1706.03762"
quyen: khong-ro
khai_niem: ["transformer", "attention", "seq2seq", "dich-may-nmt", "embedding", "tokenization"]
chuong:
  - so: "1"
    ten: "Introduction"
    khai_niem: ["seq2seq", "dich-may-nmt"]
  - so: "2"
    ten: "Background"
    khai_niem: ["seq2seq", "attention"]
  - so: "3"
    ten: "Model Architecture"
    khai_niem: ["transformer", "attention", "softmax", "mlp", "embedding", "tokenization", "nhan-ma-tran"]
  - so: "4"
    ten: "Why Self-Attention"
    khai_niem: ["attention"]
  - so: "5"
    ten: "Training"
    khai_niem: ["optimizer", "learning-rate", "dropout", "regularization", "du-lieu-song-ngu"]
  - so: "6"
    ten: "Results"
    khai_niem: ["danh-gia-dich", "dich-may-nmt"]
  - so: "7"
    ten: "Conclusion"
    khai_niem: ["transformer"]
file_may: "resources/transformer.pdf"
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong"
---

Bài báo gốc giới thiệu kiến trúc Transformer, và cũng là văn bản trung tâm của tầng 5 trong lộ trình LAIFS. Chỉ 15 trang nhưng rất đặc: mỗi đoạn gói một ý mà các sách phải dùng cả chương để trải ra. Đừng đọc nó đầu tiên — hãy đọc sau chương 3 của "NLP with Transformers" hoặc chương 16 của Géron, khi bạn đã hình dung được self-attention làm gì. Mục 3.2 (scaled dot-product và multi-head attention) là phần đáng bỏ công nhất: nếu viết lại được công thức đó bằng lời của mình thì coi như đã nắm khái niệm. Mục 5 đáng đọc vì cho thấy lịch trình learning rate warmup và các lựa chọn regularization thực tế. Lưu ý bối cảnh: bài báo ra đời để giải bài toán dịch máy, nên các số liệu ở mục 6 đều là BLEU trên WMT.
