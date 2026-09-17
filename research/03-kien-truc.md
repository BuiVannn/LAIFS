# 03 — Kiến trúc theo giai đoạn: blog, người dùng, phân quyền, mở rộng

> Ngày: 2026-09-17. Đã kiểm tra với tài liệu chính thức và npm registry cùng ngày (Astro 7.3.3, @astrojs/cloudflare 14.3.2, @keystatic/astro 6.0.0, decap-cms-app 3.16.2, @sveltia/cms 0.214, tinacms 3.14, pagefind 1.5.2, better-auth 1.7.5, @supabase/supabase-js 2.116).
> Nguyên tắc giữ nguyên từ KHUNG-Y-TUONG.md: **tĩnh trước, backend khi thật cần**. Mỗi giai đoạn chỉ bật khi điều kiện kích hoạt xảy ra thật, không làm trước "cho sau này".

---

## 0. Trả lời nhanh

| Câu hỏi | Trả lời ngắn |
|---|---|
| Blog tách repo riêng? | **Không.** Thêm collection trong cùng repo. Tách repo sẽ mất liên kết giữa bài viết và khái niệm, mất chung schema/layout/search. |
| Tác giả không biết Git? | **Pages CMS** (bản host sẵn, miễn phí, mời cộng tác viên bằng email, không cần adapter). Nếu ai cũng có GitHub: **Sveltia CMS** cũng được. |
| Một mô hình nội dung hay nhiều collection? | **Vài collection, chung một "lõi" trường** (tiêu đề, tác giả, trạng thái duyệt, gắn khái niệm). Không gộp hết vào một collection khổng lồ. |
| Cần CSDL không? | **Chưa.** Chỉ cần khi có đồng bộ đa thiết bị/ôn tập ngắt quãng thật sự được dùng (G2). Bình luận dùng Giscus, không cần CSDL. |
| Tách CSDL nội dung vs người dùng? | **Có, và đã tách sẵn:** nội dung = Git, người dùng = Postgres (khi có). **Không bao giờ** đưa nội dung vào CSDL. |
| Phân quyền admin/editor/reviewer? | **Editor/reviewer để GitHub lo** (PR + CODEOWNERS + branch protection). Trong CSDL chỉ cần `user` và (có thể) `admin`. |
| Deploy? | **Cloudflare Workers (static assets)** — asset tĩnh miễn phí không giới hạn, adapter chính thức của Astro chỉ còn nhắm Workers, Cloudflare sở hữu đội Astro từ 01/2026. |

---

## 1. Hiện trạng (G0) và những gì đã đúng

```
  GitHub repo (public: BuiVannn/LAIFS)
  ├─ content/khai-niem/*.mdx   ─┐
  ├─ content/quiz/*.yaml        ├─ astro build (static) ──► dist/ ──► CDN
  ├─ content/bai-tap/*/         ─┘      │
  └─ src/content.config.ts (Zod)        └─ lọc trang_thai: da_duyet
                                                   │
                                   Trình duyệt ────┤
                                   ├─ Pyodide (Web Worker) chấm bài code
                                   ├─ Quiz chấm tại chỗ
                                   └─ localStorage: quiz:<id>, bai-tap:<id>
```

Đã có sẵn 3 thứ rất đáng giá, **đừng đập**:
1. **Git là CMS + lịch sử + quyền duyệt** (`trang_thai: nhap | da_duyet`, `nguoi_duyet`).
2. **Schema Zod** trong `src/content.config.ts` → sai frontmatter là build lỗi. Đây chính là "API" giữa người viết và web.
3. **Không có server** → không có gì để bị hack, không tốn tiền, không phải trực.

Chi phí G0: **0 đ**.

---

## 2. Lộ trình giai đoạn

```
G0 (hiện tại)        G1 (nhiều người viết)     G2 (tài khoản)              G3 (công khai lớn)
tĩnh + localStorage  + blog/hướng dẫn           + Supabase Auth + Postgres  + chấm điểm phía server
                     + CMS git-based            (gọi từ React island,       + adapter/on-demand routes
                     + Giscus, Pagefind         site VẪN tĩnh)              + i18n, moderation
                     + preview bản nháp
  0 đ                 0 đ                        0 đ (free tier)            ~0–25 USD/tháng
```

### G1 — Nhiều người viết (blog, hướng dẫn nghiên cứu, AI engineering)

**Kích hoạt khi** (cần ít nhất 1):
- Có ≥ 1 bài blog / hướng dẫn thật đã viết xong nháp (không mở "khu" rỗng).
- Có ≥ 1 người viết không dùng được Git/PR.
- Người duyệt cần xem bản nháp trên web mà không chạy `npm run dev`.

**Thêm gì:**

| Hạng mục | Làm gì | Ghi chú |
|---|---|---|
| Collection `baiViet` (blog) | `content/blog/<slug>.md(x)` | Có ngày, tác giả, thẻ, gắn khái niệm |
| Collection `huongDan` | `content/huong-dan/<khu>/<slug>.md(x)` | Chỉ thêm khi có bài hướng dẫn đầu tiên. Trước đó viết dạng blog cũng được |
| Collection `tacGia` | `content/tac-gia/<id>.yaml` | Chỉ khi > 1 tác giả |
| CMS | Pages CMS: thêm 1 file `.pages.yml` ở gốc repo | Không cần adapter, không cần server |
| Bình luận | Giscus (GitHub Discussions) | Repo đã public → dùng được ngay |
| Tìm kiếm | Pagefind chạy sau `astro build` | Khi > ~30 trang, hoặc có blog |
| Preview nháp | Build nhánh không phải production với biến `HIEN_NHAP=1` | Sửa 1 dòng `hienThi` trong `src/lib.ts` |
| Deploy | Cloudflare Workers Builds nối GitHub | Chỉ static assets, chưa cần adapter |

**Chi phí:** 0 đ (Pages CMS open source + app host miễn phí; Giscus miễn phí; Workers static assets miễn phí).

### G2 — Tài khoản người dùng

**Kích hoạt khi** (cần ít nhất 1, và **đã có người thực sự phàn nàn**):
- Người học dùng ≥ 2 thiết bị và mất tiến độ (localStorage không đồng bộ).
- Làm ôn tập ngắt quãng (FSRS) — lịch ôn mà mất khi xoá trình duyệt là vô dụng.
- Nhóm muốn thấy tiến độ của nhau / bảng xếp hạng nhóm.

**Thêm gì:** Supabase (Auth + Postgres + RLS), gọi **trực tiếp từ React island bằng `@supabase/supabase-js`**, site vẫn `output: static`, chưa cần adapter. Đăng nhập GitHub/Google OAuth hoặc magic link.

```
  Trình duyệt (trang tĩnh từ CDN)
  └─ React island (Quiz, CodeRunner, TienDo)
       │  supabase-js + publishable/anon key (công khai được, VÌ có RLS)
       ▼
  Supabase ── Auth (user.id)
           └─ Postgres: tien_do, the_on_tap   ← RLS: user_id = auth.uid()
```

Bảng tối thiểu (không hơn):

```sql
create table tien_do (
  user_id uuid references auth.users on delete cascade,
  khoa    text,              -- 'quiz:gradient-descent' | 'bai-tap:gd-mot-bien' (giữ đúng key localStorage hiện tại)
  gia_tri jsonb not null,    -- {dung, tong} | {dat: true} | trạng thái thẻ FSRS
  cap_nhat timestamptz default now(),
  primary key (user_id, khoa)
);
alter table tien_do enable row level security;
revoke all on tien_do from anon;
create policy "chu so huu" on tien_do for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
```

Mẹo giữ nhẹ: **một bảng key–value** dùng lại đúng key localStorage đang có → chưa đăng nhập vẫn dùng localStorage, đăng nhập thì đẩy lên. Thêm bảng riêng khi có truy vấn thật cần (vd. bảng xếp hạng).

**Chi phí:** 0 đ trên Free (500 MB DB, 50.000 MAU, 2 project). Bẫy: **project Free bị tạm dừng sau 1 tuần không hoạt động** (nghỉ hè/nghỉ Tết là dính) — bật lại thủ công trong dashboard, hoặc lên Pro 25 USD/tháng khi đã công khai.

### G3 — Mở công khai, dữ liệu phải đáng tin

**Kích hoạt khi:**
- Có bảng xếp hạng/chứng nhận **công khai** (người lạ có động cơ gian lận).
- Có bài nộp cần người chấm/nhận xét, hoặc bài cần PyTorch (không chạy được trong Pyodide).
- Cần trang chỉ admin xem (thống kê câu hay sai toàn site, xoá tài khoản, xử lý báo cáo).
- Có người đọc tiếng Anh thật sự (không phải "có thể sau này").

**Thêm gì:**
- `@astrojs/cloudflare` + `export const prerender = false` **chỉ cho vài route** (`/api/cham-quiz`, `/quan-tri/*`). Mọi trang nội dung vẫn prerender.
- Chấm quiz phía server: bỏ `dap_an` khỏi props gửi xuống client (hiện `Quiz.tsx` nhận cả đáp án → ai mở DevTools cũng thấy). Chỉ cần khi điểm có giá trị công khai.
- Vai trò `admin` trong CSDL (xem mục 4).
- i18n routing (mục 6.2).

**Chi phí:** Workers Free (100.000 request động/ngày, asset tĩnh không tính) + Supabase Free/Pro → **0–25 USD/tháng**. Chấm code server-side (sandbox chạy Python người lạ) là một dự án riêng, đắt và nguy hiểm — ưu tiên link Colab lâu nhất có thể.

---

## 3. Blog và mô hình nội dung

### 3.1 Cùng repo hay tách?

**Cùng repo, cùng Astro project.** Lý do:
- Bài blog/hướng dẫn muốn gắn `khai_niem: [gradient-descent]` → trang khái niệm tự hiện "bài viết liên quan". Tách repo là mất `reference()` + kiểm tra khi build.
- Một layout, một search index (Pagefind), một deploy, một quy trình duyệt.
- Astro content collections sinh ra cho đúng việc này; build Astro 7 đủ nhanh cho hàng nghìn trang (và 7.2 có incremental static builds thử nghiệm nếu sau này chậm).

Chỉ tách khi: blog có đội vận hành riêng, tên miền riêng, và gần như không liên kết với bài học. Hiện không phải vậy.

### 3.2 Một collection hay nhiều?

**Nhiều collection, chung lõi.** Các loại khác nhau thật:

| Loại | Đặc điểm | Collection |
|---|---|---|
| Khái niệm | Nút trong đồ thị, có tầng, tiên quyết, quiz, bài tập | `khaiNiem` (giữ nguyên) |
| Blog | Có ngày, tác giả, mang tính thời điểm, không cần thứ tự | `baiViet` |
| Hướng dẫn (nghiên cứu / engineering) | Lâu dài, theo chuỗi có thứ tự, cập nhật định kỳ | `huongDan` với trường `khu` |
| Tác giả | Dữ liệu dùng chung | `tacGia` |

Gộp tất cả vào một collection "bai" với hàng chục trường optional → schema lỏng, Zod không bắt lỗi được gì, form CMS rối. Tách collection nhưng dùng chung object lõi thì vừa chặt vừa không lặp code.

"Khu" Nghiên cứu và Engineering **là giá trị enum**, không phải collection riêng: cùng cấu trúc (chuỗi bài có thứ tự), khác chủ đề. Thêm khu mới = thêm 1 giá trị enum.

### 3.3 Schema gợi ý (thêm vào `src/content.config.ts` khi tới G1)

```ts
import { defineCollection, reference } from 'astro:content';

// Lõi dùng chung cho mọi nội dung dài do người viết
const loi = {
  tieu_de: z.string(),
  mo_ta: z.string().max(200),                       // dùng cho thẻ, SEO, Pagefind
  tac_gia: z.array(reference('tacGia')).min(1),
  trang_thai: trangThai,                            // tái dùng: 'nhap' | 'da_duyet'
  nguoi_duyet: z.string().optional(),
  khai_niem: z.array(reference('khaiNiem')).default([]), // nối về đồ thị khái niệm
  the: z.array(z.string()).default([]),
  cap_nhat: z.coerce.date().optional(),
};

const tacGia = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/tac-gia' }),
  schema: z.object({ ten: z.string(), github: z.string().optional(), gioi_thieu: z.string().optional() }),
});

const baiViet = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
  schema: z.object({ ...loi, ngay: z.coerce.date() }),
});

// Thêm khi có bài hướng dẫn đầu tiên
const huongDan = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/huong-dan' }), // id = 'nghien-cuu/doc-paper'
  schema: z.object({
    ...loi,
    khu: z.enum(['nghien-cuu', 'engineering']),
    chuoi: z.string().optional(),   // nhóm bài thành series
    thu_tu: z.number().int().default(0),
    muc_do: z.enum(['nhap_mon', 'trung_binh', 'nang_cao']),
  }),
});
```

Lưu ý: nếu đặt `khu` theo thư mục thì có thể suy ra từ `id`, nhưng giữ trường `khu` tường minh giúp CMS hiện dropdown và Zod bắt lỗi — đổi lại phải nhớ khớp thư mục. Chọn 1 trong 2 và ghi vào README; đừng dùng cả hai.

### 3.4 Người viết không biết Git: so sánh CMS git-based

| | **Pages CMS** | **Sveltia CMS** | **Keystatic** | **Decap CMS** | **TinaCMS** |
|---|---|---|---|---|---|
| Cách chạy | App host sẵn (app.pagescms.org) hoặc tự host; cấu hình `.pages.yml` | SPA tĩnh tại `/admin`, cấu hình YAML (tương thích Decap) | Admin UI là route trong chính site Astro | SPA tĩnh tại `/admin` | Admin build kèm site + TinaCloud (hoặc tự host backend) |
| Cần adapter/on-demand rendering? | **Không** | **Không** | **Có** (docs Astro: cần adapter) | Không | Không cho site; backend là TinaCloud |
| Người viết cần tài khoản GitHub? | **Không** — mời qua email (collaborator) | Có (GitHub backend) | Có ở GitHub mode (quyền write); không nếu dùng Keystatic Cloud | Có (cần thêm OAuth provider nếu không dùng Netlify) | Không (tài khoản TinaCloud) |
| Miễn phí | Có (open source) | Có (MIT) | Có; Keystatic Cloud Free ≤ 3 user/team, Pro 10 USD/team/tháng | Có | Free 2 user; Team 24 USD/project/tháng |
| Tình trạng 09/2026 | Hoạt động | Hoạt động rất nhanh, tự nhận "feature complete", thay thế Decap | 6.0.0 hỗ trợ Astro 7 (08/2026); đã từng vỡ với Astro 6 | Cộng đồng duy trì, nhịp chậm (3.16.2) | Hoạt động (3.14) |
| Hợp dự án này? | **Tốt nhất cho G1** | Tốt nếu ai cũng có GitHub | Trung bình: kéo theo adapter chỉ để có trang admin | Kém hơn Sveltia | Quá nặng + giới hạn user |

Link: [Astro CMS guides](https://docs.astro.build/en/guides/cms/) · [Pages CMS docs](https://pagescms.org/docs/) · [Pages CMS collaborators](https://pagescms.org/docs/configuration/collaborators/) · [Sveltia CMS](https://github.com/sveltia/sveltia-cms) · [Keystatic & Astro](https://docs.astro.build/en/guides/cms/keystatic/) · [Keystatic GitHub mode](https://keystatic.com/docs/github-mode) · [Keystatic Cloud](https://keystatic.com/docs/cloud) · [Decap releases](https://decapcms.org/docs/releases/) · [TinaCMS pricing](https://tina.io/pricing)

**Khuyến nghị:** Pages CMS. Kết hợp với cơ chế có sẵn: CMS commit thẳng vào repo với `trang_thai: nhap` → bản build production **tự ẩn** nháp → người duyệt đổi thành `da_duyet`. Không cần editorial workflow trả phí.

Hạn chế cần biết của Pages CMS: collaborator qua email không quản lý được `.pages.yml`; commit của collaborator đi bằng token của GitHub App và mặc định **không ghi tên người viết** vào commit → trường `tac_gia` trong frontmatter là nguồn sự thật về tác giả, đừng dựa vào `git log`.

---

## 4. Dữ liệu người dùng và phân quyền

### 4.1 Dữ liệu nào thực sự cần server?

| Dữ liệu | Cần server? | Giải pháp rẻ nhất | Giai đoạn |
|---|---|---|---|
| Tiến độ quiz/bài tập, 1 thiết bị | Không | localStorage (đang có) | G0 |
| Code nháp của bài tập | Không | localStorage (đang có) | G0 |
| Bình luận dưới bài | Không cần CSDL riêng | **Giscus** (GitHub Discussions) | G1 |
| "Video này hữu ích" | Không cần CSDL riêng | Reactions của Giscus | G1 |
| Tiến độ đồng bộ đa thiết bị | **Có** | Supabase, bảng `tien_do` | G2 |
| Lịch ôn tập ngắt quãng (FSRS) | **Có** (nếu muốn đồng bộ) | Cùng bảng `tien_do` (jsonb); thuật toán chạy client | G2 |
| Bảng xếp hạng **trong nhóm bạn** | Có (đọc chéo) | View/policy cho phép đọc tổng điểm; chấp nhận chấm ở client | G2 |
| Bảng xếp hạng **công khai** | Có + chấm điểm server | Endpoint on-demand, giấu đáp án | G3 |
| Bài nộp cần người nhận xét | Có | Ưu tiên: GitHub PR/Issue hoặc Giscus; chỉ tự xây khi quá tải | G3 |
| Chấm code PyTorch | Có + sandbox | Link Colab; tự xây là dự án riêng | G3+ |

### 4.2 So sánh lựa chọn backend

| | **Giscus** | **Supabase** (Auth + Postgres + RLS) | **Better Auth + DB** (vd. D1) | **Firebase** (Auth + Firestore) | **Cloudflare D1** tự làm |
|---|---|---|---|---|---|
| Giải quyết | Chỉ bình luận/reaction | Auth + CSDL + phân quyền hàng | Chỉ auth (tự chọn DB) | Auth + NoSQL | Chỉ CSDL SQLite |
| Site vẫn static được? | **Có** (script nhúng) | **Có** — supabase-js gọi từ island, bảo vệ bằng RLS. (Guide Astro dùng `output: 'server'` cho auth qua cookie, nhưng không bắt buộc nếu chỉ dùng client) | **Không** — cần route on-demand + adapter | Có (SDK client + Security Rules) | Không — cần Worker/route |
| Free tier | Miễn phí hoàn toàn | 500 MB DB, 50.000 MAU, 1 GB storage, 2 project, **tạm dừng sau 1 tuần không dùng** | Thư viện miễn phí; D1 Free: 5 triệu row đọc/ngày, 100.000 row ghi/ngày, 5 GB | 50.000 MAU; Firestore 1 GiB, 50K đọc/20K ghi mỗi ngày | như cột trái |
| Trả phí khi lớn | — | Pro 25 USD/tháng | Workers Paid (từ 5 USD/tháng) | Blaze trả theo dùng | Workers Paid |
| Độ phức tạp | Rất thấp | Thấp–trung bình (phải hiểu RLS) | Trung bình–cao (tự lo session, bảo mật, migration) | Trung bình (NoSQL, lock-in) | Cao (tự viết API + auth) |
| Hợp dự án | **G1** | **G2 — khuyến nghị** | Khi đã ở G3 và muốn gom hết về Cloudflare | Không khuyến nghị (NoSQL kém cho truy vấn thống kê; stack lệch) | Không, trừ khi đi cùng Better Auth |

Link: [giscus](https://giscus.app/) · [Supabase pricing](https://supabase.com/pricing) · [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Astro + Supabase](https://docs.astro.build/en/guides/backend/supabase/) · [Astro authentication guide](https://docs.astro.build/en/guides/authentication/) · [Better Auth + Astro](https://www.better-auth.com/docs/integrations/astro) · [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) · [Firebase pricing](https://firebase.google.com/pricing) · [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)

### 4.3 Vai trò: cái nào tự xây, cái nào để GitHub lo

| Vai trò | Quyền | Ai quản lý | Tự xây? |
|---|---|---|---|
| **Khách** | Đọc nội dung đã duyệt, làm quiz, chạy code, tiến độ localStorage | — | Không |
| **Người học (user)** | Như khách + đồng bộ tiến độ | Supabase Auth (G2) | Chỉ `auth.uid()` + RLS, không cần bảng vai trò |
| **Tác giả (author)** | Tạo/sửa nội dung nháp | Pages CMS collaborator hoặc GitHub collaborator | **Không** |
| **Người duyệt (reviewer)** | Đổi `nhap` → `da_duyet`, merge PR | **GitHub**: branch protection trên `main` + `CODEOWNERS` theo thư mục + "Require review from Code Owners" | **Không** |
| **Maintainer** | Sửa code, schema, cấu hình CMS/deploy | GitHub repo admin | **Không** |
| **Admin sản phẩm** | Xem thống kê toàn site, xoá/khoá user, xử lý báo cáo | Supabase: cột `vai_tro` trong bảng `ho_so` hoặc `app_metadata` (chỉ sửa từ dashboard/service key, **không** `user_metadata` vì user tự sửa được) | Chỉ ở G3, 1–2 người |

Ví dụ `CODEOWNERS` (G1):
```
/content/khai-niem/   @nguoi-duyet-toan @nguoi-duyet-ml
/content/quiz/        @nguoi-duyet-ml
/content/blog/        @bien-tap-blog
/src/                 @BuiVannn
```
Repo `BuiVannn/LAIFS` đang **public** → branch protection và required reviews dùng được trên GitHub Free (repo private thì cần gói trả phí — xem [GitHub plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).

Lưu ý với Pages CMS: collaborator email commit bằng GitHub App. Nếu bật branch protection bắt buộc PR trên `main`, CMS sẽ không commit thẳng được → hoặc cho CMS làm việc trên nhánh `noi-dung` rồi mở PR định kỳ, hoặc (đơn giản hơn) **không** bắt PR cho `content/blog/` mà dựa vào `trang_thai: nhap` + người duyệt đổi trạng thái. Chọn cách sau cho G1.

---

## 5. Có cần tách CSDL nội dung và người dùng?

**Có — và câu trả lời đúng là "nội dung không bao giờ vào CSDL".**

```
┌──────────────────────── NỘI DUNG ────────────────────────┐   ┌──────── NGƯỜI DÙNG (G2+) ────────┐
│ Git repo: MDX/YAML                                        │   │ Supabase Postgres                 │
│ - nguồn sự thật, review bằng PR, rollback bằng git revert │   │ - tien_do(user_id, khoa, gia_tri) │
│ - schema Zod, kiểm khi build                              │   │ - ho_so(vai_tro) khi G3           │
│ - thay đổi → build → CDN                                  │   │ - RLS theo auth.uid()             │
└───────────────────────────┬───────────────────────────────┘   └──────────────┬────────────────────┘
                            │ khoá nối DUY NHẤT: id nội dung dạng chuỗi         │
                            └──── 'quiz:gradient-descent', 'bai-tap:gd-mot-bien' ┘
```

Quy tắc:
1. CSDL chỉ lưu **id chuỗi** của nội dung (slug), không lưu tiêu đề/đáp án/nội dung.
2. **Slug là hợp đồng**: đổi tên file = mất tiến độ người dùng. Nếu buộc phải đổi, thêm trường `id_cu` hoặc bảng redirect, và chạy migration `update tien_do set khoa=...`.
3. Một project Supabase là đủ; không cần tách DB "nội dung" vs "người dùng" vì nội dung không ở đó.
4. Không dùng Astro live collections/CMS có DB (headless SaaS) cho nội dung bài học — sẽ mất PR review, lịch sử, và build-time validation. (Live collections cũng không hỗ trợ MDX.)

---

## 6. Mở rộng không phải đập lại

### 6.1 Cấu trúc thư mục và route

```
content/
  khai-niem/        (có)         → /khai-niem/[id]
  quiz/             (có)
  bai-tap/          (có)         → /bai-tap/[id]
  blog/             (G1)         → /blog/[...id]
  huong-dan/
    nghien-cuu/     (G1, khi có bài) → /nghien-cuu/[...id]
    engineering/    (G1, khi có bài) → /engineering/[...id]
  tac-gia/          (G1, khi > 1 tác giả)

src/pages/
  index.astro                    ("Học nền tảng" = lộ trình hiện tại, giữ ở /)
  khai-niem/[id].astro           (có — KHÔNG đổi URL)
  bai-tap/[id].astro             (có)
  blog/index.astro, blog/[...id].astro
  [khu]/index.astro, [khu]/[...id].astro   ← MỘT cặp file phục vụ cả nghien-cuu và engineering
  api/…, quan-tri/…              (G3, prerender = false)
```

Nguyên tắc:
- **Không đổi URL đang có** (`/khai-niem/...`). Không chuyển sang `/hoc/khai-niem/...` chỉ vì "cho đẹp cấu trúc".
- "Khu" là **dữ liệu** (enum `khu` + route động `[khu]`), không phải bản sao thư mục pages. Thêm khu thứ 5 = thêm enum + nhãn menu.
- Trang khái niệm tự hiện "Bài viết liên quan" bằng cách lọc `baiViet`/`huongDan` có `khai_niem` chứa id → đồ thị khái niệm vẫn là trung tâm (đúng ý tưởng lõi mục 2 KHUNG-Y-TUONG).
- `hienThi()` trong `src/lib.ts` là **cổng duy nhất** quyết định nháp/duyệt — mọi collection mới đều đi qua nó.

### 6.2 i18n (Việt/Anh): có chuẩn bị sớm không?

**Không bật bây giờ.** Chi phí thật của i18n là dịch và duy trì 2 bản nội dung, không phải cấu hình. Nhóm hiện toàn người Việt.

Điều quan trọng: Astro i18n có `prefixDefaultLocale: false` (mặc định) → khi bật sau này, URL tiếng Việt **giữ nguyên** (`/khai-niem/x`), tiếng Anh thêm `/en/khai-niem/x`. Nghĩa là **để sau không mất gì**. Chuẩn bị rẻ duy nhất đáng làm:
- Slug ASCII không dấu (đang làm đúng).
- `<html lang="vi">` (đã có) — Pagefind dùng thuộc tính này để tách index theo ngôn ngữ.
- Không hard-code chuỗi "Tầng", "Lộ trình" rải rác quá nhiều nơi — gom vào `src/lib.ts` như `TEN_TANG` đang làm.

Khi bật (G3): `i18n: { locales: ['vi', 'en'], defaultLocale: 'vi', fallback: { en: 'vi' } }`, nội dung Anh đặt `content/en/...` hoặc thêm trường `ngon_ngu`. Link: [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/).

### 6.3 Tìm kiếm: Pagefind

- Chạy sau build: `"build": "astro build && npx pagefind --site dist"` (hoặc integration `astro-pagefind` 2.0.1, peer hỗ trợ Astro 7). Không server, index chia nhỏ tải theo nhu cầu.
- Đánh dấu `data-pagefind-body` ở `<main>` để không index header/footer; `data-pagefind-filter="khu:..."` để lọc theo khu/tầng.
- Chỉ index bản build production → bản nháp tự nhiên không lọt vào search. **Nhưng** preview build có `HIEN_NHAP=1` sẽ index cả nháp — chấp nhận được vì preview không công khai.
- Tiếng Việt: cần thử thực tế tìm **không dấu** ("dao ham" có ra "đạo hàm" không); nếu không, thêm `data-pagefind-meta`/từ khoá không dấu cho tiêu đề.
- Link: [Pagefind docs](https://pagefind.app/docs/) (1.5 có Component UI mới).

### 6.4 Deploy và preview bản nháp

| | **Cloudflare Workers** (static assets) | **Vercel Hobby** | GitHub Pages |
|---|---|---|---|
| Site tĩnh | Asset tĩnh **miễn phí, không giới hạn** | 100 GB transfer, 1 triệu edge request/tháng | Miễn phí |
| Khi cần on-demand (G3) | `@astrojs/cloudflare` 14.x — adapter giờ **chỉ nhắm Workers** (đã bỏ Pages); Free 100.000 request/ngày | `@astrojs/vercel` 11.x; 1 triệu invocation/tháng | Không hỗ trợ |
| Preview theo nhánh/PR | Workers Builds nối GitHub; preview URL theo version/alias; bảo vệ bằng Cloudflare Access | Preview deployment mỗi push; bảo vệ bằng Vercel Authentication | Không |
| Điều khoản | OK cho công khai | **Hobby chỉ cho dùng phi thương mại/cá nhân** | OK |
| Ghi chú | Cloudflare mua đội Astro 01/2026; hệ sinh thái D1/KV sẵn | Tốt, nhưng vướng điều khoản nếu sau này có tài trợ/quảng cáo | Hết đường khi cần server |

**Khuyến nghị: Cloudflare Workers.** G0–G2 chỉ cần `wrangler.jsonc` trỏ `assets.directory = "./dist"`, không adapter.

**Preview bản nháp cho người duyệt** (thay đổi nhỏ nhất):
```ts
// src/lib.ts
export const hienThi = (d: { data: { trang_thai: string } }) =>
  import.meta.env.DEV || import.meta.env.HIEN_NHAP === '1' || d.data.trang_thai === 'da_duyet';
```
Đặt biến build `HIEN_NHAP=1` cho build nhánh không phải production; production không đặt. Bảo vệ preview URL bằng Cloudflare Access nếu nội dung nháp nhạy cảm (thực tế repo public nên nháp vốn đã đọc được trên GitHub). Nhớ: biến không có tiền tố `PUBLIC_` chỉ đọc được ở phía server/build — ở đây dùng lúc build nên đúng.

Link: [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) · [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Workers preview URLs](https://developers.cloudflare.com/workers/configuration/previews/) · [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) · [Vercel Hobby](https://vercel.com/docs/plans/hobby) · [Cloudflare mua Astro](https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-astro-to-accelerate-the-future-of-high-performance-web-development/) · [Astro 7.0](https://astro.build/blog/astro-7/)

---

## 7. Rủi ro và bẫy hay gặp

1. **Đáp án nằm ở client.** `Quiz.tsx` nhận `dap_an` qua props; Pyodide chấm tại máy người học. Với nhóm bạn: chấp nhận. Với bảng xếp hạng công khai: **điểm không đáng tin** cho tới khi chấm server (G3). Đừng xây leaderboard công khai trên dữ liệu client.
2. **Supabase key và RLS.** Key công khai (anon/publishable) nằm trong JS là bình thường **chỉ khi mọi bảng đều bật RLS và đã revoke grant thừa**. Bảng quên bật RLS = ai cũng đọc/ghi được. `service_role`/secret key tuyệt đối không vào code client.
3. **Supabase Free tự tạm dừng** sau 1 tuần không hoạt động → nhóm nghỉ học một thời gian là web "mất tiến độ". Luôn giữ localStorage làm lớp dự phòng.
4. **Vai trò trong `user_metadata`** — user tự sửa được. Dùng `app_metadata` hoặc bảng có RLS chỉ admin ghi.
5. **Đổi slug làm mất tiến độ và link ngoài.** Slug là hợp đồng giữa Git và CSDL (mục 5).
6. **CMS WYSIWYG phá MDX/KaTeX.** Editor rich-text có thể escape `$...$`, `<Viz client:visible />`. Cho blog dùng `.md` + editor markdown/code; bài khái niệm có viz vẫn sửa bằng code/PR, không qua CMS.
7. **Bật on-demand rendering quá sớm.** Thêm adapter chỉ để có trang admin CMS (Keystatic) hoặc auth cookie khi supabase-js client là đủ → thêm runtime, secret, giới hạn CPU 10 ms của Workers Free, mà không thêm giá trị.
8. **Sessions Astro trên Cloudflare dùng KV mặc định**; KV Free chỉ 1.000 lượt ghi/ngày. Nếu G3 dùng Astro sessions nhiều, sẽ chạm trần — dùng session của Supabase/Better Auth trong DB, hoặc tắt sessions (Astro 7.2 cho opt-out).
9. **Plugin hệ sinh thái chậm theo major của Astro.** Keystatic từng vỡ với Astro 6 vài tháng. Mỗi dependency gắn vào pipeline build (CMS integration, adapter) là một thứ chặn nâng cấp. Pages CMS/Sveltia/Giscus/Pagefind **không** phụ thuộc phiên bản Astro — thêm một lý do chọn chúng.
10. **Mở "khu" rỗng.** Tạo menu Nghiên cứu/Engineering trước khi có bài = trang trống, ấn tượng xấu khi mở công khai. Thêm route khi có bài thứ nhất.
11. **Vercel Hobby cấm thương mại.** Nếu sau này có tài trợ/quảng cáo/khoá trả phí → vi phạm điều khoản.
12. **Giscus buộc người bình luận có GitHub.** Hợp với cộng đồng AI/dev; nếu mở cho người học phổ thông thì đây là rào cản — lúc đó (G3) mới cân nhắc bình luận trong Supabase kèm moderation.
13. **Nút thắt vẫn là nội dung và người duyệt**, không phải kiến trúc. CODEOWNERS giúp phân tải duyệt; đừng để 1 người duyệt mọi thứ.
14. **Bản nháp public trên GitHub.** Repo public → nháp chưa duyệt (có thể sai kiến thức) ai cũng đọc được trên GitHub. Chấp nhận, hoặc giữ nháp ở nhánh riêng.

---

## 8. Khuyến nghị cuối cùng

**Làm ngay: không có gì về kiến trúc.** G0 đúng cho nhóm nhỏ. Tiếp tục viết nội dung.

**Khi có bài blog/hướng dẫn đầu tiên hoặc người viết không biết Git (G1), làm đúng thứ tự:**
1. Thêm `baiViet` (+ `tacGia` nếu > 1 người) vào `src/content.config.ts` với lõi chung; route `/blog/[...id]`. `huongDan` + route `[khu]` chỉ khi có bài hướng dẫn.
2. Deploy lên Cloudflare Workers (static assets, chưa adapter); build nhánh preview với `HIEN_NHAP=1`.
3. Pages CMS với `.pages.yml` cho `content/blog/` (markdown thuần); mời người viết qua email.
4. `CODEOWNERS` + branch protection cho `content/khai-niem/`, `content/quiz/`, `src/`.
5. Giscus cho bình luận; Pagefind khi có search thật sự cần.

**Khi có người mất tiến độ vì đổi thiết bị hoặc làm FSRS (G2):** Supabase Free, gọi từ React island, một bảng `tien_do` key–value có RLS, localStorage làm lớp dự phòng. **Vẫn static, vẫn không adapter.**

**Khi mở công khai có điểm số/xếp hạng/admin (G3):** thêm `@astrojs/cloudflare`, chỉ vài route `prerender = false` để chấm server và trang quản trị; vai trò `admin` trong `app_metadata`/bảng `ho_so`; bật i18n nếu có người đọc tiếng Anh thật; cân nhắc Supabase Pro 25 USD/tháng.

**Không làm:** tách repo blog, đưa nội dung vào CSDL, tự xây hệ thống editor/reviewer, Firebase, TinaCMS, Keystatic (trừ khi đã có adapter vì lý do khác), bật i18n "cho sẵn", sandbox chấm PyTorch.
