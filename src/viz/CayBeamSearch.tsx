import { useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Cây beam search trên một bảng xác suất cho sẵn (dịch "Tôi ăn cơm").
// Mỗi bước: mở rộng các tiền tố đang giữ, chấm bằng TỔNG log-xác suất, giữ lại k cái tốt nhất.
// Xanh = được giữ, xám nét đứt = bị loại, cam = đường greedy.

const BANG: Record<string, Record<string, number>> = {
  '': { I: 0.5, We: 0.3, Rice: 0.2 },
  I: { am: 0.5, eat: 0.4, like: 0.1 },
  We: { eat: 0.6, are: 0.4 },
  Rice: { is: 1 },
  'I am': { eating: 0.5, hungry: 0.3, rice: 0.2 },
  'I eat': { rice: 0.9, bread: 0.07, food: 0.03 },
  'I like': { rice: 1 },
  'We eat': { rice: 0.9, bread: 0.1 },
  'We are': { eating: 1 },
  'Rice is': { eaten: 1 },
};
const SO_BUOC = 3;

// Làm tròn trước khi hiện: Node (SSR) và trình duyệt có thể lệch chữ số cuối → lệch hydration
const tron = (v: number) => Math.round(v * 10000) / 10000;
const so = (v: number) => tron(v).toFixed(4);

type Nut = { chuoi: string; cha: string; token: string; lp: number; p: number; giu: boolean };

// Toàn bộ quá trình beam search, tính sẵn cho mọi bước
function chay(k: number): Nut[][] {
  let beams: { chuoi: string; lp: number }[] = [{ chuoi: '', lp: 0 }];
  const cac: Nut[][] = [];
  for (let b = 0; b < SO_BUOC; b++) {
    const ungVien: Nut[] = [];
    for (const { chuoi, lp } of beams) {
      for (const [token, p] of Object.entries(BANG[chuoi] ?? {})) {
        ungVien.push({ chuoi: (chuoi + ' ' + token).trim(), cha: chuoi, token, p, lp: lp + Math.log(p), giu: false });
      }
    }
    ungVien.sort((a, z) => z.lp - a.lp);
    ungVien.slice(0, k).forEach((u) => (u.giu = true));
    cac.push(ungVien);
    beams = ungVien.filter((u) => u.giu).map(({ chuoi, lp }) => ({ chuoi, lp }));
  }
  return cac;
}

function duongGreedy(): string[] {
  let chuoi = '';
  const duong: string[] = [];
  for (let b = 0; b < SO_BUOC; b++) {
    const [token] = Object.entries(BANG[chuoi]).reduce((a, z) => (z[1] > a[1] ? z : a));
    chuoi = (chuoi + ' ' + token).trim();
    duong.push(chuoi);
  }
  return duong;
}
const GREEDY = duongGreedy();
const GREEDY_LP = GREEDY.reduce((s, chuoi, i) => {
  const cha = GREEDY[i - 1] ?? '';
  return s + Math.log(BANG[cha][chuoi.slice(cha ? cha.length + 1 : 0)]);
}, 0);

const W = 760, H = 360, COT = 178, NUT_W = 138, NUT_H = 38, LE = 26;

type Props = { k?: number; duDoan?: DuDoanCauHoi };

export default function CayBeamSearch({ k: kBanDau, duDoan }: Props) {
  const [k, setK] = useState(kBanDau ?? 2);
  const [buoc, setBuoc] = useState(0);
  const { daDoan, setDaDoan } = useDuDoan();
  const choChay = !duDoan || daDoan !== null;
  const khoaThamSo = !!duDoan;
  const daChay = buoc >= SO_BUOC;

  const cac = chay(k);

  // Toạ độ: mỗi bước một cột, các ứng viên của cột chia đều theo chiều dọc
  const viTri: Record<string, [number, number]> = { '': [LE + NUT_W / 2, Math.round(H / 2)] };
  for (let b = 0; b < buoc; b++) {
    const ds = cac[b];
    ds.forEach((u, i) => {
      const y = Math.round(((i + 0.5) * (H - 30)) / ds.length) + 15;
      viTri[u.chuoi] = [LE + NUT_W / 2 + (b + 1) * COT, y];
    });
  }

  const laGreedy = (chuoi: string) => chuoi === '' || GREEDY.includes(chuoi);
  const hienTai = buoc > 0 ? cac[buoc - 1] : null;
  const totNhat = daChay ? cac[SO_BUOC - 1].filter((u) => u.giu)[0] : null;

  return (
    <figure className="viz">
      {duDoan && <DuDoan q={duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Bề rộng beam k = <b>{k}</b>
          <input disabled={khoaThamSo} type="range" min={1} max={3} step={1} value={k}
            onChange={(e) => { setK(+e.target.value); setBuoc(0); }} />
        </label>
        <button onClick={() => setBuoc(buoc + 1)} disabled={!choChay || daChay}>Bước tiếp</button>
        <button onClick={() => setBuoc(SO_BUOC)} disabled={!choChay || daChay}>Chạy hết</button>
        <button onClick={() => setBuoc(0)}>Đặt lại</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cây beam search với k = ${k}, các nhánh được giữ và bị loại ở từng bước`}>
        {[0, 1, 2].map((b) => (
          <text key={'t' + b} x={LE + NUT_W / 2 + (b + 1) * COT} y={12} textAnchor="middle" className="nhan">bước {b + 1}</text>
        ))}
        {Object.keys(viTri).map((chuoi) => {
          const nut = chuoi === '' ? null : cac.flat().find((u) => u.chuoi === chuoi);
          if (!nut) return null;
          const [x2, y2] = viTri[chuoi];
          const [x1, y1] = viTri[nut.cha] ?? [0, 0];
          const g = laGreedy(chuoi) && laGreedy(nut.cha);
          return (
            <line key={'e' + chuoi} x1={x1 + NUT_W / 2} y1={y1} x2={x2 - NUT_W / 2} y2={y2}
              stroke={g ? 'var(--nhap)' : nut.giu ? 'var(--nhan)' : 'var(--vien)'}
              strokeWidth={g || nut.giu ? 2.2 : 1.2}
              strokeDasharray={nut.giu ? undefined : '5 4'} />
          );
        })}

        <g>
          <rect x={LE} y={Math.round(H / 2) - NUT_H / 2} width={NUT_W} height={NUT_H} rx={8}
            fill="var(--nen-phu)" stroke="var(--chu-mo)" strokeWidth={1.5} />
          <text x={LE + NUT_W / 2} y={Math.round(H / 2) + 5} textAnchor="middle" fill="var(--chu)" fontSize={14} fontWeight={600}>
            &lt;s&gt; · 0.0000
          </text>
        </g>

        {cac.slice(0, buoc).map((ds, b) =>
          ds.map((u) => {
            const [cx, cy] = viTri[u.chuoi];
            const g = laGreedy(u.chuoi);
            return (
              <g key={u.chuoi}>
                <rect x={cx - NUT_W / 2} y={cy - NUT_H / 2} width={NUT_W} height={NUT_H} rx={8}
                  fill={u.giu ? 'var(--the)' : 'var(--nen)'}
                  fillOpacity={u.giu ? 1 : 0.6}
                  stroke={g ? 'var(--nhap)' : u.giu ? 'var(--nhan)' : 'var(--vien)'}
                  strokeWidth={g || u.giu ? 2.5 : 1.2}
                  strokeDasharray={u.giu ? undefined : '5 4'} />
                <text x={cx} y={cy - 2} textAnchor="middle" fontSize={14} fontWeight={600}
                  fill={u.giu ? 'var(--chu)' : 'var(--chu-mo)'}>{u.token}</text>
                <text x={cx} y={cy + 13} textAnchor="middle" fontSize={12}
                  fill={u.giu ? 'var(--chu-mo)' : 'var(--chu-mo)'}>
                  {so(u.lp)} {u.giu ? '' : '· loại'}
                </text>
              </g>
            );
          }),
        )}
      </svg>

      <div className="chu-giai">
        <span><i className="cham vung" /> giữ lại (top {k})</span>
        <span><i className="cham chua-co" /> bị loại</span>
        <span><i className="cham da-thu" /> đường greedy</span>
      </div>

      <figcaption aria-live="polite">
        Bước <b>{buoc}</b>/{SO_BUOC} ·{' '}
        {hienTai ? (
          <>
            mở rộng thành {hienTai.length} ứng viên, giữ {Math.min(k, hienTai.length)}:{' '}
            <b>{hienTai.filter((u) => u.giu).map((u) => `${u.chuoi} (${so(u.lp)})`).join(' · ')}</b>
          </>
        ) : (
          <>bấm "Bước tiếp" để mở rộng từ &lt;s&gt;. Điểm của một nhánh = tổng log-xác suất các token trên đường đi.</>
        )}
        {daChay && totNhat && (
          <>
            <br />
            Kết quả beam k={k}: <b>"{totNhat.chuoi}"</b> log-prob <b>{so(totNhat.lp)}</b> (xác suất {tron(Math.exp(totNhat.lp)).toFixed(4)}) ·{' '}
            greedy: <b>"{GREEDY[SO_BUOC - 1]}"</b> log-prob <b>{so(GREEDY_LP)}</b>
          </>
        )}
      </figcaption>
    </figure>
  );
}
