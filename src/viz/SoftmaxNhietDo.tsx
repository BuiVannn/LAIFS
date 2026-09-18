import { useEffect, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Điểm thô (logit) của 5 từ ứng viên sau câu "Hôm nay trời rất ..."
const UNG_VIEN: { tu: string; logit: number }[] = [
  { tu: 'đẹp', logit: 3.2 },
  { tu: 'nóng', logit: 2.8 },
  { tu: 'lạnh', logit: 2.1 },
  { tu: 'xanh', logit: 1.0 },
  { tu: 'buồn', logit: 0.2 },
];

const tron = (v: number) => Math.round(v * 10000) / 10000;

// Softmax ổn định số: trừ max trước khi lấy exp
function softmax(logits: number[], tau: number) {
  const z = logits.map((v) => v / tau);
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp(v - m));
  const tong = e.reduce((a, b) => a + b, 0);
  return e.map((v) => tron(v / tong));
}

type Props = {
  tau?: number; // kịch bản: bấm Chạy thì nhiệt độ trượt từ 1 tới giá trị này
  duDoan?: DuDoanCauHoi;
};

const W = 600, H = 300, PAD_T = 26, PAD_D = 52, PAD_X = 34;

export default function SoftmaxNhietDo(props: Props) {
  const dich = props.tau ?? 1;
  const [tau, setTau] = useState(props.duDoan ? 1 : dich);
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = !!props.duDoan && tau === dich && dich !== 1;

  useEffect(() => {
    if (!dangChay) return;
    if (tau === dich) return setDangChay(false);
    const t = setTimeout(
      () => setTau((v) => (Math.abs(dich - v) <= 0.1 ? dich : tron(v + 0.1 * Math.sign(dich - v)))),
      70,
    );
    return () => clearTimeout(t);
  }, [dangChay, tau]);

  const p = softmax(UNG_VIEN.map((u) => u.logit), tau);
  const rongCot = (W - 2 * PAD_X) / UNG_VIEN.length;
  const cao = (v: number) => Math.round(v * (H - PAD_T - PAD_D));
  // Entropy: phân phối càng phẳng thì càng lớn (tối đa log 5 ≈ 1.609)
  const entropy = -p.reduce((a, v) => a + (v > 0 ? v * Math.log(v) : 0), 0);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Nhiệt độ τ = <b>{tau.toFixed(2)}</b>
          <input
            disabled={khoaThamSo}
            type="range"
            min={0.1}
            max={5}
            step={0.05}
            value={tau}
            onChange={(e) => setTau(+e.target.value)}
          />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Phân phối softmax của 5 từ ứng viên theo nhiệt độ">
        <text x={PAD_X} y={16} className="nhan">
          "Hôm nay trời rất ___" · cột = xác suất softmax(logit / τ)
        </text>
        <line x1={PAD_X} x2={W - PAD_X} y1={H - PAD_D} y2={H - PAD_D} className="truc" />
        {UNG_VIEN.map((u, i) => {
          const x = PAD_X + i * rongCot;
          const h = cao(p[i]);
          return (
            <g key={u.tu}>
              <rect
                x={x + 8}
                y={H - PAD_D - h}
                width={rongCot - 16}
                height={Math.max(h, 1)}
                rx={4}
                fill={i === 0 ? 'var(--nhan)' : 'var(--hieu)'}
              />
              <text x={x + rongCot / 2} y={H - PAD_D - h - 6} textAnchor="middle" className="nhan">
                {(p[i] * 100).toFixed(1)}%
              </text>
              <text x={x + rongCot / 2} y={H - PAD_D + 18} textAnchor="middle" className="nhan">
                {u.tu}
              </text>
              <text x={x + rongCot / 2} y={H - PAD_D + 34} textAnchor="middle" className="nhan">
                z = {u.logit}
              </text>
            </g>
          );
        })}
      </svg>

      {props.duDoan && (
        <div className="viz-dieu-khien">
          <button onClick={() => setDangChay(true)} disabled={!choChay || dangChay || daChay}>
            Chạy tới τ = {dich}
          </button>
          <button onClick={() => { setDangChay(false); setTau(1); }}>Đặt lại</button>
        </div>
      )}

      <figcaption aria-live="polite">
        τ = <b>{tau.toFixed(2)}</b> · xác suất từ dẫn đầu ("đẹp") = <b>{(p[0] * 100).toFixed(2)}%</b> · entropy ={' '}
        <b>{entropy.toFixed(4)}</b> (tối đa ln 5 ≈ 1.6094 khi phẳng hoàn toàn)
        <br />
        {tau < 0.5
          ? 'τ nhỏ: phân phối nhọn, gần như luôn chọn từ có logit lớn nhất — văn bản an toàn nhưng lặp và nhàm.'
          : tau > 2
            ? 'τ lớn: phân phối phẳng, từ có logit thấp cũng dễ được chọn — văn bản đa dạng nhưng dễ lạc đề.'
            : 'τ quanh 1: giữ nguyên phân phối mô hình học được.'}
      </figcaption>
    </figure>
  );
}
