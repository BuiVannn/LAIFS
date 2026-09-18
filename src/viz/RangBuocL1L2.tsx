import { useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Bài toán 2 tham số có thật, sinh sẵn bằng numpy rồi dán vào đây để Node (SSR) và trình duyệt
// cho ra ĐÚNG cùng một con số: 40 mẫu, hai đặc trưng tương quan mạnh, đã chuẩn hoá cột.
// A = XᵀX (nên đường đồng mức của ‖Xw − y‖² là ellipse tâm w_OLS, dạng (w−w*)ᵀA(w−w*) = c).
const A = [
  [40, 31.7467],
  [31.7467, 40],
];
const W_OLS = [1.7719, 0.0558];
// Trục chính/phụ của ellipse: trị riêng + vector riêng của A (đúng 45° vì A đối xứng đều)
const EV = [8.2533, 71.7467];
const VEC = [
  [0.7071, -0.7071],
  [-0.7071, -0.7071],
];

// Nghiệm ridge (dạng đóng) và lasso (coordinate descent, 3000 vòng) tại từng λ.
const DUONG: { lam: number; r: number[]; l: number[] }[] = [
  { lam: 0, r: [1.7719, 0.0558], l: [1.7719, 0.0558] },
  { lam: 2, r: [1.5797, 0.1984], l: [1.7579, 0.0419] },
  { lam: 5, r: [1.3886, 0.32], l: [1.737, 0.021] },
  { lam: 10, r: [1.19, 0.4141], l: [1.6912, 0] },
  { lam: 20, r: [0.9653, 0.464], l: [1.5662, 0] },
  { lam: 40, r: [0.7335, 0.44], l: [1.3162, 0] },
  { lam: 70, r: [0.553, 0.3721], l: [0.9412, 0] },
  { lam: 110, r: [0.4206, 0.3009], l: [0.4412, 0] },
  { lam: 170, r: [0.3109, 0.2315], l: [0, 0] },
  { lam: 260, r: [0.224, 0.1712], l: [0, 0] },
  { lam: 400, r: [0.1563, 0.1216], l: [0, 0] },
];

const W = 560, H = 460, PAD = 40;
const MX: [number, number] = [-0.5, 2.3];
const MY: [number, number] = [-1.1, 1.1];

type Props = {
  // Chỉ số λ khởi đầu trong DUONG (0 = λ 0, 10 = λ 400)
  i0?: number;
  // Có duDoan: khoá thanh trượt, phải đoán trước rồi mới được kéo
  duDoan?: DuDoanCauHoi;
};

// Làm tròn toạ độ để SSR và trình duyệt khớp nhau (tránh lệch hydration)
const tron = (v: number) => Math.round(v * 100) / 100;
const chuan1 = (w: number[]) => Math.abs(w[0]) + Math.abs(w[1]);
const chuan2 = (w: number[]) => Math.sqrt(w[0] * w[0] + w[1] * w[1]);
// Giá trị hàm mất mát tại w, đo bằng đường đồng mức: c = (w − w*)ᵀ A (w − w*)
const mucLoss = (w: number[]) => {
  const d = [w[0] - W_OLS[0], w[1] - W_OLS[1]];
  return d[0] * (A[0][0] * d[0] + A[0][1] * d[1]) + d[1] * (A[1][0] * d[0] + A[1][1] * d[1]);
};

export default function RangBuocL1L2(props: Props) {
  const [i, setI] = useState(props.i0 ?? 0);
  const [daKeo, setDaKeo] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'rbl' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoa = !!props.duDoan && daDoan === null;

  const sx = (v: number) => tron(PAD + ((v - MX[0]) / (MX[1] - MX[0])) * (W - 2 * PAD));
  const sy = (v: number) => tron(H - PAD - ((v - MY[0]) / (MY[1] - MY[0])) * (H - 2 * PAD));

  const buoc = DUONG[i];
  const wR = buoc.r, wL = buoc.l;
  const soKhong = wL.filter((v) => v === 0).length;

  // Ellipse đồng mức đi qua điểm w: tham số hoá theo trục riêng của A
  const ellipse = (w: number[]) => {
    const c = mucLoss(w);
    const a = Math.sqrt(c / EV[0]), b = Math.sqrt(c / EV[1]);
    return Array.from({ length: 121 }, (_, t) => {
      const th = (2 * Math.PI * t) / 120;
      const u = a * Math.cos(th), v = b * Math.sin(th);
      const p0 = W_OLS[0] + u * VEC[0][0] + v * VEC[1][0];
      const p1 = W_OLS[1] + u * VEC[0][1] + v * VEC[1][1];
      return `${sx(p0)},${sy(p1)}`;
    }).join(' ');
  };
  const tronVe = (r: number) =>
    Array.from({ length: 121 }, (_, t) => {
      const th = (2 * Math.PI * t) / 120;
      return `${sx(r * Math.cos(th))},${sy(r * Math.sin(th))}`;
    }).join(' ');
  const thoi = (t: number) =>
    `${sx(t)},${sy(0)} ${sx(0)},${sy(t)} ${sx(-t)},${sy(0)} ${sx(0)},${sy(-t)}`;

  const doi = (v: number) => { setI(v); setDaKeo(true); };

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daKeo} />}
      <div className="viz-dieu-khien">
        <label>
          Sức phạt λ = <b>{buoc.lam}</b>
          <input disabled={khoa} type="range" min={0} max={DUONG.length - 1} step={1} value={i}
            onChange={(e) => doi(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Vùng ràng buộc hình thoi của L1 và hình tròn của L2 so với đường đồng mức của hàm mất mát">
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">w₁</text>
        <text x={sx(0) + 6} y={PAD + 12} className="nhan">w₂</text>

        <g clipPath={`url(#${clipId})`}>
          <polyline points={ellipse(wR)} className="duong-cong" />
          <polyline points={ellipse(wL)} className="tiep-tuyen" />
          <polyline points={tronVe(chuan2(wR))} className="duong-di" />
          <polygon points={thoi(chuan1(wL))} className="vung-duong" />
          <polygon points={thoi(chuan1(wL))} className="tiep-tuyen" fill="none" />
          <circle cx={sx(W_OLS[0])} cy={sy(W_OLS[1])} r={4} className="diem-cu" />
          <text x={sx(W_OLS[0]) + 8} y={sy(W_OLS[1]) - 6} className="nhan">w* (không phạt)</text>
          <circle cx={sx(wR[0])} cy={sy(wR[1])} r={6} className="diem-hien-tai" />
          <circle cx={sx(wL[0])} cy={sy(wL[1])} r={6} className="diem-hien-tai" />
        </g>
      </svg>

      <div className="chu-giai">
        <span>— đứt nét: hình tròn ‖w‖₂ của nghiệm L2 (ridge)</span>
        <span>— xanh, tô mờ: hình thoi ‖w‖₁ của nghiệm L1 (lasso)</span>
        <span>— ellipse: đường đồng mức hàm mất mát qua từng nghiệm</span>
      </div>

      <figcaption aria-live="polite">
        λ = <b>{buoc.lam}</b>
        <br />
        L2 (ridge): w = (<b>{wR[0].toFixed(4)}</b>, <b>{wR[1].toFixed(4)}</b>) — không hệ số nào bằng 0
        <br />
        L1 (lasso): w = (<b>{wL[0].toFixed(4)}</b>, <b>{wL[1].toFixed(4)}</b>) — <b>{soKhong}</b>/2 hệ số bằng 0 <i>đúng</i>
        <br />
        <span className="mo">
          Kéo λ lên và nhìn vào điểm chạm: ellipse chạm hình tròn ở chỗ trơn nên hai toạ độ đều khác 0;
          còn hình thoi nhô ra bốn <b>góc nhọn</b> nằm trên trục, nên ellipse rất dễ chạm vào góc — mà ở góc
          thì một toạ độ đúng bằng 0. Từ λ = 10 trở đi, lasso đã dính góc và giữ nguyên w₂ = 0, còn ridge
          chỉ co dần chứ không bao giờ chạm trục.
        </span>
      </figcaption>
    </figure>
  );
}
