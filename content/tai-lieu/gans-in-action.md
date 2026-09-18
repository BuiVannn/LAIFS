---
tieu_de: "GANs in Action: Deep Learning with Generative Adversarial Networks"
tac_gia: ["Jakub Langr", "Vladimir Bok"]
nam: 2019
loai: sach
nha_xb: "Manning Publications"
nguon: "https://www.manning.com/books/gans-in-action"
quyen: thuong-mai
khai_niem: ["mlp", "ham-kich-hoat", "cross-entropy", "batch-norm", "optimizer"]
chuong:
  - so: "1"
    ten: "Introduction to GANs"
    khai_niem: ["mlp"]
  - so: "2"
    ten: "Intro to generative modeling with autoencoders"
    khai_niem: ["mlp", "ham-kich-hoat", "ham-mat-mat"]
  - so: "3"
    ten: "Your first GAN: Generating handwritten digits"
    khai_niem: ["mlp", "cross-entropy", "ham-mat-mat", "optimizer", "ham-kich-hoat"]
  - so: "4"
    ten: "Deep Convolutional GAN"
    khai_niem: ["batch-norm", "ham-kich-hoat"]
  - so: "5"
    ten: "Training and common challenges: GANing for success"
    khai_niem: ["khoi-tao-trong-so", "learning-rate", "danh-gia-mo-hinh"]
  - so: "6"
    ten: "Progressing with GANs"
    khai_niem: ["batch-norm"]
  - so: "7"
    ten: "Semi-Supervised GAN"
    khai_niem: ["softmax", "cross-entropy"]
  - so: "8"
    ten: "Conditional GAN"
    khai_niem: ["embedding"]
  - so: "9"
    ten: "CycleGAN"
    khai_niem: []
  - so: "10"
    ten: "Adversarial examples"
    khai_niem: ["dao-ham-rieng-gradient"]
  - so: "11"
    ten: "Practical applications of GANs"
    khai_niem: []
  - so: "12"
    ten: "Looking ahead"
    khai_niem: []
file_may: "resources/ML Books/Gans-in-action-deep-learning-with-generative-adversarial-networks.pdf"
trang_thai: da_duyet
nguoi_duyet: "ra-soat-tu-dong"
---

Sách chuyên đề hẹp: chỉ nói về GAN, chủ yếu bằng code Keras. Toán ở mức vừa — có hàm mất mát và trò chơi hai người chơi viết bằng công thức, nhưng luôn kèm giải thích bằng lời. Điểm mạnh là chương 3 và 5: dựng một GAN tối giản rồi mổ xẻ các kiểu hỏng khi huấn luyện (mode collapse, mất cân bằng generator/discriminator) — đọc phần này giúp bạn hiểu rõ hơn vì sao learning rate và khởi tạo trọng số lại quan trọng đến thế. Với lộ trình LAIFS, đây là sách đọc thêm sau tầng 3, không nằm trên đường chính tới dịch máy. Nội dung dừng ở 2019 nên không có diffusion model.
