// Bản nháp hiện khi chạy local (npm run dev) hoặc khi build với HIEN_NHAP=1 (bản xem trước cho nhóm).
// Build thường chỉ chứa nội dung đã duyệt.
export const hienNhap =
  import.meta.env.DEV || (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.HIEN_NHAP === '1';

export const hienThi = (d: { data: { trang_thai: string } }) => hienNhap || d.data.trang_thai === 'da_duyet';

export const TEN_TANG: Record<number, string> = {
  0: 'Công cụ & môi trường',
  1: 'Toán nền',
  2: 'ML cổ điển',
  3: 'Deep Learning',
  4: 'Thị giác máy tính',
  5: 'Ngôn ngữ & LLM',
  6: 'Generative & mở rộng',
};

export type KhaiNiemTom = { id: string; ten: string; coTrang: boolean };

type MucKhaiNiem = { id: string; body?: string; data: { ten_vi: string; trang_thai: string } };
export const tomTat = (k: MucKhaiNiem): KhaiNiemTom => ({
  id: k.id,
  ten: k.data.ten_vi,
  coTrang: hienThi(k) && !!k.body?.trim(),
});

// Dữ liệu cho trang ôn tập / tô màu lộ trình: mọi câu hỏi được phép hiện, kèm thông tin khái niệm
export async function duLieuCauHoi() {
  const { getCollection } = await import('astro:content');
  const khaiNiem = await getCollection('khaiNiem');
  const theoId = new Map(khaiNiem.map((k) => [k.id, k]));
  const quiz = (await getCollection('quiz')).filter(hienThi);
  return quiz.flatMap((q) => {
    const k = theoId.get(q.id);
    if (!k) return [];
    const tienQuyet = k.data.tien_quyet.map((t) => theoId.get(t)).filter((x) => x !== undefined).map(tomTat);
    return q.data.cau_hoi.map((c) => ({ khoa: `${q.id}/${c.id}`, c, khaiNiem: tomTat(k), tienQuyet }));
  });
}

// Dữ liệu gọn của mọi khái niệm cho các island (Hôm nay, Lộ trình, Buổi học…)
export async function duLieuKhaiNiem() {
  const { getCollection } = await import('astro:content');
  const quiz = new Map((await getCollection('quiz')).filter(hienThi).map((q) => [q.id, q.data.cau_hoi.map((c) => `${q.id}/${c.id}`)]));
  return (await getCollection('khaiNiem'))
    .map((k) => ({
      id: k.id,
      ten: k.data.ten_vi,
      tang: k.data.tang,
      thuTu: k.data.thu_tu,
      tienQuyet: k.data.tien_quyet,
      coTrang: tomTat(k).coTrang,
      dinhNghia: k.data.dinh_nghia,
      yChinh: k.data.y_chinh,
      khoa: quiz.get(k.id) ?? [],
    }))
    .sort((a, b) => a.thuTu - b.thuTu);
}
