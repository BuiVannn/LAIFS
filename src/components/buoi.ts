// Quy tắc của một buổi học (dùng chung cho trang Hôm nay và Buổi học)
import { ngayHocCuoi, ngayKey, type TienDo } from '../tien-do';

export const NGAY_QUAY_LAI = 7; // nghỉ từ 7 ngày trở lên coi là "quay lại"
export const TRAN_QUAY_LAI = 15;

export function laQuayLai(td: TienDo, now = new Date()) {
  const cuoi = ngayHocCuoi(td);
  if (!cuoi || cuoi === ngayKey(now)) return false;
  return (new Date(ngayKey(now)).getTime() - new Date(cuoi).getTime()) / 86400000 >= NGAY_QUAY_LAI;
}

// Khoảng nửa thời gian buổi dành cho ôn (~30 giây/câu); buổi nhanh 5 phút ~10 câu
export const soCauOn = (hanOn: number, phut: number, quayLai: boolean, nhanh = false) =>
  Math.min(hanOn, quayLai ? TRAN_QUAY_LAI : nhanh ? 10 : Math.max(5, Math.round(phut / 2)));

export type PhienBuoi = {
  batDau: number;
  nhanh: boolean;
  buoc: 'khoi-dong' | 'hoc-moi' | 'chot' | 'xong';
  khaiNiem?: string;
  on: { dung: number; tong: number };
};

const KHOA_BUOI = 'laifs:buoi';
export const docBuoi = (): PhienBuoi | null => {
  try { return JSON.parse(sessionStorage.getItem(KHOA_BUOI) ?? 'null'); } catch { return null; }
};
export const ghiBuoi = (b: PhienBuoi | null) => {
  try { b ? sessionStorage.setItem(KHOA_BUOI, JSON.stringify(b)) : sessionStorage.removeItem(KHOA_BUOI); } catch {}
};
