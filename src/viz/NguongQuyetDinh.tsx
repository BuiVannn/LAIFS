import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Hai bộ dữ liệu cố định (không sinh ngẫu nhiên: SSR và trình duyệt phải ra y hệt nhau).
type Bo = { ten: string; diem: number[]; that: number[]; ghi_chu: string };

const BO: Record<string, Bo> = {
  mau10: {
    ten: '10 thư — khớp bảng tính tay',
    diem: [0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
    that: [1, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    ghi_chu: '4 spam / 6 thư thường',
  },
  lechLop: {
    ten: '100 giao dịch — lệch lớp 5%',
    diem: [
      0.733, 0.694, 0.605, 0.597, 0.537, 0.532, 0.454, 0.384, 0.369, 0.343, 0.337, 0.318, 0.317, 0.317, 0.313, 0.305,
      0.3, 0.299, 0.285, 0.285, 0.282, 0.279, 0.274, 0.272, 0.266, 0.263, 0.259, 0.257, 0.256, 0.251, 0.245, 0.238,
      0.235, 0.218, 0.215, 0.213, 0.209, 0.2, 0.195, 0.19, 0.181, 0.181, 0.179, 0.175, 0.175, 0.174, 0.172, 0.172,
      0.17, 0.17, 0.169, 0.167, 0.165, 0.163, 0.162, 0.16, 0.159, 0.157, 0.157, 0.155, 0.155, 0.154, 0.153, 0.149,
      0.147, 0.135, 0.129, 0.128, 0.128, 0.119, 0.118, 0.112, 0.111, 0.111, 0.11, 0.101, 0.101, 0.101, 0.1, 0.098,
      0.092, 0.091, 0.086, 0.085, 0.083, 0.074, 0.073, 0.068, 0.06, 0.049, 0.047, 0.044, 0.04, 0.033, 0.032, 0.028,
      0.024, 0.023, 0.022, 0.016,
    ],
    that: [
      1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    ghi_chu: '5 gian lận / 95 giao dịch thường',
  },
};

const W = 600;
const H = 150;
const PAD = 34;

type Props = { bo?: keyof typeof BO; nguong?: number; duDoan?: DuDoanCauHoi };

export default function NguongQuyetDinh(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof BO>(props.bo ?? 'mau10');
  const bo = BO[khoa];
  const [nguong, setNguong] = useState(props.nguong ?? 0.5);
  const [daChay, setDaChay] = useState(!props.duDoan);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;

  const m = useMemo(() => {
    let tp = 0,
      fp = 0,
      fn = 0,
      tn = 0;
    bo.diem.forEach((s, i) => {
      const duong = s >= nguong;
      if (bo.that[i] === 1) duong ? tp++ : fn++;
      else duong ? fp++ : tn++;
    });
    const n = tp + fp + fn + tn;
    const p = tp + fp > 0 ? tp / (tp + fp) : null;
    const r = tp + fn > 0 ? tp / (tp + fn) : null;
    const f1 = p !== null && r !== null && p + r > 0 ? (2 * p * r) / (p + r) : 0;
    return { tp, fp, fn, tn, acc: (tp + tn) / n, p, r, f1 };
  }, [khoa, nguong]);

  // Làm tròn toạ độ để SSR và trình duyệt không lệch nhau ở chữ số cuối
  const tron = (x: number) => Math.round(x * 100) / 100;
  const sx = (v: number) => tron(PAD + v * (W - 2 * PAD));
  const soPhan = (x: number | null) => (x === null ? '—' : x.toFixed(4));

  const chonBo = (k: keyof typeof BO) => {
    setKhoa(k);
    setNguong(0.5);
  };

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Bộ dữ liệu
          <select disabled={khoaThamSo} value={khoa} onChange={(e) => chonBo(e.target.value as keyof typeof BO)}>
            {Object.entries(BO).map(([k, b]) => (
              <option key={k} value={k}>
                {b.ten}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ngưỡng t = <b>{nguong.toFixed(2)}</b>
          <input
            disabled={khoaThamSo}
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={nguong}
            onChange={(e) => setNguong(+e.target.value)}
          />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Điểm số của ${bo.diem.length} mẫu và ngưỡng quyết định ${nguong.toFixed(2)}`}>
        <line x1={PAD} x2={W - PAD} y1={H - 30} y2={H - 30} className="truc" />
        <text x={PAD} y={H - 12} className="nhan">0</text>
        <text x={W - PAD} y={H - 12} textAnchor="end" className="nhan">1 — điểm mô hình</text>
        <text x={PAD} y={34} className="nhan">thật = 1</text>
        <text x={PAD} y={76} className="nhan">thật = 0</text>
        <rect x={sx(nguong)} y={16} width={Math.max(0, W - PAD - sx(nguong))} height={H - 46} className="vung-duong" />
        <line x1={sx(nguong)} x2={sx(nguong)} y1={10} y2={H - 26} style={{ stroke: 'var(--chu)', strokeWidth: 2 }} />
        <text x={sx(nguong)} y={H - 12} textAnchor="middle" className="nhan">t</text>
        {bo.diem.map((s, i) => (
          <circle
            key={i}
            cx={sx(s)}
            cy={bo.that[i] === 1 ? 42 : 66}
            r={4}
            style={{ fill: bo.that[i] === 1 ? 'var(--sai)' : 'var(--nhan)', opacity: 0.75 }}
          />
        ))}
      </svg>

      {!daChay ? (
        <div className="viz-dieu-khien">
          <button onClick={() => setDaChay(true)}>Xem kết quả tại ngưỡng này</button>
        </div>
      ) : (
        <>
          <table>
            <caption>Ma trận nhầm lẫn tại t = {nguong.toFixed(2)} ({bo.ghi_chu})</caption>
            <thead>
              <tr>
                <th></th>
                <th>Dự đoán 1</th>
                <th>Dự đoán 0</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Thật 1</th>
                <td>TP = {m.tp}</td>
                <td>FN = {m.fn}</td>
              </tr>
              <tr>
                <th>Thật 0</th>
                <td>FP = {m.fp}</td>
                <td>TN = {m.tn}</td>
              </tr>
            </tbody>
          </table>
          <figcaption aria-live="polite">
            Accuracy = <b>{m.acc.toFixed(4)}</b> · Precision = <b>{soPhan(m.p)}</b> · Recall = <b>{soPhan(m.r)}</b> ·
            F1 = <b>{m.f1.toFixed(4)}</b>
            {m.p === null && <> — chưa dự đoán mẫu nào là 1 nên precision không có mẫu số.</>}
          </figcaption>
        </>
      )}
    </figure>
  );
}
