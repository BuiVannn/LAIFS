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

export type KeHoach = {
  ngay: number[]; // 0 = thứ Hai … 6 = Chủ nhật
  phut: number;
  gio: string; // "HH:MM"
  sauViec: string;
  neuBan: string;
};

export type TienDo = {
  phienBan: 1;
  cauHoi: Record<string, KetQuaCau>;
  giaiThich: Record<string, string>;
  baiTap: Record<string, true>;
  nhatKy: Record<string, number>; // "YYYY-MM-DD" (giờ máy) → số câu đã trả lời trong ngày
  keHoach?: KeHoach;
  mucTieu?: string; // id khái niệm
};

const rong = (): TienDo => ({ phienBan: 1, cauHoi: {}, giaiThich: {}, baiTap: {}, nhatKy: {} });

const hopLe = (x: any): x is TienDo =>
  x && x.phienBan === 1 && typeof x.cauHoi === 'object' && typeof x.giaiThich === 'object' && typeof x.baiTap === 'object';

export function doc(): TienDo {
  try {
    const x = JSON.parse(localStorage.getItem(KHOA) ?? 'null');
    if (!hopLe(x)) return rong();
    for (const k in x.cauHoi) x.cauHoi[k].the = TypeConvert.card(x.cauHoi[k].the);
    x.nhatKy ??= {}; // dữ liệu cũ (trước giai đoạn B) chưa có nhật ký
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
  const ngay = ngayKey(new Date(luc));
  td.nhatKy[ngay] = (td.nhatKy[ngay] ?? 0) + 1;
  ghi(td);
}

export function ghiKeHoach(kh: KeHoach) {
  const td = doc();
  td.keHoach = kh;
  ghi(td);
}

export function ghiMucTieu(id: string) {
  const td = doc();
  td.mucTieu = id;
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
  x.nhatKy ??= {};
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
      el.textContent = el.dataset.ten ? `${el.dataset.ten} · ${TEN_MUC_DO[m]}` : TEN_MUC_DO[m];
    });
  };
  capNhat();
  theoDoi(capNhat);
}

// ---- Nhịp học theo tuần (giai đoạn B) ----
// Một "buổi" = một ngày có ít nhất 1 câu trả lời. Ngưỡng thấp có chủ đích: ôn 5 phút cũng giữ nhịp.

const pad = (n: number) => String(n).padStart(2, '0');
export const ngayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function dauTuan(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // lùi về thứ Hai
  return x;
}

const congNgay = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// 7 ngày của tuần chứa `d`: số câu đã làm mỗi ngày (thứ Hai trước)
export const tuan = (td: TienDo, d: Date) => {
  const t2 = dauTuan(d);
  return Array.from({ length: 7 }, (_, i) => td.nhatKy[ngayKey(congNgay(t2, i))] ?? 0);
};

export const mucTieuTuan = (td: TienDo) => td.keHoach?.ngay.length || 3;

// Số tuần liền đạt mục tiêu. Tuần hiện tại chưa đạt thì chưa tính là đứt.
// Mỗi 4 tuần được 1 tuần "nghỉ phép": lỡ tuần đó không làm đứt chuỗi (nhưng cũng không cộng).
export function chuoiTuan(td: TienDo, now = new Date()) {
  const can = mucTieuTuan(td);
  const ngayDau = Object.keys(td.nhatKy).filter((k) => td.nhatKy[k] > 0).sort()[0];
  if (!ngayDau) return { tuan: 0, dungPhep: false };
  const tuanDau = dauTuan(new Date(`${ngayDau}T00:00:00`)).getTime();
  let dem = 0;
  let phepCuoi = -Infinity;
  let dungPhep = false;
  for (let i = 0; ; i++) {
    const d = congNgay(dauTuan(now), -7 * i);
    if (d.getTime() < tuanDau) break;
    const dat = tuan(td, d).filter((x) => x > 0).length >= can;
    if (dat) dem++;
    else if (i === 0) continue;
    else if (i - phepCuoi >= 4) {
      phepCuoi = i;
      if (i === 1) dungPhep = true;
    } else break;
  }
  return { tuan: dem, dungPhep: dungPhep && dem > 0 };
}

export const ngayHocCuoi = (td: TienDo) => Object.keys(td.nhatKy).filter((k) => td.nhatKy[k] > 0).sort().at(-1);

// Số câu đến hạn theo ngày, `soNgay` ngày từ hôm nay; câu quá hạn dồn vào hôm nay
export function duBaoOn(td: TienDo, khoaHopLe: string[], now = new Date(), soNgay = 7) {
  const kq = Array(soNgay).fill(0);
  const homNay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  for (const k of khoaHopLe) {
    const the = td.cauHoi[k]?.the;
    if (!the) continue;
    const i = Math.max(0, Math.floor((the.due.getTime() - homNay) / 86400000));
    if (i < soNgay) kq[i]++;
  }
  return kq;
}
