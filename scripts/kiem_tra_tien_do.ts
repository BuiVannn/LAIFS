// Kiểm tra logic tiến độ: node scripts/kiem_tra_tien_do.ts
import assert from 'node:assert/strict';

const kho = new Map<string, string>();
Object.assign(globalThis, {
  window: new EventTarget(),
  localStorage: { getItem: (k: string) => kho.get(k) ?? null, setItem: (k: string, v: string) => void kho.set(k, v) },
});
const td = await import('../src/tien-do.ts');

const NGAY = 24 * 3600 * 1000;
const t0 = Date.UTC(2026, 8, 17, 10);
const khoa = ['gd/q1', 'gd/q2'];

assert.equal(td.mucDo(td.doc(), khoa), 'chua-hoc');
assert.equal(td.mucDo(td.doc(), []), 'chua-hoc', 'khái niệm không có câu hỏi');

td.ghiKetQua('gd/q1', true, true, t0);
assert.equal(td.mucDo(td.doc(), khoa), 'da-thu', 'mới làm 1/2 câu');

td.ghiKetQua('gd/q2', false, true, t0);
assert.equal(td.mucDo(td.doc(), khoa), 'da-thu', 'đúng 50% < 80%');

td.ghiKetQua('gd/q2', true, false, t0 + 60_000);
assert.equal(td.mucDo(td.doc(), khoa), 'hieu', 'làm hết, đúng 100%, nhưng chưa ôn cách ngày');

// Lịch: sai/đoán quay lại sớm hơn đúng-chắc
const han = (k: string) => td.doc().cauHoi[k].the.due.getTime();
assert.ok(han('gd/q2') < han('gd/q1') + NGAY, 'câu đoán không được giãn xa hơn câu chắc');
assert.deepEqual(td.denHan(td.doc(), khoa, t0), [], 'vừa làm xong thì chưa đến hạn');
assert.deepEqual(td.denHan(td.doc(), khoa, t0 + 30 * NGAY).sort(), khoa, 'lâu sau thì đến hạn');
assert.deepEqual(td.denHan(td.doc(), ['khong/ton-tai'], t0 + 30 * NGAY), [], 'bỏ qua khoá không có');

// Vững: đúng + chắc ở lần làm cách lần đầu ≥ 1 ngày
td.ghiKetQua('gd/q1', true, true, t0 + 2 * NGAY);
assert.equal(td.mucDo(td.doc(), khoa), 'hieu', 'q2 lần cuối vẫn là đoán');
td.ghiKetQua('gd/q2', true, true, t0 + 2 * NGAY);
assert.equal(td.mucDo(td.doc(), khoa), 'vung');
td.ghiKetQua('gd/q2', false, true, t0 + 5 * NGAY);
assert.equal(td.mucDo(td.doc(), khoa), 'da-thu', 'quên lại 1/2 câu (50%) thì rớt về Đã thử');
assert.equal(td.doc().cauHoi['gd/q2'].dauTien, t0, 'giữ mốc lần đầu');

// Xuất / nhập giữ nguyên, thẻ FSRS dùng tiếp được sau khi nhập
td.ghiGiaiThich('gd', 'đi ngược độ dốc');
td.ghiBaiTapDat('gd-mot-bien');
const json = td.xuat();
kho.clear();
assert.equal(td.mucDo(td.doc(), khoa), 'chua-hoc');
td.nhap(json);
assert.equal(td.xuat(), json);
assert.equal(td.mucDo(td.doc(), khoa), 'da-thu', 'nhập lại giữ nguyên mức');
td.ghiKetQua('gd/q1', true, true, t0 + 40 * NGAY);
assert.throws(() => td.nhap('{"phienBan":2}'), /không đúng định dạng/);
assert.throws(() => td.nhap('không phải json'));

// Dữ liệu hỏng trong localStorage không làm sập trang
kho.set('laifs:v1', '{hỏng');
assert.equal(td.mucDo(td.doc(), khoa), 'chua-hoc');

// ---- Nhịp tuần ----
kho.clear();
const tai = (nam: number, thang: number, ngay: number, gio = 20) => new Date(nam, thang - 1, ngay, gio).getTime();
// 2026-09-14 là thứ Hai
assert.equal(td.ngayKey(new Date(2026, 8, 17, 23)), '2026-09-17');
assert.equal(td.ngayKey(td.dauTuan(new Date(2026, 8, 20, 12))), '2026-09-14', 'Chủ nhật thuộc tuần bắt đầu thứ Hai trước đó');
assert.deepEqual(td.chuoiTuan(td.doc(), new Date(2026, 8, 17)), { tuan: 0, dungPhep: false }, 'chưa học gì');

td.ghiKeHoach({ ngay: [0, 2, 4], phut: 25, gio: '20:00', sauViec: 'sau bữa tối', neuBan: 'ôn 5 phút' });
assert.equal(td.mucTieuTuan(td.doc()), 3);
const hocNgay = (...ds: [number, number, number][]) => ds.forEach(([y, m, d]) => td.ghiKetQua('gd/q1', true, true, tai(y, m, d)));
// tuần 31/8: đạt 3 · tuần 7/9: đạt 3 · tuần 14/9 (hiện tại): mới 1
hocNgay([2026, 8, 31], [2026, 9, 2], [2026, 9, 4], [2026, 9, 7], [2026, 9, 8], [2026, 9, 9], [2026, 9, 14]);
td.ghiKetQua('gd/q2', true, true, tai(2026, 9, 14)); // cùng ngày không tính thêm buổi
assert.deepEqual(td.tuan(td.doc(), new Date(2026, 8, 17)), [2, 0, 0, 0, 0, 0, 0]);
assert.deepEqual(td.chuoiTuan(td.doc(), new Date(2026, 8, 17)), { tuan: 2, dungPhep: false }, 'tuần hiện tại chưa đạt chưa làm đứt chuỗi');
hocNgay([2026, 9, 15], [2026, 9, 16]);
assert.equal(td.chuoiTuan(td.doc(), new Date(2026, 8, 17)).tuan, 3, 'tuần hiện tại đạt thì cộng');
// nhảy tới tuần 28/9, bỏ lỡ tuần 21/9 → dùng phép, chuỗi còn
assert.deepEqual(td.chuoiTuan(td.doc(), new Date(2026, 8, 29)), { tuan: 3, dungPhep: true });
// lỡ thêm tuần 28/9 → hết phép (phép 4 tuần một lần) → đứt
assert.deepEqual(td.chuoiTuan(td.doc(), new Date(2026, 9, 6)), { tuan: 0, dungPhep: false });
assert.equal(td.ngayHocCuoi(td.doc()), '2026-09-16');

// Dự báo ôn: câu quá hạn dồn vào hôm nay, câu ngoài 7 ngày bỏ qua
const the = (k: string, han: Date) => { const x = td.doc(); x.cauHoi[k].the.due = han; kho.set('laifs:v1', JSON.stringify(x)); };
td.ghiKetQua('gd/q3', true, true, tai(2026, 9, 16));
the('gd/q1', new Date(2026, 8, 1));
the('gd/q2', new Date(2026, 8, 19, 9));
the('gd/q3', new Date(2026, 9, 30));
assert.deepEqual(td.duBaoOn(td.doc(), ['gd/q1', 'gd/q2', 'gd/q3', 'khong/co'], new Date(2026, 8, 17, 22)), [1, 0, 1, 0, 0, 0, 0]);

// Mục tiêu + dữ liệu cũ không có nhật ký vẫn đọc được
td.ghiMucTieu('lan-truyen-nguoc');
assert.equal(td.doc().mucTieu, 'lan-truyen-nguoc');
kho.set('laifs:v1', JSON.stringify({ phienBan: 1, cauHoi: {}, giaiThich: {}, baiTap: {} }));
assert.deepEqual(td.doc().nhatKy, {});
td.nhap(JSON.stringify({ phienBan: 1, cauHoi: {}, giaiThich: {}, baiTap: {} }));
assert.deepEqual(td.doc().nhatKy, {});

console.log('OK: tiến độ, lịch ôn, mức thành thạo, xuất/nhập, nhịp tuần, dự báo');

// ---- Đồ thị mục tiêu ----
{
  const dt = await import('../src/do-thi.ts');
  const kn = (id: string, thuTu: number, tienQuyet: string[], coTrang = true) => ({ id, ten: id, tang: 1, thuTu, tienQuyet, coTrang, khoa: [`${id}/q1`] });
  const ds = [kn('a', 1, []), kn('b', 2, ['a']), kn('x', 3, []), kn('c', 4, ['b', 'a']), kn('d', 5, ['c'], false), kn('e', 6, ['x'])];
  assert.deepEqual([...dt.canChoMucTieu(ds, 'c')].sort(), ['a', 'b', 'c']);
  assert.deepEqual(dt.duongHoc(ds, 'd').map((k) => k.id), ['a', 'b', 'c', 'd'], 'theo thứ tự học, bỏ x, e');
  assert.deepEqual([...dt.canChoMucTieu(ds, 'khong-co')], []);
  kho.clear();
  assert.equal(dt.baiTiepTheo(td.doc(), ds, 'd')?.id, 'a');
  td.ghiKetQua('a/q1', true, true);
  assert.equal(dt.baiTiepTheo(td.doc(), ds, 'd')?.id, 'b', 'a đã Hiểu thì sang b');
  td.ghiKetQua('b/q1', true, true);
  td.ghiKetQua('c/q1', true, true);
  assert.equal(dt.baiTiepTheo(td.doc(), ds, 'd'), undefined, 'd chưa có bài thì không gợi ý');
  assert.equal(dt.mucDoKN(td.doc(), ds[4]), 'chua-co');
  console.log('OK: đồ thị mục tiêu');
}
