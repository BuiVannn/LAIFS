import { useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Heatmap trọng số chú ý: nguồn "con mèo đen" (tiếng Việt) → đích "the black cat" (tiếng Anh).
// Trọng số KHÔNG dựng sẵn: mỗi bước component tính điểm e_j = h_j · s_t rồi softmax.

const NGUON = ['con', 'mèo', 'đen'];
const DICH = ['the', 'black', 'cat'];

// Trạng thái mã hoá h_j (giả sử mạng đã học xong) và trạng thái giải mã s_t ở mỗi bước
const H: [number, number][] = [[2, 0], [0, 2], [-1.5, -1.5]];
const S: [number, number][] = [[1.5, 0], [-1, -1], [0, 1.5]];

const W = 620, HH = 340;
const X0 = 150, O_W = 110, Y0 = 62, O_H = 58; // lưới: cột nguồn × hàng đích
const XC = X0 + NGUON.length * O_W + 10;      // cột hiển thị vector ngữ cảnh

function softmax(diem: number[]): number[] {
  const m = Math.max(...diem);
  const e = diem.map((v) => Math.exp((v - m)));
  const tong = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / tong);
}

function buocChuY(t: number, tau: number) {
  const s = S[t];
  const diem = H.map((h) => h[0] * s[0] + h[1] * s[1]);
  const alpha = softmax(diem.map((v) => v / tau));
  const c: [number, number] = [
    alpha.reduce((a, w, j) => a + w * H[j][0], 0),
    alpha.reduce((a, w, j) => a + w * H[j][1], 0),
  ];
  return { s, diem, alpha, c };
}

type Props = {
  tau?: number;
  duDoan?: DuDoanCauHoi;
};

export default function HeatmapChuY(props: Props) {
  const [tau, setTau] = useState(props.tau ?? 1);
  const [buoc, setBuoc] = useState(0); // số từ đích đã sinh
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaThamSo = !!props.duDoan;
  const choChay = !props.duDoan || daDoan !== null;
  const daChay = buoc >= DICH.length;

  const hang = Array.from({ length: buoc }, (_, t) => buocChuY(t, tau));
  const htai = buoc > 0 ? hang[buoc - 1] : null;
  const so = (v: number) => (Math.abs(v) < 5e-5 ? 0 : v).toFixed(4);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daChay} />}
      <div className="viz-dieu-khien">
        <label>
          Nhiệt độ τ của softmax = <b>{tau}</b>
          <input disabled={khoaThamSo} type="range" min={0.3} max={4} step={0.1} value={tau}
            onChange={(e) => { setTau(+e.target.value); setBuoc(0); }} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${HH}`} role="img"
        aria-label="Ma trận trọng số chú ý giữa các từ nguồn tiếng Việt và các từ đích tiếng Anh">
        <text x={10} y={20} fill="var(--chu)" fontSize={13} fontWeight={600}>Nguồn (tiếng Việt) →</text>
        <text x={10} y={38} className="nhan">Đích (tiếng Anh) ↓</text>

        {NGUON.map((tu, j) => (
          <text key={'n' + j} x={X0 + j * O_W + O_W / 2} y={Y0 - 10} textAnchor="middle"
            fill="var(--chu)" fontSize={15} fontWeight={600}>{tu}</text>
        ))}
        <text x={XC + 50} y={Y0 - 10} textAnchor="middle" className="nhan">vector ngữ cảnh c₍t₎</text>

        {DICH.map((tu, t) => {
          const y = Y0 + t * O_H;
          const r = hang[t];
          return (
            <g key={'h' + t}>
              <text x={X0 - 12} y={y + O_H / 2 + 5} textAnchor="end"
                fill={r ? 'var(--chu)' : 'var(--chu-mo)'} fontSize={15} fontWeight={600}>{tu}</text>
              {NGUON.map((_, j) => {
                const a = r ? r.alpha[j] : 0;
                return (
                  <g key={j}>
                    <rect x={X0 + j * O_W} y={y} width={O_W - 4} height={O_H - 4} rx={4}
                      fill="var(--nhan)" fillOpacity={r ? Math.round(a * 1000) / 1000 : 0}
                      stroke="var(--vien)" strokeWidth={1} />
                    {r && (
                      <text x={X0 + j * O_W + (O_W - 4) / 2} y={y + O_H / 2 + 5} textAnchor="middle"
                        fill={a > 0.55 ? 'var(--tren-nhan)' : 'var(--chu)'} fontSize={14} fontWeight={600}>
                        {a.toFixed(3)}
                      </text>
                    )}
                  </g>
                );
              })}
              {r && (
                <text x={XC + 50} y={y + O_H / 2 + 5} textAnchor="middle" fill="var(--nhan)" fontSize={12.5}>
                  ({so(r.c[0])}, {so(r.c[1])})
                </text>
              )}
            </g>
          );
        })}

        <text x={10} y={HH - 34} className="nhan">
          Ô càng đậm, trọng số càng lớn. Mỗi hàng là một phân bố: tổng các ô trong hàng = 1.
        </text>
        <text x={10} y={HH - 14} className="nhan">
          Ma trận trọng số có shape (số từ đích, số từ nguồn) = ({DICH.length}, {NGUON.length}).
        </text>
      </svg>

      <div className="viz-dieu-khien">
        <button onClick={() => setBuoc(buoc + 1)} disabled={!choChay || daChay}>Sinh từ đích tiếp theo</button>
        <button onClick={() => setBuoc(DICH.length)} disabled={!choChay || daChay}>Sinh hết câu</button>
        <button onClick={() => setBuoc(0)}>Đặt lại</button>
      </div>

      <figcaption aria-live="polite">
        {htai ? (
          <>
            Bước <b>{buoc}</b>/{DICH.length} — đang sinh <b>{DICH[buoc - 1]}</b>, trạng thái giải mã s = ({htai.s[0]}, {htai.s[1]}).
            <br />
            Điểm e₍j₎ = h₍j₎ · s = [{htai.diem.map((v) => v.toFixed(2)).join(', ')}]
            {tau !== 1 && <> , chia cho τ = {tau} thành [{htai.diem.map((v) => (v / tau).toFixed(2)).join(', ')}]</>}
            <br />
            softmax → α = [{htai.alpha.map((v) => v.toFixed(4)).join(', ')}], tổng = <b>{htai.alpha.reduce((a, b) => a + b, 0).toFixed(4)}</b>
            <br />
            c = {htai.alpha.map((v, j) => `${v.toFixed(3)}·h_${NGUON[j]}`).join(' + ')} = ({so(htai.c[0])}, {so(htai.c[1])})
          </>
        ) : (
          <>Bấm "Sinh từ đích tiếp theo" để mô hình sinh từng từ tiếng Anh và tính trọng số chú ý của bước đó.</>
        )}
      </figcaption>
    </figure>
  );
}
