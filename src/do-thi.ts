// Đồ thị khái niệm (dùng được cả phía server lẫn island): mục tiêu → các khái niệm cần học
import { chuoiTuan, mucDo, mucTieuTuan, tuan, type MucDo, type TienDo } from './tien-do.ts';

export type KhaiNiemDL = {
  id: string;
  ten: string;
  tang: number;
  thuTu: number; // đã đảm bảo tiền quyết luôn có thu_tu nhỏ hơn
  tienQuyet: string[];
  coTrang: boolean;
  dinhNghia?: string;
  yChinh?: string[];
  khoa: string[]; // khoá câu hỏi "<id>/<id câu>"
};

export const MUC_TIEU_MAC_DINH = 'lan-truyen-nguoc';

// Mục tiêu + mọi tiền quyết (trực tiếp và gián tiếp)
export function canChoMucTieu(ds: KhaiNiemDL[], mucTieu: string) {
  const theoId = new Map(ds.map((k) => [k.id, k]));
  const can = new Set<string>();
  const di = (id: string) => {
    if (can.has(id) || !theoId.has(id)) return;
    can.add(id);
    theoId.get(id)!.tienQuyet.forEach(di);
  };
  di(mucTieu);
  return can;
}

// Đường học: các khái niệm cần, theo thứ tự học được
export const duongHoc = (ds: KhaiNiemDL[], mucTieu: string) => {
  const can = canChoMucTieu(ds, mucTieu);
  return ds.filter((k) => can.has(k.id)).sort((a, b) => a.thuTu - b.thuTu);
};

export const mucDoKN = (td: TienDo | null, k: KhaiNiemDL): MucDo | 'chua-co' =>
  !k.coTrang ? 'chua-co' : td ? mucDo(td, k.khoa) : 'chua-hoc';

// Bài nên học tiếp: khái niệm đầu tiên trên đường chưa đạt "Hiểu" và đã có bài
export const baiTiepTheo = (td: TienDo | null, ds: KhaiNiemDL[], mucTieu: string) =>
  duongHoc(ds, mucTieu).find((k) => k.coTrang && !['hieu', 'vung'].includes(mucDoKN(td, k)));

export const TEN_THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// Đoạn text ngắn để dán vào nhóm chat — kể mình đã học gì, không so bì
export function baoCaoTuan(td: TienDo, ds: KhaiNiemDL[], mucTieu: string, now = new Date()) {
  const ngay = tuan(td, now);
  const soBuoi = ngay.filter((x) => x > 0).length;
  const soCau = ngay.reduce((a, b) => a + b, 0);
  const duong = duongHoc(ds, mucTieu);
  const daHieu = duong.filter((k) => ['hieu', 'vung'].includes(mucDoKN(td, k))).map((k) => k.ten);
  const tiep = baiTiepTheo(td, ds, mucTieu);
  const mt = ds.find((k) => k.id === mucTieu);
  return [
    `Tuần này: ${soBuoi}/${mucTieuTuan(td)} buổi · ${soCau} câu · chuỗi ${chuoiTuan(td, now).tuan} tuần`,
    `Mục tiêu: ${mt?.ten ?? mucTieu} (${daHieu.length}/${duong.length} khái niệm đã Hiểu)`,
    tiep ? `Đang học: ${tiep.ten}` : 'Đã đi hết đường tới mục tiêu',
  ].join('\n');
}
