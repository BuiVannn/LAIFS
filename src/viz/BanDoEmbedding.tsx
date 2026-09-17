import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Toạ độ ĐẶT BẰNG TAY để minh hoạ, không phải embedding học từ dữ liệu thật.
// Embedding thật có hàng trăm chiều; ở đây chỉ 2 chiều để vẽ được lên giấy.
// Bốn từ "vua / hoàng hậu / đàn ông / đàn bà" được đặt thành hình bình hành
// nên phép vua − đàn ông + đàn bà ra đúng hoàng hậu.
const TU: Record<string, [number, number]> = {
  vua: [4.4, 2.2],
  'hoàng hậu': [3.6, 3.8],
  'đàn ông': [3.0, 1.0],
  'đàn bà': [2.2, 2.6],
  'con trai': [2.4, 0.6],
  'con gái': [1.6, 2.2],
  mèo: [-1.2, 3.4],
  chó: [-1.6, 3.2],
  chim: [-2.2, 3.0],
  cá: [-2.6, 2.6],
  ngựa: [-0.8, 3.6],
  cơm: [-3.4, 1.0],
  phở: [-3.6, 0.6],
  'bánh mì': [-3.2, 1.4],
  'cà phê': [-3.5, -0.2],
  nước: [-3.3, -0.8],
  đi: [-2.0, -2.8],
  chạy: [-2.4, -2.4],
  bay: [-1.6, -3.0],
  bơi: [-2.6, -2.0],
  một: [1.4, -3.2],
  hai: [1.8, -3.0],
  ba: [2.2, -2.8],
  mười: [2.6, -2.4],
};

const TEN = Object.keys(TU);

function cosin(a: [number, number], b: [number, number]) {
  const t = a[0] * b[0] + a[1] * b[1];
  return t / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]));
}

const W = 600, H = 420, PAD = 34;
const XMIN = -4.6, XMAX = 5.4, YMIN = -4.2, YMAX = 4.6;
const RONG_CHU = 7.6, DEM = 12, CAO = 22;

const tron = (v: number) => Math.round(v * 100) / 100;
const sx = (v: number) => tron(PAD + ((v - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD));
const sy = (v: number) => tron(H - PAD - ((v - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD));

// cosin càng cao càng "gần nghĩa" → tô đậm dần
function mau(c: number) {
  if (c >= 0.99) return ' vung';
  if (c >= 0.9) return ' hieu';
  if (c >= 0.5) return ' da-thu';
  return ' chua-co';
}

type Props = {
  tam?: string; // kịch bản: từ được chọn sẵn sau khi đoán
  duDoan?: DuDoanCauHoi;
};

export default function BanDoEmbedding(props: Props) {
  const [chon, setChon] = useState<string | null>(props.duDoan ? null : 'vua');
  const { daDoan, setDaDoan } = useDuDoan();
  const tam = props.tam ?? 'vua';

  const xepHang = useMemo(() => {
    if (!chon) return [];
    return TEN.filter((t) => t !== chon)
      .map((t) => ({ t, c: cosin(TU[chon], TU[t]) }))
      .sort((a, b) => b.c - a.c);
  }, [chon]);

  const bang = useMemo(() => Object.fromEntries(xepHang.map((x) => [x.t, x.c])), [xepHang]);
  const gan = xepHang.slice(0, 3);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={chon !== null} />}

      <div className="viz-dieu-khien">
        {props.duDoan ? (
          <button onClick={() => setChon(tam)} disabled={daDoan === null || chon !== null}>
            Xếp hạng quanh từ «{tam}»
          </button>
        ) : (
          <label>
            Từ trung tâm
            <select value={chon ?? ''} onChange={(e) => setChon(e.target.value)}>
              {TEN.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        )}
        {chon && <button onClick={() => setChon(props.duDoan ? null : 'vua')}>Đặt lại</button>}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bản đồ 2 chiều của 24 từ tiếng Việt, tô màu theo độ tương đồng cosin với từ đang chọn">
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">chiều 1</text>
        <text x={sx(0) + 6} y={PAD} className="nhan">chiều 2</text>
        {chon && (
          <>
            <line x1={sx(0)} y1={sy(0)} x2={sx(TU[chon][0])} y2={sy(TU[chon][1])} className="tiep-tuyen" />
            {gan.map((g) => (
              <line key={g.t} x1={sx(0)} y1={sy(0)} x2={sx(TU[g.t][0])} y2={sy(TU[g.t][1])} className="duong-di" />
            ))}
          </>
        )}
        {TEN.map((t) => {
          const w = Math.round([...t].length * RONG_CHU + DEM);
          const x = sx(TU[t][0]) - w / 2, y = sy(TU[t][1]) - CAO / 2;
          const lop = t === chon ? ' muc-tieu' : chon ? mau(bang[t]) : '';
          return (
            <g key={t} className={'nut-kn' + lop} role="button" tabIndex={0} aria-label={t}
               onClick={() => setChon(t)} onKeyDown={(e) => e.key === 'Enter' && setChon(t)}>
              <rect x={tron(x)} y={tron(y)} width={w} height={CAO} rx={6} />
              <text x={tron(x + w / 2)} y={tron(y + 15)} textAnchor="middle">{t}</text>
            </g>
          );
        })}
      </svg>

      <figcaption aria-live="polite">
        {chon ? (
          <>
            Gần «{chon}» nhất: {gan.map((g, i) => (
              <span key={g.t}>{i > 0 && ' · '}<b>{g.t}</b> = {g.c.toFixed(3)}</span>
            ))}
            <br />
            Xa nhất: <b>{xepHang[xepHang.length - 1].t}</b> = {xepHang[xepHang.length - 1].c.toFixed(3)} ·
            {' '}cosin chỉ nhìn <b>góc</b> giữa hai vector, không nhìn độ dài. Bấm vào một từ khác để đổi trung tâm.
          </>
        ) : (
          <>Toạ độ do người soạn đặt tay để minh hoạ. Chọn dự đoán rồi bấm nút để xem thứ hạng.</>
        )}
      </figcaption>
    </figure>
  );
}
