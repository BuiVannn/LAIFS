# LAIFS — Học AI

Web tự học ML/DL cho nhóm. Khung ý tưởng: [KHUNG-Y-TUONG.md](KHUNG-Y-TUONG.md).

```bash
npm install
npm run dev            # http://localhost:4321 — hiện cả bản nháp
npm run build          # bản build chỉ chứa nội dung trang_thai: da_duyet
npm run check:bai-tap  # kiểm tra lời giải mẫu đạt hết test (cần python3 + numpy)
npm run check:tien-do  # kiểm tra logic lịch ôn tập và mức thành thạo
```

## Thêm nội dung

Mọi thứ gắn với một **khái niệm** qua id (tên file).

| Loại | File | Ghi chú |
|---|---|---|
| Khái niệm + bài học | `content/khai-niem/<id>.mdx` | Frontmatter là thẻ tóm tắt + `tai_lieu`; phần thân là bài học. Công thức viết `$...$`. File chỉ có frontmatter = "sắp có" |
| Trắc nghiệm | `content/quiz/<id>.yaml` | Mỗi câu có `id` **cố định** (đổi là mất lịch ôn của người học). `loai`: `mot` (dap_an: số thứ tự), `nhieu` (dap_an: danh sách), `so` (dap_an: số, `sai_so`). Nhúng giữa bài: `<CauHoi cau="<khái niệm>/<id câu>" />` — câu đã nhúng không lặp lại ở cuối bài |
| Bài code | `content/bai-tap/<ten-bai>/` | `de.md` (frontmatter `khai_niem`), `starter.py`, `solution.py`, `tests.py` (các hàm `test_*` dùng `assert`) |
| Trực quan hoá | `src/viz/<Ten>.tsx` | Component React, nhúng vào `.mdx` bằng `<Ten client:visible />`. Viz nên nhận prop `duDoan` (xem `DuDoan.tsx`) để khoá tham số và bắt đoán trước khi chạy |
| Ý chính | `y_chinh` trong frontmatter khái niệm | Hiện ra sau khi người học viết "giải thích lại bằng lời của bạn" để tự đối chiếu |

Cấu trúc frontmatter đầy đủ: `src/content.config.ts` (sai định dạng thì `npm run dev` báo lỗi ngay).

## Tiến độ người học

Lưu trong localStorage (khoá `laifs:v1`, xem `src/tien-do.ts`): kết quả từng câu + thẻ lịch ôn FSRS, bài giải thích lại, bài code đã đạt. Người học tự sao lưu ở trang **Ôn hôm nay**.

## Quy trình duyệt

AI/người soạn để `trang_thai: nhap` → người duyệt chạy qua checklist ở mục 7 của KHUNG-Y-TUONG.md → đổi thành `da_duyet`, điền `nguoi_duyet`.
