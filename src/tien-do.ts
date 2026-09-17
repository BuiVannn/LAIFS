// Tiến độ học: một object JSON trong localStorage, dùng chung cho mọi island.
// Khoá câu hỏi = "<id khái niệm>/<id câu>" — đổi tên file khái niệm hoặc id câu sẽ mất tiến độ của câu đó.
import { fsrs, createEmptyCard, Rating, TypeConvert, type Card } from 'ts-fsrs';

const KHOA = 'laifs:v1';
const SU_KIEN = 'laifs:tien-do';
const lich = fsrs({ enable_short_term: false });

export type KetQuaCau = {
  dauTien: number; // lần trả lời đầu tiên (ms)
  lanCuoi: { dung: boolean; chac: boolean; luc: number };
  the: Card; // thẻ FSRS
};

export type TienDo = {
  phienBan: 1;
  cauHoi: Record<string, KetQuaCau>;
  giaiThich: Record<string, string>;
  baiTap: Record<string, true>;
};

const rong = (): TienDo => ({ phienBan: 1, cauHoi: {}, giaiThich: {}, baiTap: {} });

const hopLe = (x: any): x is TienDo =>
  x && x.phienBan === 1 && typeof x.cauHoi === 'object' && typeof x.giaiThich === 'object' && typeof x.baiTap === 'object';

export function doc(): TienDo {
  try {
    const x = JSON.parse(localStorage.getItem(KHOA) ?? 'null');
    if (!hopLe(x)) return rong();
    for (const k in x.cauHoi) x.cauHoi[k].the = TypeConvert.card(x.cauHoi[k].the);
    return x;
  } catch {
    return rong();
  }
}

function ghi(td: TienDo) {
  try {
    localStorage.setItem(KHOA, JSON.stringify(td));
  } catch {}
  window.dispatchEvent(new Event(SU_KIEN));
}

export const theoDoi = (fn: () => void) => {
  window.addEventListener(SU_KIEN, fn);
  window.addEventListener('storage', fn); // tab khác
  return () => {
    window.removeEventListener(SU_KIEN, fn);
    window.removeEventListener('storage', fn);
  };
};

// Sai → Again, đúng nhưng đoán → Hard, đúng và chắc → Good
export function ghiKetQua(khoa: string, dung: boolean, chac: boolean, luc = Date.now()) {
  const td = doc();
  const cu = td.cauHoi[khoa];
  const diem = !dung ? Rating.Again : chac ? Rating.Good : Rating.Hard;
  const the = lich.next(cu?.the ?? createEmptyCard(new Date(luc)), new Date(luc), diem).card;
  td.cauHoi[khoa] = { dauTien: cu?.dauTien ?? luc, lanCuoi: { dung, chac, luc }, the };
  ghi(td);
}

export function ghiGiaiThich(khaiNiem: string, noiDung: string) {
  const td = doc();
  td.giaiThich[khaiNiem] = noiDung;
  ghi(td);
}

export function ghiBaiTapDat(id: string) {
  const td = doc();
  td.baiTap[id] = true;
  ghi(td);
}

export const denHan = (td: TienDo, khoaHopLe: string[], luc = Date.now()) =>
  khoaHopLe.filter((k) => td.cauHoi[k] && td.cauHoi[k].the.due.getTime() <= luc);

export const xuat = () => JSON.stringify(doc(), null, 2);

export function nhap(json: string) {
  const x = JSON.parse(json);
  if (!hopLe(x)) throw new Error('File không đúng định dạng tiến độ LAIFS');
  for (const k in x.cauHoi) TypeConvert.card(x.cauHoi[k].the); // ném lỗi nếu thẻ hỏng
  ghi(x);
}

// 4 mức thành thạo (theo Khan Academy, nới cho người tự học — chỉ gợi ý, không khoá bài)
export type MucDo = 'chua-hoc' | 'da-thu' | 'hieu' | 'vung';
export const TEN_MUC_DO: Record<MucDo, string> = { 'chua-hoc': 'Chưa học', 'da-thu': 'Đã thử', hieu: 'Hiểu', vung: 'Vững' };
const MOT_NGAY = 20 * 3600 * 1000; // "hôm sau" tính từ 20 giờ

export function mucDo(td: TienDo, khoaCauHoi: string[]): MucDo {
  const kq = khoaCauHoi.map((k) => td.cauHoi[k]);
  const daLam = kq.filter((x) => x !== undefined);
  if (!khoaCauHoi.length || !daLam.length) return 'chua-hoc';
  if (daLam.length < kq.length) return 'da-thu';
  const tiLeDung = daLam.filter((x) => x.lanCuoi.dung).length / daLam.length;
  if (tiLeDung < 0.8) return 'da-thu';
  // Vững: câu nào cũng đúng và chắc ở một lần làm cách lần đầu ít nhất một ngày
  const vung = daLam.every((x) => x.lanCuoi.dung && x.lanCuoi.chac && x.lanCuoi.luc - x.dauTien >= MOT_NGAY);
  return vung ? 'vung' : 'hieu';
}

// Gắn nhãn mức độ cho mọi phần tử [data-muc-do='["khái-niệm/q1", ...]'] và tự cập nhật khi tiến độ đổi
export function ganNhanMucDo() {
  const capNhat = () => {
    const td = doc();
    document.querySelectorAll<HTMLElement>('[data-muc-do]').forEach((el) => {
      const m = mucDo(td, JSON.parse(el.dataset.mucDo!));
      el.className = `muc-do ${m}`;
      el.textContent = TEN_MUC_DO[m];
    });
  };
  capNhat();
  theoDoi(capNhat);
}
