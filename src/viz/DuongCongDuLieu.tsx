import { useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Số đo THẬT, đọc từ Figure 3 của Koehn & Knowles 2017, "Six Challenges for Neural Machine
// Translation" (arXiv:1706.03872): hệ Anh→Tây Ban Nha huấn luyện trên 1/1024, 1/512, ..., 1
// của kho 385.7 triệu từ tiếng Anh. Ba hệ thống, cùng dữ liệu, chấm bằng BLEU.
const TONG_TU = 385.7e6;
const CO: number[] = [];
for (let k = 10; k >= 0; k--) CO.push(TONG_TU / 2 ** k);

type He = { ten: string; bleu: number[]; lop: string };
const HE: He[] = [
  { ten: 'NMT (mạng neuron)', bleu: [1.6, 7.2, 11.9, 14.7, 18.2, 22.4, 25.7, 27.4, 29.2, 30.3, 31.1], lop: 'duong-cong' },
  { ten: 'SMT (thống kê cụm từ)', bleu: [16.4, 18.1, 19.6, 21.2, 22.2, 23.5, 24.7, 26.1, 26.9, 27.8, 28.4], lop: 'tiep-tuyen' },
  { ten: 'SMT + mô hình ngôn ngữ lớn (2 tỉ từ đơn ngữ)', bleu: [21.8, 23.4, 24.9, 26.2, 26.9, 27.9, 28.6, 29.2, 29.6, 30.1, 30.4], lop: 'duong-di' },
];

const W = 600, H = 340, PAD = 44;
const MX: [number, number] = [5.5, 8.65]; // log10 số từ
const MY: [number, number] = [0, 34];

type Props = {
  // Chỉ số kho dữ liệu khởi đầu (0 = nhỏ nhất ≈ 0.38 triệu từ, 10 = đủ 385.7 triệu từ)
  i0?: number;
  // Có duDoan: khoá thanh trượt, phải đoán trước rồi mới được kéo
  duDoan?: DuDoanCauHoi;
};

const trieu = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(n < 1e7 ? 1 : 0)} triệu` : `${Math.round(n / 1e3)} nghìn`);

export default function DuongCongDuLieu(props: Props) {
  const [i, setI] = useState(props.i0 ?? 0);
  const [daKeo, setDaKeo] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'dcdl' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoa = !!props.duDoan && daDoan === null;

  // Làm tròn toạ độ để SSR và trình duyệt khớp nhau (tránh lệch hydration)
  const tron = (v: number) => Math.round(v * 100) / 100;
  const sx = (logTu: number) => tron(PAD + ((logTu - MX[0]) / (MX[1] - MX[0])) * (W - 2 * PAD));
  const sy = (b: number) => tron(H - PAD - ((b - MY[0]) / (MY[1] - MY[0])) * (H - 2 * PAD));
  const lx = (k: number) => sx(Math.log10(CO[k]));

  const doi = (v: number) => {
    setI(v);
    setDaKeo(true);
  };

  // Lợi ích của việc gấp đôi dữ liệu kể từ mốc đang chọn
  const loiIch = (h: He) => (i < CO.length - 1 ? h.bleu[i + 1] - h.bleu[i] : null);

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daKeo} />}
      <div className="viz-dieu-khien">
        <label>
          Kho song ngữ = <b>{trieu(CO[i])} từ</b> ({i === 10 ? 'toàn bộ' : `1/${2 ** (10 - i)}`} kho)
          <input
            disabled={khoa}
            type="range"
            min={0}
            max={CO.length - 1}
            step={1}
            value={i}
            onChange={(e) => doi(+e.target.value)}
          />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Đường cong lượng dữ liệu song ngữ so với điểm BLEU của ba hệ dịch máy">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD} y={PAD - 14} width={W - 2 * PAD} height={H - 2 * PAD + 14} />
          </clipPath>
        </defs>

        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <line x1={PAD} x2={PAD} y1={PAD - 14} y2={sy(0)} className="truc" />
        {[0, 10, 20, 30].map((b) => (
          <text key={b} x={PAD - 8} y={sy(b) + 4} textAnchor="end" className="nhan">{b}</text>
        ))}
        {[0, 3, 6, 10].map((k) => (
          <text key={k} x={lx(k)} y={sy(0) + 18} textAnchor="middle" className="nhan">{trieu(CO[k])}</text>
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" className="nhan">Số từ tiếng Anh trong kho song ngữ (thang log)</text>
        <text x={PAD - 8} y={PAD - 20} textAnchor="start" className="nhan">BLEU</text>

        <g clipPath={`url(#${clipId})`}>
          <rect x={PAD} y={PAD - 14} width={lx(6) - PAD} height={sy(0) - PAD + 14} className="vung-am" />
          {HE.map((h) => (
            <polyline
              key={h.ten}
              className={h.lop}
              points={h.bleu.map((b, k) => `${lx(k)},${sy(b)}`).join(' ')}
            />
          ))}
          <line x1={lx(i)} x2={lx(i)} y1={PAD - 14} y2={sy(0)} className="truc" />
          {HE.map((h) => (
            <circle key={h.ten} cx={lx(i)} cy={sy(h.bleu[i])} r={5} className="diem-hien-tai" />
          ))}
        </g>
      </svg>

      <div className="chu-giai">
        <span>■ vùng tô đỏ: dưới ~24 triệu từ — trong thí nghiệm này NMT vẫn thua hệ thống kê cũ</span>
      </div>

      <figcaption aria-live="polite">
        Với <b>{trieu(CO[i])} từ</b> song ngữ:
        <br />
        {HE.map((h) => {
          const g = loiIch(h);
          return (
            <span key={h.ten}>
              {h.ten}: <b>{h.bleu[i].toFixed(1)}</b> BLEU
              {g !== null && <> — gấp đôi dữ liệu chỉ thêm <b>{g >= 0 ? '+' : ''}{g.toFixed(1)}</b></>}
              <br />
            </span>
          );
        })}
        <span className="mo">
          Số thật, đọc từ Figure 3 của Koehn &amp; Knowles 2017 (arXiv:1706.03872), cặp Anh→Tây Ban Nha,
          hệ thống của năm 2017. Đây <b>không</b> phải số đo cho tiếng Việt hay tiếng dân tộc thiểu số, và
          mô hình đa ngữ ngày nay bắt đầu từ mức cao hơn nhiều ở vùng ít dữ liệu. Hình dạng chung — dốc
          đứng lúc đầu rồi thoải dần — mới là điều cần nhớ.
        </span>
      </figcaption>
    </figure>
  );
}
