import { useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// f(x, y) = a·x² + b·y²: đường đồng mức là các elip, gradient = (2a·x, 2b·y)
type Ham = { ten: string; a: number; b: number };
const HAM: Record<string, Ham> = {
  tron: { ten: 'f(x, y) = x² + y²', a: 1, b: 1 },
  elip: { ten: 'f(x, y) = x² + 3y²', a: 1, b: 3 },
};

const W = 600, H = 400, PAD = 20;
const MIEN = 3; // vẽ x, y trong [−3, 3]
const MUC = [1, 2, 4, 7, 11, 16];
const TI_LE = 0.15; // mũi tên dài 0.15 × |∇f| cho vừa khung

type Props = {
  ham?: keyof typeof HAM;
  x?: number;
  y?: number;
  duDoan?: DuDoanCauHoi;
};

export default function GradientDuongDongMuc(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof HAM>(props.ham ?? 'elip');
  const ham = HAM[khoa];
  const [px, setPx] = useState(props.x ?? 2);
  const [py, setPy] = useState(props.y ?? 1);
  const [hien, setHien] = useState(!props.duDoan);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'gdm' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoaThamSo = !!props.duDoan;
  const choHien = !props.duDoan || daDoan !== null;

  const tron = (v: number) => Math.round(v * 100) / 100;
  // Giữ tỉ lệ 1:1 giữa hai trục để thấy đúng góc của gradient
  const donVi = (H - 2 * PAD) / (2 * MIEN);
  const sx = (v: number) => tron(W / 2 + v * donVi);
  const sy = (v: number) => tron(H / 2 - v * donVi);

  const gx = 2 * ham.a * px;
  const gy = 2 * ham.b * py;
  const doLon = Math.hypot(gx, gy);

  const muiTen = (dx: number, dy: number, cls: string) => {
    const ex = px + dx * TI_LE, ey = py + dy * TI_LE;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const c = 0.18; // cạnh đầu mũi tên (đơn vị toạ độ)
    const p1 = `${sx(ex - c * ux + c * 0.5 * uy)},${sy(ey - c * uy - c * 0.5 * ux)}`;
    const p2 = `${sx(ex - c * ux - c * 0.5 * uy)},${sy(ey - c * uy + c * 0.5 * ux)}`;
    return (
      <>
        <line x1={sx(px)} y1={sy(py)} x2={sx(ex)} y2={sy(ey)} className={cls} />
        <polyline points={`${p1} ${sx(ex)},${sy(ey)} ${p2}`} fill="none" className={cls} />
      </>
    );
  };

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={hien} />}
      <div className="viz-dieu-khien">
        <label>
          Hàm
          <select disabled={khoaThamSo} value={khoa} onChange={(e) => setKhoa(e.target.value as keyof typeof HAM)}>
            {Object.entries(HAM).map(([k, v]) => (
              <option key={k} value={k}>{v.ten}</option>
            ))}
          </select>
        </label>
        <label>
          x = <b>{px}</b>
          <input disabled={khoaThamSo} type="range" min={-2.5} max={2.5} step={0.1} value={px} onChange={(e) => setPx(+e.target.value)} />
        </label>
        <label>
          y = <b>{py}</b>
          <input disabled={khoaThamSo} type="range" min={-2.5} max={2.5} step={0.1} value={py} onChange={(e) => setPy(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Đường đồng mức của ${ham.ten} và mũi tên gradient tại điểm đang chọn`}>
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x</text>
        <text x={sx(0) + 6} y={PAD + 12} className="nhan">y</text>
        <g clipPath={`url(#${clipId})`}>
          {MUC.map((c) => (
            <ellipse key={c} cx={sx(0)} cy={sy(0)} rx={tron(Math.sqrt(c / ham.a) * donVi)} ry={tron(Math.sqrt(c / ham.b) * donVi)} className="duong-cong" />
          ))}
          {hien && doLon > 0 && muiTen(gx, gy, 'duong-di')}
          {hien && doLon > 0 && muiTen(-gx, -gy, 'tiep-tuyen')}
          <circle cx={sx(px)} cy={sy(py)} r={7} className="diem-hien-tai" />
        </g>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setHien(true)} disabled={!choHien || hien}>Hiện gradient</button>
      </div>

      <figcaption aria-live="polite">
        Tại ({px}, {py}): f = <b>{tron(ham.a * px * px + ham.b * py * py)}</b>
        {hien && (
          <>
            {' '}· ∇f = (<b>{tron(gx)}</b>, <b>{tron(gy)}</b>) · độ dài |∇f| = <b>{doLon.toFixed(2)}</b>
            <br />
            Mũi tên nét đứt: ∇f, hướng dốc lên nhanh nhất. Mũi tên nét liền: −∇f, hướng gradient descent sẽ đi.
          </>
        )}
      </figcaption>
    </figure>
  );
}
