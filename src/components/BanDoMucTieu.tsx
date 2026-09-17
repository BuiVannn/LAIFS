import { useEffect, useMemo, useState } from 'react';
import { doc, ghiMucTieu, theoDoi, type TienDo } from '../tien-do';
import { baiTiepTheo, canChoMucTieu, mucDoKN, MUC_TIEU_MAC_DINH, type KhaiNiemDL } from '../do-thi';

const TEN_MUC: Record<string, string> = { 'chua-hoc': 'Chưa học', 'da-thu': 'Đã thử', hieu: 'Hiểu', vung: 'Vững', 'chua-co': 'Chưa có bài' };
const TEN_TANG: Record<number, string> = { 1: 'TOÁN NỀN', 2: 'ML CỔ ĐIỂN', 3: 'DEEP LEARNING', 4: 'THỊ GIÁC MÁY TÍNH', 5: 'NGÔN NGỮ & LLM', 6: 'GENERATIVE' };
const NUT_W = 196, NUT_H = 44, COT = 276, HANG = 58, LE_TREN = 44, LE_TRAI = 36;

export default function BanDoMucTieu({ ds }: { ds: KhaiNiemDL[] }) {
  const [td, setTd] = useState<TienDo | null>(null);
  const [mucTieu, setMucTieu] = useState(MUC_TIEU_MAC_DINH);
  const [chon, setChon] = useState<string | null>(null);
  const [lamMo, setLamMo] = useState(true);

  useEffect(() => {
    const t = doc();
    setTd(t);
    if (t.mucTieu && ds.some((k) => k.id === t.mucTieu)) setMucTieu(t.mucTieu);
    return theoDoi(() => setTd(doc()));
  }, []);

  const theoId = useMemo(() => new Map(ds.map((k) => [k.id, k])), [ds]);
  const can = useMemo(() => canChoMucTieu(ds, mucTieu), [ds, mucTieu]);
  const cacTang = [...new Set(ds.map((k) => k.tang))].sort();

  // Vị trí: cột theo tầng; trong cột, khái niệm trên đường đi lên trước
  const viTri = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    cacTang.forEach((t, c) => {
      const cot = ds.filter((k) => k.tang === t).sort((a, b) => Number(can.has(b.id)) - Number(can.has(a.id)) || a.thuTu - b.thuTu);
      cot.forEach((k, r) => m.set(k.id, { x: LE_TRAI + c * COT, y: LE_TREN + r * HANG }));
    });
    return m;
  }, [ds, can]);

  const rong = LE_TRAI * 2 + (cacTang.length - 1) * COT + NUT_W;
  const cao = LE_TREN + Math.max(...cacTang.map((t) => ds.filter((k) => k.tang === t).length)) * HANG + 10;
  const tiep = baiTiepTheo(td, ds, mucTieu);
  const dangChon = theoId.get(chon ?? tiep?.id ?? mucTieu) ?? ds[0];
  const soHieu = [...can].filter((id) => ['hieu', 'vung'].includes(mucDoKN(td, theoId.get(id)!))).length;

  const doiMucTieu = (id: string) => { setMucTieu(id); setChon(null); ghiMucTieu(id); };

  const canh = (tu: string, den: string) => {
    const a = viTri.get(tu)!, b = viTri.get(den)!;
    if (a.x === b.x) {
      // cùng tầng: cong vòng bên trái
      const x = a.x, y1 = a.y + NUT_H / 2, y2 = b.y + NUT_H / 2;
      return `M${x} ${y1}C${x - 30} ${y1} ${x - 30} ${y2} ${x} ${y2}`;
    }
    const x1 = a.x + NUT_W, y1 = a.y + NUT_H / 2, x2 = b.x, y2 = b.y + NUT_H / 2, g = (x2 - x1) / 2;
    return `M${x1} ${y1}C${x1 + g} ${y1} ${x2 - g} ${y2} ${x2} ${y2}`;
  };

  const phuThuoc = ds.filter((k) => k.tienQuyet.includes(dangChon.id) && can.has(k.id));
  const mChon = mucDoKN(td, dangChon);

  return (
    <div>
      <label className="chon-muc-tieu">
        <span>Tôi muốn hiểu</span>
        <select value={mucTieu} onChange={(e) => doiMucTieu(e.target.value)} aria-label="Chọn mục tiêu">
          {cacTang.map((t) => (
            <optgroup key={t} label={TEN_TANG[t] ?? `Tầng ${t}`}>
              {ds.filter((k) => k.tang === t).map((k) => (
                <option key={k.id} value={k.id}>{k.ten}{k.coTrang ? '' : ' (chưa có bài)'}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="chi-so">
        <div><b>{can.size}</b><span>khái niệm cần học</span></div>
        <div><b>{soHieu}</b><span>đã Hiểu hoặc Vững</span></div>
        <div><b>{ds.length - can.size}</b><span>chưa cần, bỏ qua được</span></div>
      </div>

      <div className="ban-do-khung">
        <div>
          <div className="ban-do">
            <svg width={rong} height={cao} viewBox={`0 0 ${rong} ${cao}`} role="group" aria-label="Bản đồ khái niệm theo tầng">
              {cacTang.map((t, c) => <text key={t} className="ten-tang" x={LE_TRAI + c * COT} y={24}>{TEN_TANG[t] ?? `TẦNG ${t}`}</text>)}
              {ds.flatMap((k) => k.tienQuyet.filter((t) => viTri.has(t)).map((t) => {
                const tren = can.has(k.id) && can.has(t);
                if (lamMo && !tren) return null;
                return <path key={`${t}>${k.id}`} className={`canh ${tren ? 'tren-duong' : ''}`} d={canh(t, k.id)} />;
              }))}
              {ds.map((k) => {
                const p = viTri.get(k.id)!;
                const m = mucDoKN(td, k);
                const lop = ['nut-kn', k.id === mucTieu ? 'muc-tieu' : m, k.id === dangChon.id ? 'dang-chon' : '', lamMo && !can.has(k.id) ? 'ngoai' : ''].join(' ');
                return (
                  <g
                    key={k.id}
                    className={lop}
                    transform={`translate(${p.x} ${p.y})`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={k.id === dangChon.id}
                    aria-label={`${k.ten}: ${TEN_MUC[m]}${can.has(k.id) ? ', cần cho mục tiêu' : ''}`}
                    onClick={() => setChon(k.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setChon(k.id); } }}
                  >
                    <rect width={NUT_W} height={NUT_H} rx={11} />
                    <text x={NUT_W / 2} y={NUT_H / 2 + 5} textAnchor="middle">{k.ten.length > 24 ? k.ten.slice(0, 23) + '…' : k.ten}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="chu-giai">
            <span><i className="cham vung" /> Vững</span>
            <span><i className="cham hieu" /> Hiểu</span>
            <span><i className="cham da-thu" /> Đã thử</span>
            <span><i className="cham" /> Chưa học</span>
            <span><i className="cham chua-co" /> Chưa có bài</span>
            <label className="hang" style={{ gap: 6, marginLeft: 'auto' }}>
              <input type="checkbox" checked={lamMo} onChange={(e) => setLamMo(e.target.checked)} /> Làm mờ phần chưa cần
            </label>
          </div>
        </div>

        <aside className="the bang-chi-tiet" aria-live="polite">
          <p className="nhan-muc">
            {dangChon.id === mucTieu ? 'Mục tiêu' : dangChon.id === tiep?.id ? 'Bước tiếp theo trên đường' : can.has(dangChon.id) ? 'Trên đường tới mục tiêu' : 'Chưa cần cho mục tiêu này'}
          </p>
          <h2>{dangChon.ten}</h2>
          <div className="hang"><span className={`muc-do ${mChon}`}>{TEN_MUC[mChon]}</span></div>
          {dangChon.dinhNghia && <p style={{ margin: 0 }}>{dangChon.dinhNghia}</p>}
          {dangChon.tienQuyet.length > 0 && (
            <div>
              <p className="nhan-muc">Cần biết trước</p>
              <div className="hang-the">
                {dangChon.tienQuyet.map((id) => theoId.get(id)).filter((x) => x !== undefined).map((t) => {
                  const m = mucDoKN(td, t);
                  return <button key={t.id} className={`muc-do ${m}`} style={{ minHeight: 32, border: 0 }} onClick={() => setChon(t.id)}>{t.ten} · {TEN_MUC[m]}</button>;
                })}
              </div>
            </div>
          )}
          {phuThuoc.length > 0 && (
            <p className="mo" style={{ margin: 0, fontSize: 14 }}>Cần cho: {phuThuoc.map((k) => k.ten).join(', ')}.</p>
          )}
          <div className="hang">
            {dangChon.coTrang ? <a className="nut" href={`/khai-niem/${dangChon.id}`}>Mở bài học</a> : <span className="mo" style={{ fontSize: 14 }}>Bài này chưa có nội dung.</span>}
            {dangChon.id !== mucTieu && <button className="phu" onClick={() => doiMucTieu(dangChon.id)}>Đặt làm mục tiêu</button>}
          </div>
        </aside>
      </div>
    </div>
  );
}
