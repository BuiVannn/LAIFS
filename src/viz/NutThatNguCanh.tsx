import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Nút thắt ngữ cảnh của seq2seq: câu nguồn dài ra, nhưng vector ngữ cảnh c vẫn chỉ 2 số.
// Đo "dấu vết của từ đầu câu" bằng cách đổi từ thứ nhất rồi xem c lệch đi bao nhiêu.
// Mọi con số dưới đây do chính component tính lại từ đầu, không có bảng số dựng sẵn.

const TU = ['mèo', 'đen', 'ngồi', 'trên', 'ghế', 'gỗ', 'cũ', 'trong', 'góc', 'bếp',
  'nhỏ', 'của', 'bà', 'tôi', 'từ', 'mùa', 'đông', 'năm', 'ngoái', 'rồi'];

// Embedding 2 chiều cố định của từng từ (bịa ra cho ví dụ, nhưng cố định để kết quả lặp lại được)
const EMB: [number, number][] = [
  [1.0, 0.0], [-0.13, 0.75], [-0.97, -0.99], [0.38, 0.58], [0.87, 0.22],
  [-0.6, -0.88], [-0.71, 0.94], [0.79, -0.38], [0.51, -0.43], [-0.92, 0.96],
  [-0.28, -0.85], [0.99, 0.17], [0.02, 0.62], [-0.99, -1.0], [0.24, 0.71],
  [0.93, 0.06], [-0.48, -0.78], [-0.81, 0.99], [0.69, -0.53], [0.63, -0.28],
];

const TU_THAY = 'chó';
const EMB_THAY: [number, number] = [-0.8, 0.9];
const RHO = 0.9; // W_h = 0.9·I
const N_MAX = TU.length;

const W = 640, H = 310;
const CX0 = 60, CX1 = 560, CY = 58;      // hàng các bước RNN
const BX = 200, BY = 96, BW = 240, BH = 34; // hộp vector ngữ cảnh
const GX0 = 60, GX1 = 560, GY0 = 180, GY1 = 286; // vùng đồ thị
const D_MAX = 1.7;

// h_t = tanh(0.9·h_{t−1} + x_t), h_0 = 0
function machHoa(n: number, doiTuDau: boolean): [number, number] {
  let h: [number, number] = [0, 0];
  for (let t = 0; t < n; t++) {
    const x = t === 0 && doiTuDau ? EMB_THAY : EMB[t];
    h = [Math.tanh(RHO * h[0] + x[0]), Math.tanh(RHO * h[1] + x[1])];
  }
  return h;
}

type Props = {
  n?: number;
  duDoan?: DuDoanCauHoi;
};

export default function NutThatNguCanh(props: Props) {
  const [n, setN] = useState(props.n ?? 2);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = n >= N_MAX;

  // Tính sẵn cho mọi độ dài: c(n) và khoảng cách tới c khi đổi từ đầu câu
  const bang = useMemo(() => {
    const kq: { c: [number, number]; d: number }[] = [];
    for (let i = 1; i <= N_MAX; i++) {
      const c = machHoa(i, false);
      const c2 = machHoa(i, true);
      kq.push({ c, d: Math.hypot(c[0] - c2[0], c[1] - c2[1]) });
    }
    return kq;
  }, []);

  const { c, d } = bang[n - 1];

  // Làm tròn toạ độ để SSR và trình duyệt cho cùng một chuỗi
  const tron = (x: number) => Math.round(x * 100) / 100;
  const px = (i: number) => tron(CX0 + ((CX1 - CX0) * i) / (N_MAX - 1));         // i: 0..19
  const gx = (i: number) => tron(GX0 + ((GX1 - GX0) * i) / (N_MAX - 1));
  const gy = (v: number) => tron(GY1 - (Math.min(v, D_MAX) / D_MAX) * (GY1 - GY0));

  const duongCong = bang.map((b, i) => `${gx(i)},${gy(b.d)}`).join(' ');
  const cau = TU.slice(0, n).join(' ');

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Độ dài câu nguồn n = <b>{n}</b> từ
          <input disabled={khoaThamSo} type="range" min={1} max={N_MAX} step={1} value={n}
            onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Câu nguồn dài dần nhưng vector ngữ cảnh vẫn cố định 2 số; đồ thị cho thấy dấu vết của từ đầu câu giảm dần">
        <text x={10} y={20} className="nhan">Bộ mã hoá đọc từng từ · h₍t₎ = tanh(0,9·h₍t−1₎ + x₍t₎)</text>

        {/* các bước RNN: nối bằng đường, ô đầu tiên tô đỏ */}
        {Array.from({ length: n - 1 }, (_, i) => (
          <line key={'l' + i} x1={px(i)} y1={CY} x2={px(i + 1)} y2={CY} stroke="var(--vien)" strokeWidth={2} />
        ))}
        {Array.from({ length: n }, (_, i) => (
          <circle key={'c' + i} cx={px(i)} cy={CY} r={i === 0 ? 8 : 6}
            fill={i === 0 ? 'var(--sai)' : 'var(--nen-phu)'} stroke="var(--chu-mo)" strokeWidth={1.5} />
        ))}
        <text x={px(0)} y={CY - 16} textAnchor="middle" fill="var(--sai)" fontSize={13} fontWeight={600}>{TU[0]}</text>
        {n > 1 && (
          <text x={px(n - 1)} y={CY - 16} textAnchor="middle" fill="var(--chu-mo)" fontSize={13}>{TU[n - 1]}</text>
        )}

        {/* mọi trạng thái đều bị nén vào một hộp duy nhất */}
        <line x1={px(n - 1)} y1={CY + 8} x2={BX + BW / 2} y2={BY} stroke="var(--nhan)" strokeWidth={2.5} />
        <rect x={BX} y={BY} width={BW} height={BH} rx={8} fill="var(--nhan-nhat)" stroke="var(--nhan)" strokeWidth={2} />
        <text x={BX + BW / 2} y={BY + 22} textAnchor="middle" fill="var(--chu)" fontSize={14} fontWeight={600}>
          c = ({c[0].toFixed(4)}, {c[1].toFixed(4)})
        </text>
        <text x={BX + BW + 10} y={BY + 22} fill="var(--chu-mo)" fontSize={12}>luôn 2 số, dù n = {n}</text>

        {/* đồ thị dấu vết của từ đầu câu */}
        <text x={GX0} y={GY0 - 26} fill="var(--chu)" fontSize={13} fontWeight={600}>
          Dấu vết của từ đầu câu trong c
        </text>
        <text x={GX0} y={GY0 - 10} className="nhan">
          ‖c("{TU[0]} …") − c("{TU_THAY} …")‖ — đổi mỗi từ thứ nhất, c lệch đi bao nhiêu?
        </text>
        <line x1={GX0} y1={GY1} x2={GX1} y2={GY1} className="truc" />
        <line x1={GX0} y1={GY0} x2={GX0} y2={GY1} className="truc" />
        <polyline points={duongCong} className="duong-cong" />
        {bang.map((b, i) => (
          <circle key={'g' + i} cx={gx(i)} cy={gy(b.d)} r={i === n - 1 ? 6 : 2.5}
            className={i === n - 1 ? 'diem-hien-tai' : 'diem-cu'} />
        ))}
        <text x={GX0 - 4} y={GY0 + 4} textAnchor="end" className="nhan">{D_MAX}</text>
        <text x={GX0 - 4} y={GY1 + 4} textAnchor="end" className="nhan">0</text>
        <text x={gx(0)} y={GY1 + 16} textAnchor="middle" className="nhan">n=1</text>
        <text x={gx(N_MAX - 1)} y={GY1 + 16} textAnchor="middle" className="nhan">n={N_MAX}</text>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setN(n + 1)} disabled={!choChay || n >= N_MAX}>Thêm một từ</button>
        <button onClick={() => setN(N_MAX)} disabled={!choChay || n >= N_MAX}>Kéo dài hết câu</button>
        <button onClick={() => setN(props.n ?? 2)}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Câu nguồn ({n} từ): <b>{cau}</b>
        <br />
        Dấu vết của từ đầu câu: <b>{d.toFixed(4)}</b>
        {n > 1 && <> — bằng <b>{(d / bang[0].d * 100).toFixed(1)}%</b> so với lúc câu chỉ có 1 từ</>}
      </figcaption>
    </figure>
  );
}
