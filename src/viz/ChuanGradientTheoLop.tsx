import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Đo chuẩn Frobenius của ∂L/∂W ở TỪNG lớp trong một mạng sâu toàn lớp dày.
// Mọi con số do chính component tính lại (xuôi + ngược bằng tay), không có bảng dựng sẵn.
// Mạng: A₀ = X, Z_l = A_{l−1} W_l, A_l = f(Z_l), loss = trung bình của A_L.

const D = 16; // số neuron mỗi lớp
const N = 8; // số mẫu trong batch
const SEED = 12345;

// mulberry32: cùng seed thì Node (dựng sẵn) và trình duyệt cho cùng dãy số
function tao_rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function chuan_hoa_gauss(r: () => number, n: number, he_so: number) {
  const v = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(r(), 1e-12);
    v[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * r()) * he_so;
  }
  return v;
}

// C(ar×bc) = A(ar×ac) · B(ac×bc)
function nhan(A: Float64Array, ar: number, ac: number, B: Float64Array, bc: number) {
  const C = new Float64Array(ar * bc);
  for (let i = 0; i < ar; i++)
    for (let k = 0; k < ac; k++) {
      const a = A[i * ac + k];
      if (a === 0) continue;
      for (let j = 0; j < bc; j++) C[i * bc + j] += a * B[k * bc + j];
    }
  return C;
}

// C(ac×bc) = Aᵀ · B, với A là (ar×ac), B là (ar×bc)
function nhan_AT(A: Float64Array, ar: number, ac: number, B: Float64Array, bc: number) {
  const C = new Float64Array(ac * bc);
  for (let i = 0; i < ar; i++)
    for (let k = 0; k < ac; k++) {
      const a = A[i * ac + k];
      if (a === 0) continue;
      for (let j = 0; j < bc; j++) C[k * bc + j] += a * B[i * bc + j];
    }
  return C;
}

// C(ar×br) = A · Bᵀ, với A là (ar×ac), B là (br×ac)
function nhan_BT(A: Float64Array, ar: number, ac: number, B: Float64Array, br: number) {
  const C = new Float64Array(ar * br);
  for (let i = 0; i < ar; i++)
    for (let j = 0; j < br; j++) {
      let s = 0;
      for (let k = 0; k < ac; k++) s += A[i * ac + k] * B[j * ac + k];
      C[i * br + j] = s;
    }
  return C;
}

const KICH_HOAT = {
  sigmoid: {
    ten: 'Sigmoid',
    f: (z: number) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z))),
    df: (_z: number, a: number) => a * (1 - a),
  },
  tanh: { ten: 'Tanh', f: Math.tanh, df: (_z: number, a: number) => 1 - a * a },
  relu: { ten: 'ReLU', f: (z: number) => (z > 0 ? z : 0), df: (z: number) => (z > 0 ? 1 : 0) },
};

const KHOI_TAO = {
  nho: { ten: 'Nhỏ cố định (σ = 0.01)', std: 0.01 },
  xavier: { ten: 'Xavier/Glorot (σ = √(1/d))', std: Math.sqrt(1 / D) },
  he: { ten: 'He (σ = √(2/d))', std: Math.sqrt(2 / D) },
  lon: { ten: 'Quá lớn (σ = 4/√d)', std: 4 / Math.sqrt(D) },
};

type TenKichHoat = keyof typeof KICH_HOAT;
type TenKhoiTao = keyof typeof KHOI_TAO;

function do_chuan_gradient(kichHoat: TenKichHoat, khoiTao: TenKhoiTao, soLop: number) {
  const { f, df } = KICH_HOAT[kichHoat];
  const r = tao_rng(SEED);
  const X = chuan_hoa_gauss(r, N * D, 1);
  const Ws: Float64Array[] = [];
  for (let l = 0; l < soLop; l++) Ws.push(chuan_hoa_gauss(r, D * D, KHOI_TAO[khoiTao].std));

  const A: Float64Array[] = [X];
  const Z: Float64Array[] = [];
  for (let l = 0; l < soLop; l++) {
    const z = nhan(A[l], N, D, Ws[l], D);
    const a = new Float64Array(N * D);
    for (let i = 0; i < N * D; i++) a[i] = f(z[i]);
    Z.push(z);
    A.push(a);
  }

  // loss = trung bình mọi phần tử của A_L  ⇒  ∂L/∂A_L = 1/(N·D)
  let dA = new Float64Array(N * D).fill(1 / (N * D));
  const chuan: number[] = [];
  for (let l = soLop - 1; l >= 0; l--) {
    const dZ = new Float64Array(N * D);
    for (let i = 0; i < N * D; i++) dZ[i] = dA[i] * df(Z[l][i], A[l + 1][i]);
    const dW = nhan_AT(A[l], N, D, dZ, D);
    let s = 0;
    for (let i = 0; i < D * D; i++) s += dW[i] * dW[i];
    chuan[l] = Math.sqrt(s);
    dA = nhan_BT(dZ, N, D, Ws[l], D);
  }
  return chuan;
}

const W = 620, H = 330, PADL = 52, PADR = 20, PADT = 30, PADB = 40;
const LOG_MIN = -40, LOG_MAX = 10; // trục dọc là log10 của chuẩn gradient

const tron = (v: number) => Math.round(v * 10) / 10;
const kep = (v: number) => Math.min(LOG_MAX, Math.max(LOG_MIN, v));
const chu_so_mu = (v: number) => (v === 0 ? '0' : v.toExponential(1));

type Props = {
  kichHoat?: TenKichHoat;
  khoiTao?: TenKhoiTao;
  soLop?: number;
  duDoan?: DuDoanCauHoi;
};

export default function ChuanGradientTheoLop(props: Props) {
  const [kichHoat, setKichHoat] = useState<TenKichHoat>(props.kichHoat ?? 'relu');
  const [khoiTao, setKhoiTao] = useState<TenKhoiTao>(props.khoiTao ?? 'he');
  const [soLop, setSoLop] = useState(props.soLop ?? 20);
  const [daChay, setDaChay] = useState(!props.duDoan);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;

  const chuan = useMemo(() => do_chuan_gradient(kichHoat, khoiTao, soLop), [kichHoat, khoiTao, soLop]);

  const sx = (l: number) => tron(PADL + ((l - 1) / Math.max(1, soLop - 1)) * (W - PADL - PADR));
  const sy = (logv: number) => tron(H - PADB - ((kep(logv) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (H - PADT - PADB));
  const log10 = (v: number) => (v > 0 ? Math.log(v) / Math.LN10 : LOG_MIN);

  const dau = chuan[0], cuoi = chuan[chuan.length - 1];
  const tiLe = cuoi > 0 ? dau / cuoi : 0;
  const bungNo = dau > 1e5 || cuoi > 1e5;
  const tatHan = !bungNo && dau < 1e-12 && cuoi < 1e-12;
  const bienMat = !bungNo && !tatHan && tiLe > 0 && tiLe < 1e-6;
  const lech = !bungNo && !tatHan && !bienMat && (tiLe < 0.01 || tiLe > 100);

  const diem = chuan.map((v, i) => `${sx(i + 1)},${sy(log10(v))}`).join(' ');

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Hàm kích hoạt
          <select disabled={khoaThamSo} value={kichHoat} onChange={(e) => setKichHoat(e.target.value as TenKichHoat)}>
            {Object.entries(KICH_HOAT).map(([k, v]) => (
              <option key={k} value={k}>{v.ten}</option>
            ))}
          </select>
        </label>
        <label>
          Khởi tạo trọng số
          <select disabled={khoaThamSo} value={khoiTao} onChange={(e) => setKhoiTao(e.target.value as TenKhoiTao)}>
            {Object.entries(KHOI_TAO).map(([k, v]) => (
              <option key={k} value={k}>{v.ten}</option>
            ))}
          </select>
        </label>
        <label>
          Số lớp = <b>{soLop}</b>
          <input disabled={khoaThamSo} type="range" min={4} max={20} step={1} value={soLop} onChange={(e) => setSoLop(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Chuẩn gradient của từng lớp trong mạng ${soLop} lớp dùng ${KICH_HOAT[kichHoat].ten}`}>
        {[-40, -30, -20, -10, 0, 10].map((t) => (
          <g key={t}>
            <line x1={PADL} x2={W - PADR} y1={sy(t)} y2={sy(t)} className="truc" strokeDasharray="2 4" />
            <text x={PADL - 6} y={sy(t) + 4} textAnchor="end" className="nhan">1e{t}</text>
          </g>
        ))}
        <line x1={PADL} x2={W - PADR} y1={sy(0)} y2={sy(0)} className="truc" />
        <text x={PADL} y={PADT - 12} className="nhan">‖∂L/∂W‖ của từng lớp (trục dọc log) · trái = gần đầu vào, phải = gần loss</text>
        {daChay && <polyline points={diem} className="duong-cong" />}
        {daChay && chuan.map((v, i) => <circle key={i} cx={sx(i + 1)} cy={sy(log10(v))} r={4} className="diem-cu" />)}
        {daChay && <circle cx={sx(1)} cy={sy(log10(dau))} r={6} className="diem-hien-tai" />}
        <text x={PADL} y={H - 12} className="nhan">lớp 1</text>
        <text x={W - PADR} y={H - 12} textAnchor="end" className="nhan">lớp {soLop}</text>
      </svg>

      {props.duDoan && (
        <div className="viz-dieu-khien">
          <button onClick={() => setDaChay(true)} disabled={!choChay || daChay}>Đo gradient</button>
          <button onClick={() => setDaChay(false)}>Đặt lại</button>
        </div>
      )}

      <figcaption aria-live="polite">
        {!daChay ? (
          'Chọn dự đoán rồi bấm "Đo gradient".'
        ) : (
          <>
            Lớp 1: <b>{chu_so_mu(dau)}</b> · lớp {soLop}: <b>{chu_so_mu(cuoi)}</b> · tỉ lệ lớp 1 / lớp {soLop}: <b>{chu_so_mu(tiLe)}</b>
            <br />
            {bungNo && <b className="canh-bao">Gradient bùng nổ: chuẩn vượt 1e5, một bước cập nhật sẽ hất trọng số đi rất xa (dễ thành nan).</b>}
            {tatHan && <b className="canh-bao">Mọi lớp đều gần 0: tín hiệu lượt xuôi đã tắt ngay từ đầu vì trọng số khởi tạo quá nhỏ.</b>}
            {bienMat && <b className="canh-bao">Gradient biến mất: lớp đầu nhận tín hiệu nhỏ hơn lớp cuối hàng triệu lần trở lên, gần như không học.</b>}
            {lech && <b className="canh-bao">Gradient lệch hơn 100 lần giữa lớp đầu và lớp cuối: một learning rate chung khó vừa cho cả hai.</b>}
            {!bungNo && !tatHan && !bienMat && !lech && 'Mọi lớp nhận gradient cùng cỡ độ lớn: mạng này huấn luyện được.'}
          </>
        )}
      </figcaption>
    </figure>
  );
}
