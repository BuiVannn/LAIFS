import { useEffect, useMemo, useState } from 'react';

type Ham = { ten: string; f: (w: number) => number; df: (w: number) => number; x: [number, number]; y: [number, number]; w0: number; lr: number };

const HAM: Record<string, Ham> = {
  parabol: { ten: 'Parabol L = w²', f: (w) => w * w, df: (w) => 2 * w, x: [-3, 3], y: [-0.5, 9], w0: 2.5, lr: 0.1 },
  nhieu: {
    ten: 'Nhiều cực tiểu L = 0.1w⁴ − w² + 0.5w',
    f: (w) => 0.1 * w ** 4 - w * w + 0.5 * w,
    df: (w) => 0.4 * w ** 3 - 2 * w + 0.5,
    x: [-3.2, 3.2],
    y: [-4, 2.5],
    w0: 2.8,
    lr: 0.1,
  },
};

const W = 600, H = 340, PAD = 30;
const GIOI_HAN = 1e6; // |w| vượt ngưỡng này coi như phân kỳ

export default function GradientDescent1D() {
  const [khoa, setKhoa] = useState<keyof typeof HAM>('parabol');
  const ham = HAM[khoa];
  const [lr, setLr] = useState(ham.lr);
  const [w0, setW0] = useState(ham.w0);
  const [ws, setWs] = useState<number[]>([ham.w0]);
  const [dangChay, setDangChay] = useState(false);

  const w = ws[ws.length - 1];
  const phanKy = !Number.isFinite(w) || Math.abs(w) > GIOI_HAN;

  const sx = (v: number) => PAD + ((v - ham.x[0]) / (ham.x[1] - ham.x[0])) * (W - 2 * PAD);
  const sy = (v: number) => H - PAD - ((v - ham.y[0]) / (ham.y[1] - ham.y[0])) * (H - 2 * PAD);

  const duongCong = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const v = ham.x[0] + ((ham.x[1] - ham.x[0]) * i) / 200;
      pts.push(`${sx(v).toFixed(1)},${sy(ham.f(v)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [khoa]);

  const buoc = () => setWs((a) => [...a, a[a.length - 1] - lr * ham.df(a[a.length - 1])]);
  const datLai = (moiW0 = w0) => {
    setDangChay(false);
    setWs([moiW0]);
  };

  useEffect(() => {
    if (!dangChay || phanKy || ws.length > 300) return setDangChay(false);
    const t = setTimeout(buoc, 250);
    return () => clearTimeout(t);
  }, [dangChay, ws]);

  const chonHam = (k: keyof typeof HAM) => {
    setKhoa(k);
    setLr(HAM[k].lr);
    setW0(HAM[k].w0);
    setDangChay(false);
    setWs([HAM[k].w0]);
  };

  // Tiếp tuyến tại điểm hiện tại: độ dốc chính là đạo hàm
  const g = phanKy ? 0 : ham.df(w);
  const d = 0.6;

  return (
    <figure className="viz">
      <div className="viz-dieu-khien">
        <label>
          Hàm
          <select value={khoa} onChange={(e) => chonHam(e.target.value as keyof typeof HAM)}>
            {Object.entries(HAM).map(([k, h]) => (
              <option key={k} value={k}>{h.ten}</option>
            ))}
          </select>
        </label>
        <label>
          Learning rate η = <b>{lr}</b>
          <input type="range" min={0.01} max={1.1} step={0.01} value={lr} onChange={(e) => { setLr(+e.target.value); datLai(); }} />
        </label>
        <label>
          Điểm xuất phát w₀ = <b>{w0}</b>
          <input type="range" min={ham.x[0]} max={ham.x[1]} step={0.1} value={w0} onChange={(e) => { setW0(+e.target.value); datLai(+e.target.value); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Đồ thị ${ham.ten} và đường đi của gradient descent`}>
        <defs>
          <clipPath id="khung-gd"><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">w</text>
        <text x={sx(0) + 6} y={PAD + 10} className="nhan">L(w)</text>
        <g clipPath="url(#khung-gd)">
          <polyline points={duongCong} className="duong-cong" />
          {!phanKy && ws.slice(1).map((v, i) => (
            <line key={i} x1={sx(ws[i])} y1={sy(ham.f(ws[i]))} x2={sx(v)} y2={sy(ham.f(v))} className="duong-di" />
          ))}
          {!phanKy && ws.map((v, i) => (
            <circle key={i} cx={sx(v)} cy={sy(ham.f(v))} r={3} className="diem-cu" />
          ))}
          {!phanKy && (
            <>
              <line x1={sx(w - d)} y1={sy(ham.f(w) - g * d)} x2={sx(w + d)} y2={sy(ham.f(w) + g * d)} className="tiep-tuyen" />
              <circle cx={sx(w)} cy={sy(ham.f(w))} r={7} className="diem-hien-tai" />
            </>
          )}
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={buoc} disabled={phanKy || dangChay}>1 bước</button>
        <button onClick={() => setDangChay(!dangChay)} disabled={phanKy}>{dangChay ? 'Dừng' : 'Chạy'}</button>
        <button onClick={() => datLai()}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        {phanKy ? (
          <b className="canh-bao">Phân kỳ sau {ws.length - 1} bước: learning rate quá lớn, w chạy ra xa vô cùng.</b>
        ) : (
          <>
            Bước <b>{ws.length - 1}</b> · w = <b>{w.toFixed(4)}</b> · L(w) = <b>{ham.f(w).toFixed(4)}</b> · L′(w) = <b>{g.toFixed(4)}</b>
            <br />
            Bước tiếp theo: w ← {w.toFixed(3)} − {lr} × ({g.toFixed(3)}) = <b>{(w - lr * g).toFixed(3)}</b>
          </>
        )}
      </figcaption>
    </figure>
  );
}
