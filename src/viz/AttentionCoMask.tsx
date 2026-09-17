import { useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Bảng chú ý của một lượt self-attention trên 3 token, d_k = 2.
// Bật/tắt mask nhân quả để xem hàng nào đổi, hàng nào không.
// Mọi con số đều tính từ Q, K, V ngay trong component.

const TOKEN = ['I', 'eat', 'rice'];
const Q = [[1, 0], [0, 1], [1, 1]];
const K = Q;
const V = [[1, 0], [0, 1], [1, 1]];
const D_K = 2;

const n = TOKEN.length;
const CAN = Math.sqrt(D_K);

// Làm tròn trước khi hiện: Node (SSR) và trình duyệt có thể lệch chữ số cuối → lệch hydration
const tron = (v: number, sc = 10000) => Math.round(v * sc) / sc;
const so = (v: number) => tron(v).toFixed(4);

const diem = Q.map((q) => K.map((k) => tron(q.reduce((s, qi, i) => s + qi * k[i], 0) / CAN)));

function trongSo(mask: boolean): number[][] {
  return diem.map((hang, i) => {
    const duoc = hang.map((_, j) => !mask || j <= i);
    const max = Math.max(...hang.filter((_, j) => duoc[j]));
    const e = hang.map((s, j) => (duoc[j] ? Math.exp(s - max) : 0));
    const tong = e.reduce((a, b) => a + b, 0);
    return e.map((x) => x / tong);
  });
}

const W = 560, H = 300, O_X = 130, O_Y = 70, O = 64;

type Props = { duDoan?: DuDoanCauHoi };

export default function AttentionCoMask({ duDoan }: Props) {
  const [mask, setMask] = useState(false);
  const [daBat, setDaBat] = useState(false);
  const [hang, setHang] = useState(2);
  const { daDoan, setDaDoan } = useDuDoan();
  const choChay = !duDoan || daDoan !== null;

  const A = trongSo(mask);
  const ra = A.map((w) => V[0].map((_, c) => w.reduce((s, wj, j) => s + wj * V[j][c], 0)));
  const duoc = (i: number, j: number) => !mask || j <= i;

  const doiMask = (v: boolean) => {
    setMask(v);
    if (v) setDaBat(true);
  };

  return (
    <figure className="viz">
      {duDoan && <DuDoan q={duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daBat} />}
      <div className="viz-dieu-khien">
        <button onClick={() => doiMask(!mask)} disabled={!choChay}>
          {mask ? 'Tắt mask nhân quả' : 'Bật mask nhân quả'}
        </button>
        {TOKEN.map((t, i) => (
          <button key={t} className="phu" onClick={() => setHang(i)} disabled={hang === i}>
            Xem hàng "{t}"
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bảng trọng số chú ý 3×3 giữa ba token I, eat, rice, có thể bật mask nhân quả">
        <text x={O_X} y={28} className="nhan">khoá (key) — token được nhìn</text>
        <text x={10} y={O_Y - 26} className="nhan">truy vấn (query)</text>
        {TOKEN.map((t, j) => (
          <text key={'c' + t} x={O_X + j * O + O / 2} y={O_Y - 8} textAnchor="middle" fill="var(--chu)" fontSize={14} fontWeight={600}>{t}</text>
        ))}
        {TOKEN.map((t, i) => (
          <text key={'r' + t} x={O_X - 10} y={O_Y + i * O + O / 2 + 5} textAnchor="end" fill="var(--chu)" fontSize={14} fontWeight={600}>{t}</text>
        ))}
        {A.map((w, i) =>
          w.map((v, j) => (
            <g key={`${i}-${j}`}>
              <rect
                x={O_X + j * O}
                y={O_Y + i * O}
                width={O}
                height={O}
                fill={duoc(i, j) ? 'var(--nhan)' : 'var(--nen-phu)'}
                fillOpacity={duoc(i, j) ? tron(0.08 + 0.72 * v, 100) : 1}
                stroke={i === hang ? 'var(--nhap)' : 'var(--vien)'}
                strokeWidth={i === hang ? 3 : 1}
              />
              <text x={O_X + j * O + O / 2} y={O_Y + i * O + O / 2 + 5} textAnchor="middle"
                fill={duoc(i, j) ? 'var(--chu)' : 'var(--chu-mo)'} fontSize={13} fontWeight={duoc(i, j) ? 600 : 400}>
                {duoc(i, j) ? v.toFixed(4) : 'che'}
              </text>
            </g>
          )),
        )}
        {A.map((w, i) => (
          <text key={'o' + i} x={O_X + n * O + 14} y={O_Y + i * O + O / 2 + 5} fill="var(--chu-mo)" fontSize={13}>
            → ({so(ra[i][0])}, {so(ra[i][1])})
          </text>
        ))}
        <text x={10} y={H - 12} className="nhan">
          ô đậm = trọng số lớn · hàng cộng lại luôn bằng 1 {mask ? '· mask ĐANG BẬT' : '· mask đang tắt'}
        </text>
      </svg>

      <figcaption aria-live="polite">
        Hàng <b>{TOKEN[hang]}</b>: điểm thô q·kᵀ/√2 = ({diem[hang].map((d) => so(d)).join(', ')}){' '}
        {mask && hang < n - 1 && <>→ che {n - 1 - hang} ô cuối </>}
        → softmax = ({A[hang].map((v, j) => (duoc(hang, j) ? v.toFixed(4) : '0')).join(', ')}) ={' '}
        tổng <b>{A[hang].reduce((a, b) => a + b, 0).toFixed(4)}</b>
        <br />
        Đầu ra = Σ trọng số × v = <b>({so(ra[hang][0])}, {so(ra[hang][1])})</b>
      </figcaption>
    </figure>
  );
}
