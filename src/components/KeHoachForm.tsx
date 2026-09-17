import { useEffect, useState } from 'react';
import { doc, ghiKeHoach, type KeHoach } from '../tien-do';
import { TEN_THU } from '../do-thi';

const BYDAY = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const MAC_DINH: KeHoach = { ngay: [0, 2, 4], phut: 25, gio: '20:00', sauViec: 'Sau bữa tối', neuBan: 'Chỉ ôn 5 phút cho giữ nhịp' };
const NEU_BAN = ['Chỉ ôn 5 phút cho giữ nhịp', 'Dời sang sáng hôm sau'];

// Lịch lặp hằng tuần (.ics) để tự thêm vào Google Calendar / lịch điện thoại
function taoIcs(kh: KeHoach, trangWeb: string) {
  const now = new Date();
  const [h, m] = kh.gio.split(':').map(Number);
  // lần đầu: ngày gần nhất (tính cả hôm nay) thuộc các ngày đã chọn
  const dau = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m))
    .find((d) => kh.ngay.includes((d.getDay() + 6) % 7))!;
  const p = (n: number) => String(n).padStart(2, '0');
  const dt = (d: Date) => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
  const escape = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LAIFS//Ke hoach hoc//VI', 'BEGIN:VEVENT',
    `UID:laifs-ke-hoach-${Date.now()}@laifs`,
    `DTSTAMP:${dt(now)}`,
    `DTSTART:${dt(dau)}`,
    `DURATION:PT${kh.phut}M`,
    `RRULE:FREQ=WEEKLY;BYDAY=${[...kh.ngay].sort().map((i) => BYDAY[i]).join(',')}`,
    `SUMMARY:${escape('Học AI · LAIFS')}`,
    `DESCRIPTION:${escape(`${kh.sauViec}. Nếu bận: ${kh.neuBan}. Bắt đầu: ${trangWeb}`)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
}

export default function KeHoachForm() {
  const [kh, setKh] = useState<KeHoach>(MAC_DINH);
  const [daLuu, setDaLuu] = useState(false);
  useEffect(() => { const cu = doc().keHoach; if (cu) { setKh(cu); setDaLuu(true); } }, []);
  const doi = (x: Partial<KeHoach>) => { setKh({ ...kh, ...x }); setDaLuu(false); };

  const taiIcs = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([taoIcs(kh, `${location.origin}/`)], { type: 'text/calendar' }));
    a.download = 'laifs-lich-hoc.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <form className="ke-hoach" onSubmit={(e) => { e.preventDefault(); ghiKeHoach(kh); setDaLuu(true); }}>
      <fieldset>
        <legend>Học vào những ngày nào? <span className="mo" style={{ fontWeight: 400 }}>({kh.ngay.length} buổi/tuần)</span></legend>
        <div className="chip-nhom">
          {TEN_THU.map((t, i) => (
            <label key={t} className="chip">
              <input type="checkbox" checked={kh.ngay.includes(i)} onChange={() => doi({ ngay: kh.ngay.includes(i) ? kh.ngay.filter((x) => x !== i) : [...kh.ngay, i] })} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Mỗi buổi bao lâu?</legend>
        <div className="chip-nhom">
          {[10, 25, 40].map((p) => (
            <label key={p} className="chip"><input type="radio" name="phut" checked={kh.phut === p} onChange={() => doi({ phut: p })} />{p} phút</label>
          ))}
        </div>
      </fieldset>
      <div className="hang" style={{ alignItems: 'flex-end' }}>
        <label style={{ flex: '1 1 260px' }}>
          <span className="ten-truong">Học ngay sau việc gì?</span>
          <input type="text" value={kh.sauViec} onChange={(e) => doi({ sauViec: e.target.value })} style={{ width: '100%' }} />
        </label>
        <label>
          <span className="ten-truong">Khoảng mấy giờ?</span>
          <input type="time" value={kh.gio} onChange={(e) => doi({ gio: e.target.value || '20:00' })} />
        </label>
      </div>
      <p className="mo" style={{ margin: '-12px 0 0', fontSize: 14 }}>Gắn vào một thói quen có sẵn thường dễ giữ hơn chỉ đặt giờ.</p>
      <fieldset>
        <legend>Nếu hôm đó bận, mình sẽ…</legend>
        <div className="chip-nhom">
          {NEU_BAN.map((n) => (
            <label key={n} className="chip"><input type="radio" name="neu-ban" checked={kh.neuBan === n} onChange={() => doi({ neuBan: n })} />{n}</label>
          ))}
        </div>
      </fieldset>
      <div className="hang">
        <button className="lon" type="submit" disabled={!kh.ngay.length}>{daLuu ? 'Đã lưu ✓' : 'Lưu kế hoạch'}</button>
        <button className="phu lon" type="button" onClick={taiIcs} disabled={!kh.ngay.length}>Tải lịch lặp (.ics)</button>
      </div>
      <p className="mo" style={{ margin: 0, fontSize: 14 }}>File .ics mở được bằng Google Calendar, lịch iPhone hay Outlook, để lịch tự nhắc bạn.</p>
    </form>
  );
}
