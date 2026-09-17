import { useEffect, useId, useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

type Ham = { ten: string; f: (x: number) => number; df: (x: number) => number; x: [number, number]; y: [number, number]; x0: number };

const HAM: Record<string, Ham> = {
  parabol: { ten: 'f(x) = x²', f: (x) => x * x, df: (x) => 2 * x, x: [-3, 3.5], y: [-1, 10], x0: 1 },
  bac3: { ten: 'f(x) = x³ − 3x', f: (x) => x * x * x - 3 * x, df: (x) => 3 * x * x - 3, x: [-2.8, 2.8], y: [-6, 9], x0: 1 },
};

const W = 600, H = 340, PAD = 30;
const H_NHO_NHAT = 0.01; // h dưới ngưỡng này coi như đã "sát 0"

type Props = {
  ham?: keyof typeof HAM;
  x0?: number;
  h?: number;
  // Có duDoan: khoá tham số, phải đoán trước rồi mới được thu nhỏ h
  duDoan?: DuDoanCauHoi;
};

export default function CatTuyenTiepTuyen(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof HAM>(props.ham ?? 'parabol');
  const ham = HAM[khoa];
  const h0 = props.h ?? 2;
  const [x0, setX0] = useState(props.x0 ?? ham.x0);
  const [h, setH] = useState(h0);
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'ct' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = h < H_NHO_NHAT;

  // Làm tròn toạ độ để SSR và trình duyệt ra cùng chuỗi (tránh lệch hydration)
  const tron = (v: number) => Math.round(v * 100) / 100;
  const sx = (v: number) => tron(PAD + ((v - ham.x[0]) / (ham.x[1] - ham.x[0])) * (W - 2 * PAD));
  const sy = (v: number) => tron(H - PAD - ((v - ham.y[0]) / (ham.y[1] - ham.y[0])) * (H - 2 * PAD));

  const duongCong = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const v = ham.x[0] + ((ham.x[1] - ham.x[0]) * i) / 200;
      pts.push(`${sx(v).toFixed(1)},${sy(ham.f(v)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [khoa]);

  const thuNho = () => setH((a) => a / 2);
  useEffect(() => {
    if (!dangChay || h < H_NHO_NHAT) return setDangChay(false);
    const t = setTimeout(thuNho, 600);
    return () => clearTimeout(t);
  }, [dangChay, h]);

  const datLai = () => { setDangChay(false); setH(h0); };
  const chonHam = (k: keyof typeof HAM) => { setKhoa(k); setX0(HAM[k].x0); datLai(); };

  const y0 = ham.f(x0);
  const x1 = x0 + h;
  const y1 = ham.f(x1);
  const doDocCat = (y1 - y0) / h;
  const doDocTiep = ham.df(x0);
  // Chế độ đoán trước: chỉ lộ tiếp tuyến (đáp án) khi đã thu h về sát 0
  const hienTiep = !props.duDoan || daChay;
  const [a, b] = ham.x;

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Hàm
          <select disabled={khoaThamSo} value={khoa} onChange={(e) => chonHam(e.target.value as keyof typeof HAM)}>
            {Object.entries(HAM).map(([k, v]) => (
              <option key={k} value={k}>{v.ten}</option>
            ))}
          </select>
        </label>
        <label>
          Điểm x₀ = <b>{x0}</b>
          <input disabled={khoaThamSo} type="range" min={-2} max={2} step={0.1} value={x0} onChange={(e) => { setX0(+e.target.value); datLai(); }} />
        </label>
        <label>
          Khoảng cách h = <b>{h < 0.1 ? h.toFixed(4) : +h.toFixed(3)}</b>
          <input disabled={khoaThamSo} type="range" min={0.01} max={2} step={0.01} value={h} onChange={(e) => { setDangChay(false); setH(+e.target.value); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Đồ thị ${ham.ten}, cát tuyến qua x₀ và x₀ + h, và tiếp tuyến tại x₀`}>
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x</text>
        <text x={sx(0) + 6} y={PAD + 10} className="nhan">f(x)</text>
        <g clipPath={`url(#${clipId})`}>
          <polyline points={duongCong} className="duong-cong" />
          {/* Cát tuyến qua (x₀, f(x₀)) và (x₀ + h, f(x₀ + h)), kéo dài hết miền vẽ */}
          <line x1={sx(a)} y1={sy(y0 + doDocCat * (a - x0))} x2={sx(b)} y2={sy(y0 + doDocCat * (b - x0))} className="duong-di" />
          {hienTiep && (
            <line x1={sx(x0 - 1.2)} y1={sy(y0 - doDocTiep * 1.2)} x2={sx(x0 + 1.2)} y2={sy(y0 + doDocTiep * 1.2)} className="tiep-tuyen" />
          )}
          <circle cx={sx(x1)} cy={sy(y1)} r={5} className="diem-cu" />
          <circle cx={sx(x0)} cy={sy(y0)} r={7} className="diem-hien-tai" />
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={thuNho} disabled={!choChay || dangChay || daChay}>h ÷ 2</button>
        <button onClick={() => setDangChay(!dangChay)} disabled={!choChay || daChay}>{dangChay ? 'Dừng' : 'Thu h về 0'}</button>
        <button onClick={datLai}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Độ dốc cát tuyến = [f({tron(x1)}) − f({x0})] / {h < 0.1 ? h.toFixed(4) : +h.toFixed(3)} = <b>{doDocCat.toFixed(4)}</b>
        <br />
        {hienTiep ? (
          <>Độ dốc tiếp tuyến (đạo hàm) f′({x0}) = <b>{doDocTiep.toFixed(4)}</b></>
        ) : (
          <>Tiếp tuyến sẽ hiện khi h đủ nhỏ (h {'<'} {H_NHO_NHAT}).</>
        )}
      </figcaption>
    </figure>
  );
}
