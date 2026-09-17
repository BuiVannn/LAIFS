// Bản nháp chỉ hiện khi chạy local (npm run dev); bản build chỉ có nội dung đã duyệt.
export const hienThi = (d: { data: { trang_thai: string } }) =>
  import.meta.env.DEV || d.data.trang_thai === 'da_duyet';

export const TEN_TANG: Record<number, string> = {
  1: 'Toán nền',
  2: 'ML cổ điển',
  3: 'Deep Learning',
  4: 'Thị giác máy tính',
  5: 'Ngôn ngữ & LLM',
  6: 'Generative & mở rộng',
};
