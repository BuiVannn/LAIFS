---
tieu_de: "Efficient Estimation of Word Representations in Vector Space"
tac_gia: ["Tomas Mikolov", "Kai Chen", "Greg Corrado", "Jeffrey Dean"]
nam: 2013
loai: paper
nha_xb: "ICLR 2013 Workshop Track"
nguon: "https://arxiv.org/abs/1301.3781"
quyen: khong-ro
khai_niem: ["embedding", "vector-ma-tran", "softmax", "tokenization"]
chuong:
  - so: "1"
    ten: "Introduction"
    khai_niem: ["embedding", "tokenization"]
  - so: "2"
    ten: "Model Architectures"
    khai_niem: ["embedding", "mlp", "softmax", "nhan-ma-tran"]
  - so: "3"
    ten: "New Log-linear Models"
    khai_niem: ["embedding", "softmax"]
  - so: "4"
    ten: "Results"
    khai_niem: ["embedding", "danh-gia-mo-hinh"]
  - so: "5"
    ten: "Examples of the Learned Relationships"
    khai_niem: ["embedding", "vector-ma-tran"]
  - so: "6"
    ten: "Conclusion"
    khai_niem: ["embedding"]
  - so: "7"
    ten: "Follow-Up Work"
    khai_niem: []
file_may: "resources/word2vec.pdf"
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong"
---

Bài báo word2vec, nơi ý tưởng biểu diễn từ bằng vector dày trở nên rẻ đủ để ai cũng làm được. Chỉ 12 trang và toán rất nhẹ so với tầm ảnh hưởng: hai kiến trúc CBOW và Skip-gram được mô tả trong vài đoạn. Với lộ trình LAIFS, đây là tài liệu gốc cho khái niệm embedding ở tầng 5, và nên đọc trước "Attention Is All You Need" vì embedding là lớp đầu tiên của Transformer. Mục 5 là phần dễ nhớ nhất: quan hệ vua − đàn ông + đàn bà ≈ nữ hoàng, minh hoạ cụ thể cho việc phép cộng trừ vector mang ý nghĩa ngữ nghĩa. Lưu ý bài báo không mô tả chi tiết thủ thuật huấn luyện (negative sampling) — phần đó nằm ở bài báo tiếp theo cùng nhóm tác giả, cuối năm 2013.
