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

console.log('OK: tiến độ, lịch ôn, mức thành thạo, xuất/nhập');
