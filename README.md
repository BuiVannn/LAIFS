# LAIFS — Học AI

Web tự học ML/DL cho nhóm. Khung ý tưởng: [KHUNG-Y-TUONG.md](KHUNG-Y-TUONG.md).

```bash
npm install
npm run dev            # http://localhost:4321 — hiện cả bản nháp
npm run build          # bản build chỉ chứa nội dung trang_thai: da_duyet
npm run check:bai-tap  # kiểm tra lời giải mẫu đạt hết test (cần python3 + numpy)
npm run check:tien-do  # kiểm tra logic lịch ôn tập và mức thành thạo
npm run build:xem-truoc # build KÈM bản nháp, dùng cho bản deploy nội bộ (tự thêm thẻ noindex)
```

## Deploy

Trang tĩnh, không cần server. Khuyến nghị **Cloudflare Pages** nối thẳng với repo GitHub: mỗi lần push là tự build lại.

1. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → chọn repo `BuiVannn/LAIFS`.
2. Framework preset: **Astro**. Build command: `npm run build:xem-truoc` (đổi thành `npm run build` khi nội dung đã được duyệt hết). Output directory: `dist`.
3. Deploy. Địa chỉ sẽ dạng `laifs.pages.dev`.
4. Muốn giới hạn người xem: **Zero Trust → Access → Applications**, thêm ứng dụng self-hosted trỏ vào domain đó, policy cho phép theo danh sách email. Miễn phí tới 50 người.

Lưu ý:
- `npm run build` chỉ xuất nội dung `trang_thai: da_duyet`. Khi tất cả còn là nháp thì bản build chỉ có vài trang — dùng `build:xem-truoc` cho tới khi duyệt xong.
- Bản build có nháp tự thêm `<meta name="robots" content="noindex">`, nên không bị Google lập chỉ mục.
- Tiến độ học lưu trên trình duyệt từng người, deploy không làm mất, nhưng mỗi thiết bị là một bản riêng cho tới khi có tài khoản (xem mục 9 KHUNG-Y-TUONG.md).

## Các trang

`/` Hôm nay (buổi học hôm nay, nhịp tuần, lịch ôn) · `/lo-trinh` bản đồ mục tiêu · `/buoi-hoc` chế độ buổi học · `/on-tap` · `/ke-hoach` · `/luyen-code` · `/khai-niem/<id>` · `/bai-tap/<id>`.

Thiết kế giữ nhịp học: xem mục 10 của [KHUNG-Y-TUONG.md](KHUNG-Y-TUONG.md).

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

Lưu trong localStorage (khoá `laifs:v1`, xem `src/tien-do.ts`): kết quả từng câu + thẻ lịch ôn FSRS, nhật ký số câu theo ngày (dùng cho nhịp tuần), kế hoạch học, mục tiêu, bài giải thích lại, bài code đã đạt. Đồ thị mục tiêu ở `src/do-thi.ts`. Người học tự sao lưu ở trang **Ôn hôm nay**.

## Quy trình duyệt

Mục danh sách trong YAML chứa `: ` phải bọc nháy kép, nếu không cả file quiz sẽ không nạp được.

AI/người soạn để `trang_thai: nhap` → người duyệt chạy qua checklist ở mục 7 của KHUNG-Y-TUONG.md → đổi thành `da_duyet`, điền `nguoi_duyet`.
