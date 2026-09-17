import { useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Đồ thị tính toán của một neuron sigmoid: L = (σ(w·x + b) − y)²
// Chạy xuôi từng nút (hiện giá trị), rồi chạy ngược từng nút (hiện gradient theo chain rule).

type Props = {
  w?: number;
  x?: number;
  b?: number;
  y?: number;
  // 'xuoi': chỉ lan truyền xuôi; 'day-du': xuôi rồi ngược
  cheDo?: 'xuoi' | 'day-du';
  // Có duDoan: khoá tham số theo kịch bản, phải đoán trước rồi mới được chạy
  duDoan?: DuDoanCauHoi;
};

type Nut = 'x' | 'w' | 'b' | 'y' | 'm' | 'z' | 'a' | 'L';

// Toạ độ cố định (số nguyên) để không lệch hydration
const VI_TRI: Record<Nut, [number, number]> = {
  x: [60, 60], w: [60, 190], m: [200, 125], b: [200, 265], z: [330, 195],
  a: [460, 195], y: [460, 320], L: [590, 195],
};
const NHAN: Record<Nut, string> = { x: 'x', w: 'w', b: 'b', y: 'y', m: '×', z: '+', a: 'σ', L: '(·)²' };
const TEN_GIA_TRI: Record<Nut, string> = { x: 'x', w: 'w', b: 'b', y: 'y', m: 'm', z: 'z', a: 'a', L: 'L' };
const CANH: [Nut, Nut][] = [['x', 'm'], ['w', 'm'], ['m', 'z'], ['b', 'z'], ['z', 'a'], ['a', 'L'], ['y', 'L']];
const W = 680, H = 370, R = 26;

// Tránh hiện "-0.0000"
const so = (v: number) => (Math.abs(v) < 5e-5 ? 0 : v).toFixed(4);
const ngoac = (v: number) => (v < 0 && Math.abs(v) >= 5e-5 ? `(${so(v)})` : so(v));

export default function DoThiTinhToan(props: Props) {
  const [w, setW] = useState(props.w ?? 0.5);
  const [x, setX] = useState(props.x ?? 2);
  const [b, setB] = useState(props.b ?? -1);
  const [y, setY] = useState(props.y ?? 1);
  const [buoc, setBuoc] = useState(0);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const cheDo = props.cheDo ?? 'day-du';

  // Lan truyền xuôi
  const m = w * x, z = m + b, a = 1 / (1 + Math.exp(-z)), L = (a - y) ** 2;
  // Lan truyền ngược
  const dA = 2 * (a - y), dZ = dA * a * (1 - a), dM = dZ, dB = dZ, dW = dM * x, dX = dM * w;

  const giaTri: Record<Nut, number> = { x, w, b, y, m, z, a, L };
  const gradient: Partial<Record<Nut, number>> = { a: dA, z: dZ, m: dM, b: dB, w: dW, x: dX };

  const CAC_BUOC: { nut: Nut[]; nguoc: boolean; mo_ta: string }[] = [
    { nut: ['m'], nguoc: false, mo_ta: `Nút ×: m = w · x = ${so(w)} × ${ngoac(x)} = ${so(m)}` },
    { nut: ['z'], nguoc: false, mo_ta: `Nút +: z = m + b = ${so(m)} + ${ngoac(b)} = ${so(z)}` },
    { nut: ['a'], nguoc: false, mo_ta: `Nút σ: a = σ(z) = 1 / (1 + e^(−z)) = ${so(a)}` },
    { nut: ['L'], nguoc: false, mo_ta: `Nút bình phương: L = (a − y)² = (${so(a)} − ${so(y)})² = ${so(L)}` },
    { nut: ['a'], nguoc: true, mo_ta: `Bắt đầu đi ngược. Đạo hàm cục bộ của (a − y)² là 2(a − y): ∂L/∂a = 2 × (${so(a)} − ${so(y)}) = ${so(dA)}` },
    { nut: ['z'], nguoc: true, mo_ta: `Qua nút σ, nhân với đạo hàm cục bộ σ′(z) = a(1 − a) = ${so(a * (1 - a))}: ∂L/∂z = ${ngoac(dA)} × ${so(a * (1 - a))} = ${so(dZ)}` },
    { nut: ['m', 'b'], nguoc: true, mo_ta: `Qua nút +, đạo hàm cục bộ theo mỗi đầu vào đều là 1, nên gradient được chuyển nguyên: ∂L/∂m = ∂L/∂b = ${so(dZ)}` },
    { nut: ['w', 'x'], nguoc: true, mo_ta: `Qua nút ×, mỗi đầu vào nhận gradient nhân với đầu vào CÒN LẠI: ∂L/∂w = ${ngoac(dM)} × x = ${so(dW)} · ∂L/∂x = ${ngoac(dM)} × w = ${so(dX)}` },
  ];
  const soBuoc = cheDo === 'xuoi' ? 4 : CAC_BUOC.length;
  const daChay = buoc >= soBuoc;

  // Nút nào đã có giá trị / gradient ở bước hiện tại
  const coGiaTri = (n: Nut) => ['x', 'w', 'b', 'y'].includes(n) || CAC_BUOC.slice(0, buoc).some((s) => !s.nguoc && s.nut.includes(n));
  const coGradient = (n: Nut) => CAC_BUOC.slice(0, buoc).some((s) => s.nguoc && s.nut.includes(n));
  const hienTai = buoc > 0 ? CAC_BUOC[buoc - 1] : null;

  const datLai = () => setBuoc(0);
  const thanhTruot = (ten: string, v: number, dat: (v: number) => void, min: number, max: number) => (
    <label>
      {ten} = <b>{v}</b>
      <input disabled={khoaThamSo} type="range" min={min} max={max} step={0.1} value={v}
        onChange={(e) => { dat(+e.target.value); datLai(); }} />
    </label>
  );

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        {thanhTruot('w', w, setW, -3, 3)}
        {thanhTruot('x', x, setX, -3, 3)}
        {thanhTruot('b', b, setB, -3, 3)}
        {thanhTruot('y (đích)', y, setY, 0, 1)}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Đồ thị tính toán của L = (σ(w·x + b) − y)², giá trị chạy xuôi và gradient chạy ngược">
        {CANH.map(([tu, den]) => {
          const [x1, y1] = VI_TRI[tu], [x2, y2] = VI_TRI[den];
          const nguoc = coGradient(tu) && tu !== 'y';
          const xuoi = coGiaTri(den);
          return (
            <line key={tu + den} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={nguoc ? 'var(--sai)' : xuoi ? 'var(--nhan)' : 'var(--vien)'}
              strokeWidth={nguoc || xuoi ? 2.5 : 1.5} strokeDasharray={nguoc ? '6 4' : undefined} />
          );
        })}
        {(Object.keys(VI_TRI) as Nut[]).map((n) => {
          const [cx, cy] = VI_TRI[n];
          const la = ['x', 'w', 'b', 'y'].includes(n);
          const dangXet = hienTai?.nut.includes(n);
          const g = gradient[n];
          return (
            <g key={n}>
              <circle cx={cx} cy={cy} r={R}
                fill={la ? 'var(--nen)' : 'var(--nen-phu)'}
                stroke={dangXet ? (hienTai!.nguoc ? 'var(--sai)' : 'var(--nhan)') : 'var(--chu-mo)'}
                strokeWidth={dangXet ? 4 : 1.5} />
              <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--chu)" fontSize={n === 'L' ? 15 : 19} fontWeight={600}>{NHAN[n]}</text>
              {coGiaTri(n) && (
                <text x={cx} y={cy - R - 8} textAnchor="middle" fill="var(--nhan)" fontSize={14} fontWeight={600}>
                  {la ? '' : TEN_GIA_TRI[n] + ' = '}{so(giaTri[n])}
                </text>
              )}
              {g !== undefined && coGradient(n) && (
                <text x={cx} y={cy + R + 20} textAnchor="middle" fill="var(--sai)" fontSize={14} fontWeight={600}>
                  ∂L/∂{TEN_GIA_TRI[n]} = {so(g)}
                </text>
              )}
            </g>
          );
        })}
        <text x={10} y={H - 10} className="nhan">xanh: giá trị (xuôi) · đỏ: gradient (ngược)</text>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setBuoc(buoc + 1)} disabled={!choChay || daChay}>
          {buoc < 4 ? 'Bước tiếp (xuôi)' : 'Bước tiếp (ngược)'}
        </button>
        <button onClick={() => setBuoc(soBuoc)} disabled={!choChay || daChay}>Chạy hết</button>
        <button onClick={datLai}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Bước <b>{buoc}</b>/{soBuoc} ·{' '}
        {hienTai ? hienTai.mo_ta : 'Bấm "Bước tiếp" để tính lần lượt từng nút từ trái sang phải.'}
        {buoc === 4 && cheDo === 'day-du' && <><br />Xong lượt xuôi. Lượt ngược sẽ đi từ L về w, dùng lại các giá trị vừa tính.</>}
      </figcaption>
    </figure>
  );
}
