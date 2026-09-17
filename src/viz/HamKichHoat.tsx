import { useEffect, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Sigmoid viết hai nhánh để exp không tràn số khi |x| lớn
const sigmoid = (x: number) => (x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x)));

type Ham = { ten: string; f: (x: number) => number; df: (x: number) => number; congThuc: string };

const HAM: Record<string, Ham> = {
  sigmoid: { ten: 'Sigmoid', f: sigmoid, df: (x) => sigmoid(x) * (1 - sigmoid(x)), congThuc: "σ′(x) = σ(x)·(1 − σ(x))" },
  tanh: { ten: 'Tanh', f: Math.tanh, df: (x) => 1 - Math.tanh(x) ** 2, congThuc: "tanh′(x) = 1 − tanh²(x)" },
  relu: { ten: 'ReLU', f: (x) => Math.max(0, x), df: (x) => (x > 0 ? 1 : 0), congThuc: "ReLU′(x) = 1 nếu x > 0, ngược lại 0" },
};

const W = 600, H = 340, PAD = 30;
const XMIN = -6, XMAX = 6, YMIN = -1.2, YMAX = 1.6;

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (v: number) => tron(PAD + ((v - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD));
// Kẹp y trong khung (ReLU vượt khỏi miền vẽ khi x lớn)
const sy = (v: number) => tron(H - PAD - ((Math.min(Math.max(v, YMIN - 0.5), YMAX + 0.5) - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD));

type Props = {
  ham?: keyof typeof HAM;
  x?: number; // kịch bản: bấm Chạy thì x trượt từ 0 tới giá trị này
  duDoan?: DuDoanCauHoi;
};

export default function HamKichHoat(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof HAM>(props.ham ?? 'sigmoid');
  const dich = props.x ?? 0;
  const [x, setX] = useState(props.duDoan ? 0 : dich);
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = !!props.duDoan && x === dich && dich !== 0;
  const ham = HAM[khoa];

  useEffect(() => {
    if (!dangChay) return;
    if (x === dich) return setDangChay(false);
    const t = setTimeout(() => setX((v) => (Math.abs(dich - v) <= 0.25 ? dich : tron(v + 0.25 * Math.sign(dich - v)))), 60);
    return () => clearTimeout(t);
  }, [dangChay, x]);

  const duong = (g: (v: number) => number) => {
    const pts = [];
    for (let i = 0; i <= 240; i++) {
      const v = XMIN + ((XMAX - XMIN) * i) / 240;
      pts.push(`${sx(v)},${sy(g(v))}`);
    }
    return pts.join(' ');
  };

  const fx = ham.f(x), g = ham.df(x), d = 0.8;

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Hàm
          <select disabled={khoaThamSo} value={khoa} onChange={(e) => setKhoa(e.target.value as keyof typeof HAM)}>
            {Object.entries(HAM).map(([k, h]) => (
              <option key={k} value={k}>{h.ten}</option>
            ))}
          </select>
        </label>
        <label>
          x = <b>{x}</b>
          <input disabled={khoaThamSo} type="range" min={XMIN} max={XMAX} step={0.25} value={x} onChange={(e) => setX(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Đồ thị hàm ${ham.ten} (nét liền) và đạo hàm của nó (nét đứt)`}>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <line x1={PAD} x2={W - PAD} y1={sy(1)} y2={sy(1)} className="truc" strokeDasharray="2 4" />
        <text x={PAD + 2} y={sy(1) - 4} className="nhan">1</text>
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x</text>
        <text x={PAD} y={PAD - 10} className="nhan">nét liền: {ham.ten}(x) · nét đứt đỏ: đạo hàm · đoạn xanh: tiếp tuyến</text>
        <polyline points={duong(ham.f)} className="duong-cong" />
        <polyline points={duong(ham.df)} fill="none" className="duong-di" />
        <line x1={sx(x - d)} y1={sy(fx - g * d)} x2={sx(x + d)} y2={sy(fx + g * d)} className="tiep-tuyen" />
        <circle cx={sx(x)} cy={sy(g)} r={5} className="diem-cu" />
        <circle cx={sx(x)} cy={sy(fx)} r={7} className="diem-hien-tai" />
      </svg>

      {props.duDoan && (
        <div className="viz-dieu-khien">
          <button onClick={() => setDangChay(true)} disabled={!choChay || dangChay || daChay}>Chạy tới x = {dich}</button>
          <button onClick={() => { setDangChay(false); setX(0); }}>Đặt lại</button>
        </div>
      )}

      <figcaption aria-live="polite">
        x = <b>{x}</b> · {ham.ten}(x) = <b>{fx.toFixed(4)}</b> · đạo hàm = <b className={Math.abs(g) < 0.01 ? 'canh-bao' : ''}>{g.toFixed(4)}</b>
        <br />
        {ham.congThuc}
        {Math.abs(g) < 0.01 && <> · <b className="canh-bao">đạo hàm gần như bằng 0: tín hiệu học đi qua đây gần như tắt</b></>}
      </figcaption>
    </figure>
  );
}
