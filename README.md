# LAIFS — Học AI

Web tự học ML/DL cho nhóm. Khung ý tưởng: [KHUNG-Y-TUONG.md](KHUNG-Y-TUONG.md).

```bash
npm install
npm run dev            # http://localhost:4321 — hiện cả bản nháp
npm run build          # bản build chỉ chứa nội dung trang_thai: da_duyet
npm run check:bai-tap  # kiểm tra lời giải mẫu đạt hết test (cần python3 + numpy)
```

## Thêm nội dung

Mọi thứ gắn với một **khái niệm** qua id (tên file).

| Loại | File | Ghi chú |
|---|---|---|
| Khái niệm + bài học | `content/khai-niem/<id>.mdx` | Frontmatter là thẻ tóm tắt + `tai_lieu`; phần thân là bài học. Công thức viết `$...$`. File chỉ có frontmatter = "sắp có" |
| Trắc nghiệm | `content/quiz/<id>.yaml` | `loai`: `mot` (dap_an: số thứ tự), `nhieu` (dap_an: danh sách), `so` (dap_an: số, `sai_so`) |
| Bài code | `content/bai-tap/<ten-bai>/` | `de.md` (frontmatter `khai_niem`), `starter.py`, `solution.py`, `tests.py` (các hàm `test_*` dùng `assert`) |
| Trực quan hoá | `src/viz/<Ten>.tsx` | Component React, nhúng vào `.mdx` bằng `<Ten client:visible />` |

Cấu trúc frontmatter đầy đủ: `src/content.config.ts` (sai định dạng thì `npm run dev` báo lỗi ngay).

## Quy trình duyệt

AI/người soạn để `trang_thai: nhap` → người duyệt chạy qua checklist ở mục 7 của KHUNG-Y-TUONG.md → đổi thành `da_duyet`, điền `nguoi_duyet`.
