import { useEffect, useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

type Diem = [number, number, 0 | 1]; // x1, x2, nhãn

const DU_LIEU: Record<string, { ten: string; diem: Diem[] }> = {
  'tach-duoc': {
    ten: 'Hai cụm tách được',
    diem: [
      [1, 2, 1], [2, 1, 1], [2.5, 2.5, 1], [0.5, 2.5, 1], [2.5, 0, 1], [1.5, 1.5, 1],
      [-1, -2, 0], [-2, -0.5, 0], [-2.5, -2.5, 0], [0, -1.5, 0], [-1.5, 1, 0], [-0.5, 0, 0],
    ],
  },
  xor: {
    ten: 'XOR (chéo nhau)',
    diem: [
      [1.5, 1.5, 1], [2.5, 1, 1], [-1.5, -1.5, 1], [-1, -2.5, 1],
      [-1.5, 1.5, 0], [-2.5, 1, 0], [1.5, -1.5, 0], [1, -2.5, 0],
    ],
  },
};

// Miền vẽ x1 ∈ [-4.5, 4.5], x2 ∈ [-3, 3]: cùng tỉ lệ với khung 600×400 nên góc không bị méo
const W = 600, H = 400, X = 4.5, Y = 3;
const LR = 0.5;
const SO_EPOCH_TOI_DA = 20;

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (v: number) => tron(((v + X) / (2 * X)) * W);
const sy = (v: number) => tron(H - ((v + Y) / (2 * Y)) * H);
const duDoanNhan = (w1: number, w2: number, b: number, x1: number, x2: number) => (w1 * x1 + w2 * x2 + b >= 0 ? 1 : 0);

type Props = {
  du_lieu?: keyof typeof DU_LIEU;
  w1?: number;
  w2?: number;
  b?: number;
  duDoan?: DuDoanCauHoi;
};

export default function Perceptron2D(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof DU_LIEU>(props.du_lieu ?? 'tach-duoc');
  const dau = { w1: props.w1 ?? 1, w2: props.w2 ?? 1, b: props.b ?? 0 };
  const [w, setW] = useState(dau);
  // hoc: đang xét điểm thứ `buoc` (đếm liên tục qua các epoch); capNhat: số lần sửa trong epoch hiện tại
  const [hoc, setHoc] = useState({ buoc: 0, capNhat: 0, epochSach: false, cuoi: '' });
  const [dangChay, setDangChay] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'pc' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;

  const diem = DU_LIEU[khoa].diem;
  const n = diem.length;
  const epoch = Math.floor(hoc.buoc / n);
  const soSai = diem.filter(([a, c, y]) => duDoanNhan(w.w1, w.w2, w.b, a, c) !== y).length;
  const xong = hoc.epochSach || epoch >= SO_EPOCH_TOI_DA;

  const buocHoc = () => {
    const i = hoc.buoc % n;
    const [x1, x2, y] = diem[i];
    const d = y - duDoanNhan(w.w1, w.w2, w.b, x1, x2);
    const moi = { w1: w.w1 + LR * d * x1, w2: w.w2 + LR * d * x2, b: w.b + LR * d };
    const capNhat = hoc.capNhat + (d !== 0 ? 1 : 0);
    const hetEpoch = i === n - 1;
    setW(moi);
    setHoc({
      buoc: hoc.buoc + 1,
      capNhat: hetEpoch ? 0 : capNhat,
      epochSach: hetEpoch && capNhat === 0,
      cuoi: `Điểm (${x1}, ${x2}) nhãn ${y}: ` + (d === 0 ? 'đoán đúng, giữ nguyên.' : `đoán sai, cộng ${LR} × (${d}) × x vào w và b.`),
    });
  };

  const datLai = (k: keyof typeof DU_LIEU = khoa) => {
    setDangChay(false);
    setW(dau);
    setHoc({ buoc: 0, capNhat: 0, epochSach: false, cuoi: '' });
    setKhoa(k);
  };

  useEffect(() => {
    if (!dangChay) return;
    if (xong) return setDangChay(false);
    const t = setTimeout(buocHoc, 80);
    return () => clearTimeout(t);
  }, [dangChay, hoc]);

  // Vùng dự đoán 1: giữ các góc khung có z ≥ 0 và thêm giao điểm trên cạnh nơi z đổi dấu
  const vung = (huong: 1 | -1) => {
    const goc: [number, number][] = [[-X, -Y], [X, -Y], [X, Y], [-X, Y]];
    const z = ([a, c]: [number, number]) => huong * (w.w1 * a + w.w2 * c + w.b);
    const pts: string[] = [];
    goc.forEach((p, i) => {
      const q = goc[(i + 1) % 4];
      if (z(p) >= 0) pts.push(`${sx(p[0])},${sy(p[1])}`);
      if ((z(p) >= 0) !== (z(q) >= 0)) {
        const t = z(p) / (z(p) - z(q));
        pts.push(`${sx(p[0] + t * (q[0] - p[0]))},${sy(p[1] + t * (q[1] - p[1]))}`);
      }
    });
    return pts.join(' ');
  };

  // Đường biên w1·x1 + w2·x2 + b = 0: đi qua điểm gần gốc nhất, hướng vuông góc với (w1, w2)
  const chuan = Math.hypot(w.w1, w.w2);
  const bien = chuan > 1e-9 && (() => {
    const p = [(-w.b * w.w1) / chuan ** 2, (-w.b * w.w2) / chuan ** 2];
    const u = [-w.w2 / chuan, w.w1 / chuan];
    return { x1: sx(p[0] - 20 * u[0]), y1: sy(p[1] - 20 * u[1]), x2: sx(p[0] + 20 * u[0]), y2: sy(p[1] + 20 * u[1]) };
  })();

  const thanhTruot = (ten: 'w1' | 'w2' | 'b', nhan: string) => (
    <label>
      {nhan} = <b>{tron(w[ten])}</b>
      <input
        disabled={khoaThamSo}
        type="range" min={-4} max={4} step={0.25} value={w[ten]}
        onChange={(e) => { setDangChay(false); setHoc({ buoc: 0, capNhat: 0, epochSach: false, cuoi: '' }); setW({ ...w, [ten]: +e.target.value }); }}
      />
    </label>
  );

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={xong} />}
      <div className="viz-dieu-khien">
        <label>
          Dữ liệu
          <select disabled={khoaThamSo} value={khoa} onChange={(e) => datLai(e.target.value as keyof typeof DU_LIEU)}>
            {Object.entries(DU_LIEU).map(([k, d]) => (
              <option key={k} value={k}>{d.ten}</option>
            ))}
          </select>
        </label>
        {thanhTruot('w1', 'w₁')}
        {thanhTruot('w2', 'w₂')}
        {thanhTruot('b', 'b')}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Các điểm dữ liệu hai lớp, đường biên quyết định của perceptron và hai vùng dự đoán">
        <defs>
          <clipPath id={clipId}><rect x={0} y={0} width={W} height={H} /></clipPath>
        </defs>
        <polygon points={vung(1)} className="vung-duong" />
        <polygon points={vung(-1)} className="vung-am" />
        <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} className="truc" />
        <text x={W - 6} y={sy(0) - 6} textAnchor="end" className="nhan">x₁</text>
        <text x={sx(0) + 6} y={14} className="nhan">x₂</text>
        <text x={6} y={14} className="nhan">vòng xanh: nhãn 1 · chấm đỏ: nhãn 0 · vòng nét đứt: đoán sai</text>
        {bien && <line {...bien} className="duong-cong" clipPath={`url(#${clipId})`} />}
        {diem.map(([a, c, y], i) => {
          const sai = duDoanNhan(w.w1, w.w2, w.b, a, c) !== y;
          return (
            <g key={i}>
              {y === 1
                ? <circle cx={sx(a)} cy={sy(c)} r={7} fill="none" className="tiep-tuyen" />
                : <circle cx={sx(a)} cy={sy(c)} r={6} className="diem-hien-tai" />}
              {sai && <circle cx={sx(a)} cy={sy(c)} r={13} fill="none" className="duong-di" />}
            </g>
          );
        })}
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={buocHoc} disabled={!choChay || dangChay || xong}>1 bước học</button>
        <button onClick={() => setDangChay(!dangChay)} disabled={!choChay || xong}>{dangChay ? 'Dừng' : 'Chạy thuật toán học'}</button>
        <button onClick={() => datLai()}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        z = {tron(w.w1)}·x₁ + {tron(w.w2)}·x₂ + {tron(w.b)} · Số điểm sai: <b className={soSai === 0 ? 'ok' : 'canh-bao'}>{soSai}/{n}</b> · Epoch: <b>{epoch}</b> (η = {LR})
        <br />
        {hoc.epochSach
          ? <b className="ok">Hội tụ: trọn một epoch không phải sửa lần nào, thuật toán dừng.</b>
          : epoch >= SO_EPOCH_TOI_DA
            ? <b className="canh-bao">Đã chạy {SO_EPOCH_TOI_DA} epoch mà vẫn phải sửa: thuật toán không tự dừng được.</b>
            : hoc.cuoi || 'Kéo thanh trượt để xoay/dịch đường biên, hoặc cho thuật toán tự học.'}
      </figcaption>
    </figure>
  );
}
