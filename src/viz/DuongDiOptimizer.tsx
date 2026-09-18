import { useEffect, useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Mặt lỗi "khe hẹp": f(x, y) = 0.02x² + 2y²
// Dốc đứng theo y (hệ số 2), gần như phẳng theo x (hệ số 0.02) — đúng kiểu thung lũng
// làm gradient descent thường bị zigzag: bước lớn theo hướng dốc, bò rất chậm theo hướng thoải.
const A = 0.02;
const B = 2;
const f = (x: number, y: number) => A * x * x + B * y * y;
const grad = (x: number, y: number): [number, number] => [2 * A * x, 2 * B * y];

const X0 = -2.6;
const Y0 = 1.0;
const SO_BUOC = 40;

type Ten = 'sgd' | 'momentum' | 'adam';
type CauHinh = { ten: string; mau: string; lr: number; ghi: string };

const CAU_HINH: Record<Ten, CauHinh> = {
  sgd: { ten: 'SGD', mau: 'var(--sai)', lr: 0.4, ghi: 'η = 0.4' },
  momentum: { ten: 'Momentum', mau: 'var(--nhap)', lr: 0.4, ghi: 'η = 0.4, β = 0.85' },
  adam: { ten: 'Adam', mau: 'var(--nhan)', lr: 0.1, ghi: 'η = 0.1, β₁ = 0.9, β₂ = 0.999' },
};

function duongDi(ten: Ten): [number, number][] {
  const lr = CAU_HINH[ten].lr;
  let x = X0;
  let y = Y0;
  let vx = 0, vy = 0; // momentum: trung bình trượt của gradient
  let mx = 0, my = 0, sx2 = 0, sy2 = 0; // Adam: mô men bậc 1 và bậc 2
  const duong: [number, number][] = [[x, y]];
  for (let t = 1; t <= SO_BUOC; t++) {
    const [gx, gy] = grad(x, y);
    if (ten === 'sgd') {
      x -= lr * gx;
      y -= lr * gy;
    } else if (ten === 'momentum') {
      vx = 0.85 * vx + gx;
      vy = 0.85 * vy + gy;
      x -= lr * vx;
      y -= lr * vy;
    } else {
      mx = 0.9 * mx + 0.1 * gx;
      my = 0.9 * my + 0.1 * gy;
      sx2 = 0.999 * sx2 + 0.001 * gx * gx;
      sy2 = 0.999 * sy2 + 0.001 * gy * gy;
      const c1 = 1 - Math.pow(0.9, t);
      const c2 = 1 - Math.pow(0.999, t);
      x -= (lr * (mx / c1)) / (Math.sqrt(sx2 / c2) + 1e-8);
      y -= (lr * (my / c1)) / (Math.sqrt(sy2 / c2) + 1e-8);
    }
    duong.push([x, y]);
  }
  return duong;
}

const DUONG: Record<Ten, [number, number][]> = { sgd: duongDi('sgd'), momentum: duongDi('momentum'), adam: duongDi('adam') };
const DS: Ten[] = ['sgd', 'momentum', 'adam'];

const W = 620, H = 320, PAD = 26;
const MIEN_X = 3.1, MIEN_Y = 1.35;
const MUC = [0.02, 0.08, 0.18, 0.5, 1.0, 2.0]; // đường đồng mức f = c

type Props = { duDoan?: DuDoanCauHoi };

export default function DuongDiOptimizer(props: Props) {
  const [buoc, setBuoc] = useState(0);
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'opt' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = buoc >= SO_BUOC;

  // Làm tròn toạ độ: Node (SSR) và trình duyệt có thể lệch ở chữ số cuối → lệch hydration
  const tron = (v: number) => Math.round(v * 10) / 10;
  const sx = (v: number) => tron(PAD + ((v + MIEN_X) / (2 * MIEN_X)) * (W - 2 * PAD));
  const sy = (v: number) => tron(H - PAD - ((v + MIEN_Y) / (2 * MIEN_Y)) * (H - 2 * PAD));
  const donViX = (W - 2 * PAD) / (2 * MIEN_X);
  const donViY = (H - 2 * PAD) / (2 * MIEN_Y);

  useEffect(() => {
    if (!dangChay || buoc >= SO_BUOC) return setDangChay(false);
    const id = setTimeout(() => setBuoc((b) => b + 1), 140);
    return () => clearTimeout(id);
  }, [dangChay, buoc]);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}

      <div className="viz-dieu-khien">
        {DS.map((t) => (
          <span key={t} style={{ fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" stroke={CAU_HINH[t].mau} strokeWidth="3" /></svg>
            <b>{CAU_HINH[t].ten}</b> <span className="mo">({CAU_HINH[t].ghi})</span>
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Đường đi của SGD, Momentum và Adam trên mặt lỗi khe hẹp">
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x (hướng thoải)</text>
        <text x={sx(0) + 6} y={PAD + 12} className="nhan">y (hướng dốc)</text>
        <g clipPath={`url(#${clipId})`}>
          {MUC.map((c) => (
            <ellipse
              key={c}
              cx={sx(0)}
              cy={sy(0)}
              rx={tron(Math.sqrt(c / A) * donViX)}
              ry={tron(Math.sqrt(c / B) * donViY)}
              className="duong-cong"
              opacity={0.35}
              strokeWidth={1}
            />
          ))}
          {DS.map((t) => {
            const d = DUONG[t].slice(0, buoc + 1);
            const [cx, cy] = d[d.length - 1];
            return (
              <g key={t}>
                <polyline
                  points={d.map(([px, py]) => `${sx(px)},${sy(py)}`).join(' ')}
                  fill="none"
                  stroke={CAU_HINH[t].mau}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {d.map(([px, py], i) => (
                  <circle key={i} cx={sx(px)} cy={sy(py)} r={2} fill={CAU_HINH[t].mau} opacity={0.5} />
                ))}
                <circle cx={sx(cx)} cy={sy(cy)} r={6} fill={CAU_HINH[t].mau} />
              </g>
            );
          })}
          <circle cx={sx(0)} cy={sy(0)} r={4} fill="none" className="duong-cong" />
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setBuoc((b) => Math.min(SO_BUOC, b + 1))} disabled={!choChay || dangChay || daChay}>1 bước</button>
        <button onClick={() => setDangChay(!dangChay)} disabled={!choChay || daChay}>{dangChay ? 'Dừng' : 'Chạy'}</button>
        <button onClick={() => { setDangChay(false); setBuoc(0); }}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Bước <b>{buoc}</b> / {SO_BUOC} · vòng tròn nhỏ ở giữa là đáy (0, 0)
        <table>
          <thead>
            <tr><th>Optimizer</th><th>x</th><th>y</th><th>f(x, y)</th></tr>
          </thead>
          <tbody>
            {DS.map((t) => {
              const [px, py] = DUONG[t][buoc];
              return (
                <tr key={t}>
                  <td style={{ color: CAU_HINH[t].mau, fontWeight: 600 }}>{CAU_HINH[t].ten}</td>
                  <td>{px.toFixed(3)}</td>
                  <td>{py.toFixed(3)}</td>
                  <td>{f(px, py).toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
