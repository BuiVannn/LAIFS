import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const trangThai = z.enum(['nhap', 'da_duyet']);

const khaiNiem = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './content/khai-niem' }),
  schema: z.object({
    ten_vi: z.string(),
    ten_en: z.string(),
    tang: z.number().int().min(1).max(6),
    thu_tu: z.number().int(),
    tien_quyet: z.array(z.string()).default([]),
    trang_thai: trangThai,
    nguoi_duyet: z.string().optional(),
    dinh_nghia: z.string().optional(),
    truc_giac: z.string().optional(),
    hieu_nham: z.array(z.string()).default([]),
    // Ý chính để người học tự so sánh sau khi viết "giải thích lại bằng lời của bạn"
    y_chinh: z.array(z.string()).default([]),
    tai_lieu: z
      .array(
        z.object({
          url: z.url(),
          tieu_de: z.string(),
          tac_gia: z.string(),
          loai: z.enum(['video', 'bai_viet']),
          muc_do: z.enum(['nhap_mon', 'sau', 'toan_nang']),
          ngon_ngu: z.enum(['vi', 'en']),
          moc: z.string().optional(),
          ghi_chu: z.string(),
        }),
      )
      .default([]),
  }),
});

const quiz = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/quiz' }),
  schema: z.object({
    trang_thai: trangThai,
    nguoi_duyet: z.string().optional(),
    cau_hoi: z
      .array(
        z.object({
          // id cố định, KHÔNG đổi sau khi đã đăng — tiến độ ôn tập của người học gắn vào id này
          id: z.string().regex(/^[a-z0-9-]+$/),
          loai: z.enum(['mot', 'nhieu', 'so']),
          de: z.string(),
          lua_chon: z.array(z.string()).optional(),
          dap_an: z.union([z.number(), z.array(z.number())]),
          sai_so: z.number().default(0.001),
          do_kho: z.number().int().min(1).max(3),
          giai_thich: z.string(),
        }),
      )
      .refine((ds) => new Set(ds.map((c) => c.id)).size === ds.length, 'id câu hỏi bị trùng'),
  }),
});

const baiTap = defineCollection({
  loader: glob({
    pattern: '*/de.md',
    base: './content/bai-tap',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    tieu_de: z.string(),
    khai_niem: z.string(),
    do_kho: z.number().int().min(1).max(3),
    trang_thai: trangThai,
    nguoi_duyet: z.string().optional(),
  }),
});

const taiLieu = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/tai-lieu' }),
  schema: z.object({
    tieu_de: z.string(),
    tac_gia: z.array(z.string()).default([]),
    nam: z.number().int().optional(),
    loai: z.enum(['sach', 'paper', 'khoa-hoc', 'bai-viet']),
    nha_xb: z.string().optional(),
    nguon: z.url().optional(), // trang chính thức / DOI / arXiv — KHÔNG đăng lại file
    // Quyền dùng lại: quyết định được phép trích dẫn tới đâu
    quyen: z.enum(['mo', 'thuong-mai', 'khong-ro']),
    license: z.string().optional(),
    khai_niem: z.array(z.string()).default([]),
    chuong: z.array(z.object({ so: z.string(), ten: z.string(), khai_niem: z.array(z.string()).default([]) })).default([]),
    file_may: z.string().optional(), // đường dẫn ở máy người dùng, không đưa lên web
    trang_thai: trangThai,
    nguoi_duyet: z.string().optional(),
  }),
});

export const collections = { khaiNiem, quiz, baiTap, taiLieu };
