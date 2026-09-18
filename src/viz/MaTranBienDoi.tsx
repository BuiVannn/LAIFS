import { useEffect, useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Ma trận 2×2 nhìn như một phép biến đổi mặt phẳng: hình vuông đơn vị biến thành hình bình hành
// có hai cạnh đúng bằng HAI CỘT của ma trận. Định thức = diện tích hình bình hành đó.

const W = 600, H = 420, DVI = 70; // 70 px cho một đơn vị
const X0 = 220, Y0 = 300;         // vị trí gốc toạ độ trong khung

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (x: number) => tron(X0 + x * DVI);
const sy = (y: number) => tron(Y0 - y * DVI);

type Props = { a?: number; b?: number; c?: number; d?: number; duDoan?: DuDoanCauHoi };

export default function MaTranBienDoi(props: Props) {
  const dau = { a: props.a ?? 2, b: props.b ?? 1, c: props.c ?? 0, d: props.d ?? 1 };
  const [m, setM] = useState(dau);
  const [t, setT] = useState(0);
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'mt' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = t >= 1;

  useEffect(() => {
    if (!dangChay) return;
    if (t >= 1) return setDangChay(false);
    const id = setTimeout(() => setT((v) => Math.min(1, tron(v + 0.05))), 40);
    return () => clearTimeout(id);
  }, [dangChay, t]);

  // Nội suy tuyến tính từ ma trận đơn vị tới M: mượt và luôn bắt đầu từ lưới gốc
  const a = 1 + t * (m.a - 1), b = t * m.b, c = t * m.c, d = 1 + t * (m.d - 1);
  const ap = (x: number, y: number): [number, number] => [a * x + b * y, c * x + d * y];
  const dt = tron(m.a * m.d - m.b * m.c);
  const dtNoiSuy = a * d - b * c;

  const hinh = [[0, 0], [1, 0], [1, 1], [0, 1]]
    .map(([x, y]) => ap(x, y))
    .map(([x, y]) => `${sx(x)},${sy(y)}`)
    .join(' ');

  const dat = (k: keyof typeof m, v: number) => {
    setM({ ...m, [k]: v });
    setT(0);
    setDangChay(false);
  };

  const luoi = [];
  for (let i = -3; i <= 5; i++) {
    luoi.push(<line key={`v${i}`} x1={sx(i)} x2={sx(i)} y1={0} y2={H} className="truc" opacity={0.35} />);
    luoi.push(<line key={`h${i}`} y1={sy(i)} y2={sy(i)} x1={0} x2={W} className="truc" opacity={0.35} />);
  }

  const muiTen = (x: number, y: number, lop: string, ten: string) => (
    <g>
      <line x1={sx(0)} y1={sy(0)} x2={sx(x)} y2={sy(y)} className={lop} />
      <circle cx={sx(x)} cy={sy(y)} r={5} className="diem-hien-tai" />
      <text x={sx(x) + 8} y={sy(y) - 8} className="nhan">{ten} ({tron(x)}, {tron(y)})</text>
    </g>
  );

  const [e1x, e1y] = ap(1, 0);
  const [e2x, e2y] = ap(0, 1);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}

      <div className="viz-dieu-khien">
        {(['a', 'b', 'c', 'd'] as const).map((k) => (
          <label key={k}>
            {k} = <b>{m[k]}</b>
            <input
              disabled={khoaThamSo}
              type="range"
              min={-2}
              max={3}
              step={0.5}
              value={m[k]}
              onChange={(e) => dat(k, +e.target.value)}
            />
          </label>
        ))}
      </div>

      <p>
        M = [[{m.a}, {m.b}], [{m.c}, {m.d}]] · cột 1 = ({m.a}, {m.c}) là ảnh của e₁ · cột 2 = ({m.b}, {m.d}) là ảnh của e₂
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Hinh vuong don vi bien doi boi ma tran 2x2">
        <defs>
          <clipPath id={clipId}><rect x={0} y={0} width={W} height={H} /></clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {luoi}
          <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} className="truc" strokeWidth={2} />
          <line y1={0} y2={H} x1={sx(0)} x2={sx(0)} className="truc" strokeWidth={2} />
          <polygon points={`${sx(0)},${sy(0)} ${sx(1)},${sy(0)} ${sx(1)},${sy(1)} ${sx(0)},${sy(1)}`} className="vung-am" />
          <polygon points={hinh} className={dtNoiSuy < 0 ? 'vung-am' : 'vung-duong'} />
          <polyline points={`${hinh} ${sx(0)},${sy(0)}`} className="duong-cong" />
          {muiTen(e1x, e1y, 'tiep-tuyen', 'Me₁')}
          {muiTen(e2x, e2y, 'duong-di', 'Me₂')}
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setDangChay(!dangChay)} disabled={!choChay || t >= 1}>
          {dangChay ? 'Dừng' : 'Biến đổi'}
        </button>
        <button onClick={() => { setDangChay(false); setT(0); }}>Đặt lại</button>
        <button onClick={() => { setDangChay(false); setM(dau); setT(0); }}>Về ma trận ban đầu</button>
      </div>

      <figcaption aria-live="polite">
        Tiến trình <b>{Math.round(t * 100)}%</b> · e₁ = (1, 0) → <b>({tron(e1x)}, {tron(e1y)})</b> · e₂ = (0, 1) → <b>({tron(e2x)}, {tron(e2y)})</b>
        <br />
        Định thức ad − bc = {m.a} × {m.d} − {m.b} × {m.c} = <b>{dt}</b> ·{' '}
        {dt === 0 ? (
          <b className="canh-bao">Bằng 0: hình vuông bị bẹp thành đoạn thẳng, thông tin mất hẳn, ma trận không nghịch đảo được.</b>
        ) : dt < 0 ? (
          <>diện tích nhân {Math.abs(dt)} lần và mặt phẳng bị <b>lật</b> (định thức âm).</>
        ) : (
          <>diện tích hình vuông đơn vị nhân <b>{dt}</b> lần.</>
        )}
      </figcaption>
    </figure>
  );
}
