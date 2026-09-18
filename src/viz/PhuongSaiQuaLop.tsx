import { useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Độ lệch chuẩn của activation sau mỗi lớp tuyến tính.
// Đầu vào có σ = 1. Mỗi lớp nhân σ với hệ số √d · σ_w (vì phương sai của tổng d biến
// độc lập thì CỘNG lại). Hệ số đó khác 1 bao nhiêu thì sau L lớp lệch đi luỹ thừa L lần.

const W = 620, H = 360, PAD = 44;
const SO_LOP = 8;
const MU_MAX = 8; // trục dọc: từ 1e-8 tới 1e8

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (l: number) => tron(PAD + (l / SO_LOP) * (W - 2 * PAD));
const sy = (mu: number) => tron(H / 2 - (Math.max(-MU_MAX, Math.min(MU_MAX, mu)) / MU_MAX) * (H / 2 - PAD));

const goc = (s: number) => {
  if (s === 0) return '0';
  const mu = Math.log10(s);
  if (mu >= 5 || mu <= -4) return `1e${mu >= 0 ? '+' : ''}${Math.round(mu)}`;
  return s >= 1 ? s.toFixed(2) : s.toPrecision(2);
};

type Props = { sigma?: number; d?: number; duDoan?: DuDoanCauHoi };

export default function PhuongSaiQuaLop(props: Props) {
  const khoaThamSo = !!props.duDoan;
  const [sigma, setSigma] = useState(props.sigma ?? 0.1);
  const [d, setD] = useState(props.d ?? 100);
  const [hien, setHien] = useState(!props.duDoan);
  const { daDoan, setDaDoan } = useDuDoan();

  const heSo = sigma * Math.sqrt(d);
  const std = Array.from({ length: SO_LOP + 1 }, (_, l) => heSo ** l);
  const cuoi = std[SO_LOP];
  const tot = heSo > 0.9 && heSo < 1.1;

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={hien} />}

      <div className="viz-dieu-khien">
        <label>
          Độ lệch chuẩn khởi tạo σ_w = <b>{sigma.toFixed(3)}</b>
          <input
            disabled={khoaThamSo}
            type="range"
            min={0.02}
            max={0.3}
            step={0.005}
            value={sigma}
            onChange={(e) => setSigma(+e.target.value)}
          />
        </label>
        <label>
          Số đầu vào mỗi neuron d = <b>{d}</b>
          <input
            disabled={khoaThamSo}
            type="range"
            min={25}
            max={400}
            step={25}
            value={d}
            onChange={(e) => setD(+e.target.value)}
          />
        </label>
        <label>
          1/√d = <b>{tron(1 / Math.sqrt(d))}</b>
          <button disabled={khoaThamSo} onClick={() => setSigma(Math.round(1 / Math.sqrt(d) / 0.005) * 0.005)}>
            Đặt σ_w = 1/√d
          </button>
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Do lech chuan cua activation qua tung lop">
        {[-8, -4, 0, 4, 8].map((mu) => (
          <g key={mu}>
            <line x1={PAD} x2={W - PAD} y1={sy(mu)} y2={sy(mu)} className="truc" />
            <text x={4} y={sy(mu) + 4} className="nhan">1e{mu >= 0 ? '+' : ''}{mu}</text>
          </g>
        ))}
        {hien && (
          <>
            <polyline
              points={std.map((s, l) => `${sx(l)},${sy(Math.log10(s))}`).join(' ')}
              className="duong-cong"
            />
            {std.map((s, l) => (
              <circle key={l} cx={sx(l)} cy={sy(Math.log10(s))} r={4} className="diem-hien-tai" />
            ))}
          </>
        )}
        {std.map((_, l) => (
          <text key={l} x={sx(l)} y={H - 14} textAnchor="middle" className="nhan">{l}</text>
        ))}
        <text x={W / 2} y={H - 1} textAnchor="middle" className="nhan">lớp thứ mấy</text>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setHien(true)} disabled={hien || (!!props.duDoan && daDoan === null)}>
          Chạy qua 8 lớp
        </button>
        <button onClick={() => setHien(false)} disabled={!hien}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Mỗi lớp nhân độ lệch chuẩn với <b>√d · σ_w = {tron(Math.sqrt(d))} × {sigma.toFixed(3)} = {tron(heSo)}</b>.
        {hien && (
          <>
            {' '}Sau {SO_LOP} lớp: σ = <b>{goc(cuoi)}</b> (bắt đầu từ 1).
            <br />
            {tot ? (
              <>Hệ số ≈ 1 nên tín hiệu giữ nguyên biên độ qua mọi lớp. Đây đúng là lý do khởi tạo chuẩn dùng σ_w ≈ 1/√d.</>
            ) : heSo < 1 ? (
              <b className="canh-bao">Hệ số {'<'} 1: tín hiệu tắt dần theo cấp số nhân, lớp sau gần như toàn số 0 — gradient cũng biến mất theo.</b>
            ) : (
              <b className="canh-bao">Hệ số {'>'} 1: tín hiệu nổ theo cấp số nhân, chẳng mấy chốc thành inf/NaN.</b>
            )}
          </>
        )}
      </figcaption>
    </figure>
  );
}
