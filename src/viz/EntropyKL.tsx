import { useEffect, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// So p (thật, cố định) với q (dự đoán, chỉnh được qua logit) để thấy CE = H(p) + KL(p‖q),
// và thấy cross-entropy KHÔNG xuống được 0 mà chỉ xuống tới H(p).

const W = 600, H = 300, PAD = 38;
const NHAN = ['lớp 1', 'lớp 2', 'lớp 3'];

const softmax = (z: number[]) => {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
};

const xlogy = (x: number, y: number) => (x > 0 ? x * Math.log(y) : 0);
const tong = (a: number[]) => a.reduce((x, y) => x + y, 0);

const tron = (v: number) => Math.round(v * 100) / 100;

type Props = {
  p?: number[];
  duDoan?: DuDoanCauHoi;
};

export default function EntropyKL({ p: pProp, duDoan }: Props) {
  const p = pProp ?? [0.5, 0.3, 0.2];
  const dich = [Math.log(p[0] / p[2]), Math.log(p[1] / p[2])].map(tron);
  const [z, setZ] = useState<number[]>([1.6, -0.4]);
  const [dangChay, setDangChay] = useState(false);
  const [daKhop, setDaKhop] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!duDoan;
  const choChay = !duDoan || daDoan !== null;

  useEffect(() => {
    if (!dangChay) return;
    const t = setTimeout(() => {
      setZ((cu) => {
        const moi = cu.map((v, i) => tron(v + Math.max(-0.12, Math.min(0.12, dich[i] - v))));
        if (moi.every((v, i) => Math.abs(v - dich[i]) < 0.02)) {
          setDangChay(false);
          setDaKhop(true);
          return dich;
        }
        return moi;
      });
    }, 60);
    return () => clearTimeout(t);
  }, [dangChay, z]);

  const q = softmax([z[0], z[1], 0]);
  const Hp = -tong(p.map((v) => xlogy(v, v)));
  const CE = -tong(p.map((v, i) => xlogy(v, q[i])));
  const KL = CE - Hp;

  const cao = (v: number) => tron(v * (H - 2 * PAD));
  const rong = (W - 2 * PAD) / 3;

  return (
    <figure className="viz">
      {duDoan && <DuDoan q={duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daKhop} />}
      <div className="viz-dieu-khien">
        <label>
          Logit lớp 1 = <b>{z[0].toFixed(2)}</b>
          <input disabled={khoaThamSo || dangChay} type="range" min={-4} max={4} step={0.1} value={z[0]}
            onChange={(e) => { setZ([+e.target.value, z[1]]); setDaKhop(true); }} />
        </label>
        <label>
          Logit lớp 2 = <b>{z[1].toFixed(2)}</b>
          <input disabled={khoaThamSo || dangChay} type="range" min={-4} max={4} step={0.1} value={z[1]}
            onChange={(e) => { setZ([z[0], +e.target.value]); setDaKhop(true); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cột so sánh phân phối thật p và phân phối dự đoán q">
        <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} className="truc" />
        {p.map((v, i) => {
          const x0 = PAD + i * rong;
          return (
            <g key={i}>
              <rect x={tron(x0 + rong * 0.12)} y={H - PAD - cao(v)} width={tron(rong * 0.32)} height={cao(v)} className="vung-duong" />
              <rect x={tron(x0 + rong * 0.52)} y={H - PAD - cao(q[i])} width={tron(rong * 0.32)} height={cao(q[i])} className="vung-am" />
              <text x={tron(x0 + rong * 0.28)} y={H - PAD - cao(v) - 6} textAnchor="middle" className="nhan">{v.toFixed(2)}</text>
              <text x={tron(x0 + rong * 0.68)} y={H - PAD - cao(q[i]) - 6} textAnchor="middle" className="nhan">{q[i].toFixed(2)}</text>
              <text x={tron(x0 + rong / 2)} y={H - PAD + 18} textAnchor="middle" className="nhan">{NHAN[i]}</text>
            </g>
          );
        })}
        <rect x={W - PAD - 130} y={PAD - 22} width={12} height={12} className="vung-duong" />
        <text x={W - PAD - 112} y={PAD - 12} className="nhan">p (thật)</text>
        <rect x={W - PAD - 60} y={PAD - 22} width={12} height={12} className="vung-am" />
        <text x={W - PAD - 42} y={PAD - 12} className="nhan">q (đoán)</text>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setDangChay(true)} disabled={!choChay || dangChay}>Kéo q về trùng p</button>
        <button onClick={() => { setDangChay(false); setDaKhop(false); setZ([1.6, -0.4]); }}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        H(p) = <b>{Hp.toFixed(4)}</b> nat (sàn, không phụ thuộc q)
        {' · '}KL(p‖q) = <b>{KL.toFixed(4)}</b>
        {' · '}CE(p, q) = <b>{CE.toFixed(4)}</b>
        <br />
        Kiểm: {Hp.toFixed(4)} + {KL.toFixed(4)} = <b>{(Hp + KL).toFixed(4)}</b> = CE.
        {' '}Hạ CE hết mức chỉ đưa KL về 0, CE vẫn dừng ở H(p).
      </figcaption>
    </figure>
  );
}
