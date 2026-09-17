import { useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Dữ liệu cố định: đường khớp tốt nhất đúng bằng ŷ = 1·x + 1 (MSE nhỏ nhất = 0.76/6 ≈ 0.127)
const X = [1, 2, 3, 4, 5, 6];
const Y = [2.3, 2.5, 4.2, 5.2, 5.5, 7.3];

const W = 600, H = 340, PAD = 30;
const MX: [number, number] = [0, 8];
const MY: [number, number] = [-1, 10];

type Props = {
  // Điểm ngoại lai được thêm vào khi bấm Chạy (kịch bản đoán trước)
  them?: [number, number];
  w0?: number;
  b0?: number;
  // Có duDoan: khoá thanh trượt, phải đoán trước rồi mới được chạy
  duDoan?: DuDoanCauHoi;
};

function khopTotNhat(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  const w = sxy / sxx;
  return { w, b: my - w * mx };
}

const mse = (xs: number[], ys: number[], w: number, b: number) =>
  xs.reduce((s, x, i) => s + (w * x + b - ys[i]) * (w * x + b - ys[i]), 0) / xs.length;

export default function HoiQuyTuyenTinh(props: Props) {
  const w0 = props.w0 ?? 1;
  const b0 = props.b0 ?? 1;
  const [w, setW] = useState(w0);
  const [b, setB] = useState(b0);
  const [daChay, setDaChay] = useState(false);
  const [cu, setCu] = useState<{ w: number; b: number } | null>(null);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'hq' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoa = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;

  const xs = daChay && props.them ? [...X, props.them[0]] : X;
  const ys = daChay && props.them ? [...Y, props.them[1]] : Y;

  // Làm tròn toạ độ để SSR và trình duyệt khớp nhau (tránh lệch hydration)
  const tron = (v: number) => Math.round(v * 100) / 100;
  const sx = (v: number) => tron(PAD + ((v - MX[0]) / (MX[1] - MX[0])) * (W - 2 * PAD));
  const sy = (v: number) => tron(H - PAD - ((v - MY[0]) / (MY[1] - MY[0])) * (H - 2 * PAD));

  const chay = () => {
    const xm = props.them ? [...X, props.them[0]] : X;
    const ym = props.them ? [...Y, props.them[1]] : Y;
    const tot = khopTotNhat(xm, ym);
    setCu({ w, b });
    setW(tot.w);
    setB(tot.b);
    setDaChay(true);
  };
  const datLai = () => {
    setW(w0);
    setB(b0);
    setCu(null);
    setDaChay(false);
  };

  const loss = mse(xs, ys, w, b);
  const tot = khopTotNhat(xs, ys);
  const lossMin = mse(xs, ys, tot.w, tot.b);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Độ dốc w = <b>{w.toFixed(2)}</b>
          <input disabled={khoa} type="range" min={-1} max={3} step={0.05} value={w} onChange={(e) => { setW(+e.target.value); setCu(null); }} />
        </label>
        <label>
          Hệ số chặn b = <b>{b.toFixed(2)}</b>
          <input disabled={khoa} type="range" min={-3} max={6} step={0.05} value={b} onChange={(e) => { setB(+e.target.value); setCu(null); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Các điểm dữ liệu, đường thẳng dự đoán và các đoạn sai số">
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        {[2, 4, 6, 8].map((v) => (
          <text key={'x' + v} x={sx(v)} y={sy(0) + 16} textAnchor="middle" className="nhan">{v}</text>
        ))}
        {[2, 4, 6, 8].map((v) => (
          <text key={'y' + v} x={sx(0) + 6} y={sy(v) + 4} className="nhan">{v}</text>
        ))}
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x</text>
        <text x={sx(0) + 20} y={PAD + 10} className="nhan">y</text>
        <g clipPath={`url(#${clipId})`}>
          {cu && (
            <line x1={sx(MX[0])} y1={sy(cu.w * MX[0] + cu.b)} x2={sx(MX[1])} y2={sy(cu.w * MX[1] + cu.b)} className="truc" strokeWidth={2} strokeDasharray="6 4" />
          )}
          {xs.map((x, i) => (
            <line key={'r' + i} x1={sx(x)} y1={sy(ys[i])} x2={sx(x)} y2={sy(w * x + b)} className="duong-di" />
          ))}
          <line x1={sx(MX[0])} y1={sy(w * MX[0] + b)} x2={sx(MX[1])} y2={sy(w * MX[1] + b)} className="tiep-tuyen" />
          {xs.map((x, i) => (
            <circle key={'p' + i} cx={sx(x)} cy={sy(ys[i])} r={i >= X.length ? 7 : 5} className="diem-hien-tai" />
          ))}
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={chay} disabled={!choChay || (khoa && daChay)}>{khoa ? 'Chạy' : 'Khớp tốt nhất'}</button>
        <button onClick={datLai}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        ŷ = <b>{w.toFixed(2)}</b>·x + <b>{b.toFixed(2)}</b> · {xs.length} điểm · MSE = <b>{loss.toFixed(3)}</b>
        {' '}(nhỏ nhất có thể: {lossMin.toFixed(3)})
        {cu && <><br />Đường nét đứt: đường trước khi chạy (ŷ = {cu.w.toFixed(2)}·x + {cu.b.toFixed(2)})</>}
        <br />
        <span className="nhan">Đoạn đỏ là sai số của từng điểm. MSE = trung bình bình phương độ dài các đoạn đỏ.</span>
      </figcaption>
    </figure>
  );
}
