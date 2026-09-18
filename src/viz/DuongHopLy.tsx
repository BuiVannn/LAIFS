import { useEffect, useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Đường hợp lý của n lần tung đồng xu, k lần ngửa: L(p) = p^k (1−p)^(n−k).
// Dữ liệu CỐ ĐỊNH, tham số p thay đổi — đó là toàn bộ ý của "likelihood".

const W = 600, H = 340, PAD = 34;
const BUOC = 0.02; // lưới quét p

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (p: number) => tron(PAD + p * (W - 2 * PAD));
const sy = (t: number) => tron(H - PAD - t * (H - 2 * PAD)); // t đã chuẩn hoá về [0, 1]

const logL = (p: number, n: number, k: number) => k * Math.log(p) + (n - k) * Math.log(1 - p);

type Props = {
  n?: number;
  k?: number;
  duDoan?: DuDoanCauHoi;
};

export default function DuongHopLy({ n: nProp, k: kProp, duDoan }: Props) {
  const [n, setN] = useState(nProp ?? 10);
  const [k, setK] = useState(kProp ?? 7);
  const [p, setP] = useState(0.1);
  const [dangQuet, setDangQuet] = useState(false);
  const [daQuet, setDaQuet] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!duDoan;
  const choChay = !duDoan || daDoan !== null;

  // Chuẩn hoá theo đỉnh: L(p)/L(p̂) — nếu không thì đường dẹt sát trục vì tích các số < 1
  const { diem, dinh, logMax } = useMemo(() => {
    const pHat = k / n;
    // k = 0 hoặc k = n: đỉnh nằm ở biên, L(p̂) = 1 nên không cần chuẩn hoá
    const lm = pHat <= 0 || pHat >= 1 ? 0 : logL(pHat, n, k);
    const pts: string[] = [];
    for (let i = 1; i < 100; i++) {
      const v = i / 100;
      pts.push(`${sx(v)},${sy(Math.exp(logL(v, n, k) - lm))}`);
    }
    return { diem: pts.join(' '), dinh: pHat, logMax: lm };
  }, [n, k]);

  const pHatLuoi = useMemo(() => {
    let tot = BUOC, totL = -Infinity;
    for (let v = BUOC; v < 1; v += BUOC) {
      const l = logL(v, n, k);
      if (l > totL) [tot, totL] = [v, l];
    }
    return tot;
  }, [n, k]);

  useEffect(() => {
    if (!dangQuet) return;
    const t = setTimeout(() => {
      setP((cu) => {
        const moi = tron(cu + BUOC);
        if (moi >= 0.99) {
          setDangQuet(false);
          setDaQuet(true);
          return pHatLuoi;
        }
        return moi;
      });
    }, 70);
    return () => clearTimeout(t);
  }, [dangQuet, p]);

  const datLai = () => {
    setDangQuet(false);
    setDaQuet(false);
    setP(0.1);
  };

  const tyLe = Math.exp(logL(p, n, k) - logMax);

  return (
    <figure className="viz">
      {duDoan && <DuDoan q={duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daQuet} />}
      <div className="viz-dieu-khien">
        <label>
          Số lần tung n = <b>{n}</b>
          <input disabled={khoaThamSo} type="range" min={2} max={40} step={1} value={n}
            onChange={(e) => { const v = +e.target.value; setN(v); setK((c) => Math.min(c, v)); datLai(); }} />
        </label>
        <label>
          Số lần ngửa k = <b>{k}</b>
          <input disabled={khoaThamSo} type="range" min={0} max={n} step={1} value={k}
            onChange={(e) => { setK(+e.target.value); datLai(); }} />
        </label>
        <label>
          Tham số đang thử p = <b>{p.toFixed(2)}</b>
          <input disabled={dangQuet} type="range" min={0.02} max={0.98} step={BUOC} value={p}
            onChange={(e) => { setP(+e.target.value); setDaQuet(true); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Đường hợp lý theo tham số p">
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) + 18} textAnchor="end" className="nhan">p</text>
        <text x={sx(0) + 6} y={PAD} className="nhan">L(p) / L(p̂)</text>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <text key={v} x={sx(v)} y={sy(0) + 18} textAnchor="middle" className="nhan">{v}</text>
        ))}
        <polyline points={diem} className="duong-cong" />
        <line x1={sx(dinh)} x2={sx(dinh)} y1={sy(0)} y2={sy(1)} className="duong-di" />
        <text x={sx(dinh)} y={sy(1) - 8} textAnchor="middle" className="nhan">p̂ = {dinh.toFixed(2)}</text>
        <line x1={sx(p)} x2={sx(p)} y1={sy(0)} y2={sy(tyLe)} className="tiep-tuyen" />
        <circle cx={sx(p)} cy={sy(tyLe)} r={6} className="diem-hien-tai" />
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setDangQuet(true)} disabled={!choChay || dangQuet}>Quét p từ trái sang phải</button>
        <button onClick={datLai}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        Dữ liệu cố định: <b>{k}</b> ngửa / <b>{n}</b> lần tung.
        <br />
        Với p = <b>{p.toFixed(2)}</b>: L(p) = p<sup>{k}</sup>(1−p)<sup>{n - k}</sup> = <b>{logL(p, n, k) < -300 ? '≈ 0' : Math.exp(logL(p, n, k)).toExponential(3)}</b>
        {' · '}ln L(p) = <b>{logL(p, n, k).toFixed(4)}</b>
        {' · '}so với đỉnh: <b>{(tyLe * 100).toFixed(1)}%</b>
        <br />
        Đỉnh ở p̂ = k/n = <b>{dinh.toFixed(3)}</b> — đó chính là ước lượng hợp lý cực đại.
      </figcaption>
    </figure>
  );
}
