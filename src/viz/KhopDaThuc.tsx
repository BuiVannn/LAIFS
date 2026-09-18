import { useId, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Số liệu sinh sẵn bằng numpy (sự thật f(x) = sin(πx), nhiễu Gauss σ = 0.15, seed cố định)
// rồi dán vào đây, để Node (SSR) và trình duyệt cho ra ĐÚNG cùng một con số.
const VAL_X = [-0.95,-0.9178,-0.8856,-0.8534,-0.8212,-0.789,-0.7568,-0.7246,-0.6924,-0.6602,-0.628,-0.5958,-0.5636,-0.5314,-0.4992,-0.4669,-0.4347,-0.4025,-0.3703,-0.3381,-0.3059,-0.2737,-0.2415,-0.2093,-0.1771,-0.1449,-0.1127,-0.0805,-0.0483,-0.0161,0.0161,0.0483,0.0805,0.1127,0.1449,0.1771,0.2093,0.2415,0.2737,0.3059,0.3381,0.3703,0.4025,0.4347,0.4669,0.4992,0.5314,0.5636,0.5958,0.628,0.6602,0.6924,0.7246,0.7568,0.789,0.8212,0.8534,0.8856,0.9178,0.95];
const VAL_Y = [-0.1107,-0.4114,-0.2391,-0.3034,-0.8253,-0.8107,-0.6727,-0.8087,-0.8253,-1.004,-0.7883,-0.8384,-0.9702,-0.8261,-0.9299,-1.1235,-0.9237,-1.0973,-0.7864,-0.8809,-0.8475,-0.8599,-0.5046,-0.6343,-0.5924,-0.4925,-0.2669,-0.1954,-0.0892,0.0141,0.3718,0.0902,0.1734,0.2246,0.5321,0.6975,0.5941,0.562,0.6341,0.9174,0.9849,0.9996,0.8536,1.0139,1.0121,1.0328,1.1259,1.0136,1.0569,0.9304,0.9194,0.9175,0.5426,0.6439,0.5448,0.4368,0.4032,0.576,0.1255,0.3017];
type Khop = { c: number[]; tr: number; va: number; mx: number };
type Tap = { n: number; x: number[]; y: number[]; khop: Khop[] };
const TAP: Tap[] = [
  { n: 8,
    x: [-0.95,-0.6786,-0.4071,-0.1357,0.1357,0.4071,0.6786,0.95],
    y: [0.2823,-0.839,-0.6557,-0.5916,0.5154,1.1215,0.5603,0.1204],
    khop: [
    { c: [0.0642], tr: 0.42280, va: 0.54129, mx: 0.06 },
    { c: [0.539536,0.0642], tr: 0.31021, va: 0.27272, mx: 0.54 },
    { c: [0.123078,0.539536,0.016595], tr: 0.30848, va: 0.27397, mx: 0.54 },
    { c: [-3.01717,0.123078,2.59572,0.016595], tr: 0.03822, va: 0.02972, mx: 3.02 },
    { c: [0.760653,-3.01717,-0.593416,2.59572,0.093222], tr: 0.03436, va: 0.02843, mx: 3.02 },
    { c: [2.93655,0.760653,-6.44264,-0.593416,3.34092,0.093222], tr: 0.02393, va: 0.03869, mx: 6.44 },
    { c: [11.0601,2.93655,-14.1476,-6.44264,4.1035,3.34092,-0.108936], tr: 0.00472, va: 0.06411, mx: 14.15 },
    { c: [-20.8129,11.0601,33.6929,-14.1476,-18.4331,4.1035,4.40699,-0.108936], tr: 0.00000, va: 0.06786, mx: 33.69 },
    { c: [6.99388,-20.8129,0.239524,33.6929,-9.46418,-18.4331,3.53916,4.40699,-0.100065], tr: 0.00000, va: 0.08101, mx: 33.69 },
    { c: [-14.6172,6.99388,1.80203,0.239524,23.9046,-9.46418,-17.2536,3.53916,4.38845,-0.100065], tr: 0.00000, va: 0.10203, mx: 23.90 },
  ] },
  { n: 20,
    x: [-0.95,-0.85,-0.75,-0.65,-0.55,-0.45,-0.35,-0.25,-0.15,-0.05,0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95],
    y: [-0.2511,-0.3146,-0.702,-0.9984,-0.7244,-1.13,-0.9539,-0.4901,-0.5703,-0.1337,0.0706,0.6309,0.7604,0.7607,0.8951,1.1805,0.9033,0.9314,0.2513,0.3243],
    khop: [
    { c: [0.022], tr: 0.52717, va: 0.53848, mx: 0.02 },
    { c: [0.985101,0.022], tr: 0.20450, va: 0.18464, mx: 0.99 },
    { c: [0.027183,0.985101,0.012962], tr: 0.20443, va: 0.18491, mx: 0.99 },
    { c: [-2.84809,0.027183,2.68399,0.012962], tr: 0.02546, va: 0.01814, mx: 2.85 },
    { c: [-0.141765,-2.84809,0.147379,2.68399,0.001114], tr: 0.02535, va: 0.01847, mx: 2.85 },
    { c: [2.14233,-0.141765,-5.18681,0.147379,3.1746,0.001114], tr: 0.01950, va: 0.01434, mx: 5.19 },
    { c: [-0.131391,2.14233,0.032777,-5.18681,0.090916,3.1746,0.003713], tr: 0.01950, va: 0.01444, mx: 5.19 },
    { c: [4.29909,-0.131391,-4.55351,0.032777,-2.26418,0.090916,2.86399,0.003713], tr: 0.01831, va: 0.01548, mx: 4.55 },
    { c: [7.48407,4.29909,-13.4381,-4.55351,7.31281,-2.26418,-1.15897,2.86399,0.036365], tr: 0.01755, va: 0.01539, mx: 13.44 },
    { c: [37.6816,7.48407,-70.6429,-13.4381,44.4738,7.31281,-13.9579,-1.15897,3.60236,0.036365], tr: 0.01370, va: 0.02020, mx: 70.64 },
  ] },
  { n: 60,
    x: [-0.95,-0.9178,-0.8856,-0.8534,-0.8212,-0.789,-0.7568,-0.7246,-0.6924,-0.6602,-0.628,-0.5958,-0.5636,-0.5314,-0.4992,-0.4669,-0.4347,-0.4025,-0.3703,-0.3381,-0.3059,-0.2737,-0.2415,-0.2093,-0.1771,-0.1449,-0.1127,-0.0805,-0.0483,-0.0161,0.0161,0.0483,0.0805,0.1127,0.1449,0.1771,0.2093,0.2415,0.2737,0.3059,0.3381,0.3703,0.4025,0.4347,0.4669,0.4992,0.5314,0.5636,0.5958,0.628,0.6602,0.6924,0.7246,0.7568,0.789,0.8212,0.8534,0.8856,0.9178,0.95],
    y: [-0.3627,-0.1961,-0.4942,-0.4174,-0.5547,-0.9587,-0.4511,-0.785,-0.7046,-0.8206,-0.827,-0.9756,-0.9591,-0.9796,-0.9137,-0.8384,-0.7283,-0.7153,-1.0612,-0.6882,-0.8773,-0.53,-0.612,-0.7124,-0.2461,-0.3816,-0.3719,-0.105,0.0656,-0.0451,0.0506,0.313,0.1333,0.1216,0.2935,0.3197,0.5544,0.6497,0.7578,0.776,0.7299,1.0204,1.1237,1.1512,0.9213,0.7866,1.2285,0.9609,0.9552,0.6037,1.1074,0.7772,0.6653,0.8377,0.6329,0.4065,0.5422,0.532,0.179,0.1801],
    khop: [
    { c: [0.017733], tr: 0.49206, va: 0.53839, mx: 0.02 },
    { c: [1.04245,0.017733], tr: 0.15405, va: 0.18255, mx: 1.04 },
    { c: [-0.057234,1.04245,0.035535], tr: 0.15380, va: 0.18234, mx: 1.04 },
    { c: [-2.68303,-0.057234,2.54407,0.035535], tr: 0.02054, va: 0.01903, mx: 2.68 },
    { c: [-0.261363,-2.68303,0.151606,2.54407,0.016076], tr: 0.02024, va: 0.01958, mx: 2.68 },
    { c: [1.30578,-0.261363,-4.03458,0.151606,2.81376,0.016076], tr: 0.01850, va: 0.01623, mx: 4.03 },
    { c: [0.55246,1.30578,-0.962501,-4.03458,0.36904,2.81376,0.006448], tr: 0.01842, va: 0.01593, mx: 4.03 },
    { c: [1.27892,0.55246,-0.614777,-0.962501,-3.22335,0.36904,2.73004,0.006448], tr: 0.01833, va: 0.01603, mx: 3.22 },
    { c: [-3.38201,1.27892,6.41371,-0.614777,-4.10078,-3.22335,0.898399,2.73004,-0.007189], tr: 0.01819, va: 0.01663, mx: 6.41 },
    { c: [-11.5674,-3.38201,23.9877,6.41371,-15.3457,-4.10078,0.27557,0.898399,2.50914,-0.007189], tr: 0.01780, va: 0.01691, mx: 23.99 },
  ] },
];

const W = 600, H = 300, PAD = 34;
const H2 = 190, PAD2 = 44;
const YMIN = -1.9, YMAX = 1.9;
const SAN = 0.0225; // sàn nhiễu: σ² = 0.15²  — không mô hình nào xuống dưới mức này trên tập val
const MSE_MIN = 0.002, MSE_MAX = 0.7;

type Props = {
  n?: 8 | 20 | 60;
  bac?: number;
  // Có duDoan: khoá thanh trượt, phải đoán trước rồi mới được kéo
  duDoan?: DuDoanCauHoi;
};

// Làm tròn toạ độ để Node (SSR) và trình duyệt khớp nhau, tránh lệch hydration
const tron = (v: number) => Math.round(v * 100) / 100;
// Horner: c là hệ số giảm dần bậc, giống np.polyval
const polyval = (c: number[], x: number) => c.reduce((acc, h) => acc * x + h, 0);

export default function KhopDaThuc(props: Props) {
  const [n, setN] = useState<number>(props.n ?? 8);
  const [bac, setBac] = useState(props.bac ?? 1);
  const [daKeo, setDaKeo] = useState(false);
  const { daDoan, setDaDoan } = useDuDoan();
  const clipId = 'kdt' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const khoa = !!props.duDoan && daDoan === null;

  const tap = TAP.find((t) => t.n === n) as Tap;
  const k = tap.khop[bac];
  const bacTot = tap.khop.reduce((b, f, i) => (f.va < tap.khop[b].va ? i : b), 0);

  const sx = (x: number) => tron(PAD + ((x + 1) / 2) * (W - 2 * PAD));
  const sy = (y: number) => tron(H - PAD - ((y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD));
  // Trục MSE theo thang log (train có thể đúng bằng 0 → kẹp về đáy)
  const lg = (v: number) => Math.log10(Math.max(v, MSE_MIN));
  const sy2 = (v: number) =>
    tron(H2 - PAD2 - ((lg(v) - lg(MSE_MIN)) / (lg(MSE_MAX) - lg(MSE_MIN))) * (H2 - 2 * PAD2));
  const sx2 = (d: number) => tron(PAD2 + (d / 9) * (W - 2 * PAD2));

  const doi = (f: () => void) => { f(); setDaKeo(true); };

  const duongThat = Array.from({ length: 121 }, (_, i) => {
    const x = -1 + (2 * i) / 120;
    return `${sx(x)},${sy(Math.sin(Math.PI * x))}`;
  }).join(' ');
  const duongKhop = Array.from({ length: 241 }, (_, i) => {
    const x = -1 + (2 * i) / 240;
    return `${sx(x)},${sy(polyval(k.c, x))}`;
  }).join(' ');

  const chan = bac === bacTot ? 'vừa khéo' : bac < bacTot ? 'chưa khớp (underfitting)' : 'quá khớp (overfitting)';

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daKeo} />}
      <div className="viz-dieu-khien">
        <label>
          Bậc đa thức = <b>{bac}</b> ({bac + 1} tham số)
          <input disabled={khoa} type="range" min={0} max={9} step={1} value={bac}
            onChange={(e) => doi(() => setBac(+e.target.value))} />
        </label>
        <label>
          Số điểm huấn luyện
          <select disabled={khoa} value={n} onChange={(e) => doi(() => setN(+e.target.value))}>
            {TAP.map((t) => <option key={t.n} value={t.n}>{t.n} điểm</option>)}
          </select>
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Đa thức bậc ${bac} khớp ${n} điểm huấn luyện quanh đường sin`}>
        <defs>
          <clipPath id={clipId}><rect x={PAD} y={0} width={W - 2 * PAD} height={H} /></clipPath>
        </defs>
        <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="truc" />
        <text x={W - PAD} y={sy(0) - 6} textAnchor="end" className="nhan">x</text>
        <g clipPath={`url(#${clipId})`}>
          <polyline points={duongThat} className="tiep-tuyen" />
          <polyline points={duongKhop} className="duong-cong" />
          {VAL_X.map((x, i) => (
            <circle key={'v' + i} cx={sx(x)} cy={sy(VAL_Y[i])} r={2.5} className="diem-cu" />
          ))}
          {tap.x.map((x, i) => (
            <circle key={'t' + i} cx={sx(x)} cy={sy(tap.y[i])} r={4} className="diem-hien-tai" />
          ))}
        </g>
      </svg>
      <div className="chu-giai">
        <span>— xanh: sự thật f(x) = sin(πx)</span>
        <span>— đậm: đa thức vừa khớp</span>
        <span>● to: {n} điểm huấn luyện</span>
        <span>· nhỏ mờ: 60 điểm validation</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H2}`} role="img" aria-label="Sai số huấn luyện và validation theo bậc đa thức">
        <line x1={PAD2} x2={W - PAD2} y1={sy2(MSE_MIN)} y2={sy2(MSE_MIN)} className="truc" />
        <line x1={PAD2} x2={PAD2} y1={PAD2} y2={sy2(MSE_MIN)} className="truc" />
        {[0.01, 0.1].map((v) => (
          <text key={v} x={PAD2 - 6} y={sy2(v) + 4} textAnchor="end" className="nhan">{v}</text>
        ))}
        {[0, 3, 6, 9].map((d) => (
          <text key={d} x={sx2(d)} y={sy2(MSE_MIN) + 16} textAnchor="middle" className="nhan">{d}</text>
        ))}
        <text x={W / 2} y={H2 - 6} textAnchor="middle" className="nhan">Bậc đa thức (sức chứa mô hình →)</text>
        <text x={PAD2 - 6} y={PAD2 - 8} textAnchor="start" className="nhan">MSE (log)</text>
        <line x1={PAD2} x2={W - PAD2} y1={sy2(SAN)} y2={sy2(SAN)} className="duong-di" />
        <text x={W - PAD2} y={sy2(SAN) - 5} textAnchor="end" className="nhan">sàn nhiễu σ² = 0.0225</text>
        <polyline className="duong-cong" points={tap.khop.map((f, d) => `${sx2(d)},${sy2(f.tr)}`).join(' ')} />
        <polyline className="tiep-tuyen" points={tap.khop.map((f, d) => `${sx2(d)},${sy2(f.va)}`).join(' ')} />
        <line x1={sx2(bac)} x2={sx2(bac)} y1={PAD2} y2={sy2(MSE_MIN)} className="truc" />
        <circle cx={sx2(bac)} cy={sy2(k.tr)} r={5} className="diem-hien-tai" />
        <circle cx={sx2(bac)} cy={sy2(k.va)} r={5} className="diem-hien-tai" />
      </svg>
      <div className="chu-giai">
        <span>— đậm: MSE huấn luyện</span>
        <span>— xanh: MSE validation</span>
      </div>

      <figcaption aria-live="polite">
        Bậc <b>{bac}</b>, {n} điểm huấn luyện: MSE train = <b>{k.tr.toFixed(5)}</b> · MSE val = <b>{k.va.toFixed(5)}</b>
        {' '}· hệ số lớn nhất |c| = <b>{k.mx}</b>
        <br />
        Khoảng cách val − train = <b>{(k.va - k.tr).toFixed(5)}</b> → <b>{chan}</b>.
        {' '}Bậc tốt nhất theo val ở đây là <b>{bacTot}</b> (val = {tap.khop[bacTot].va.toFixed(5)}).
        <br />
        <span className="mo">
          Dữ liệu sinh sẵn bằng numpy: sự thật f(x) = sin(πx), nhiễu Gauss σ = 0.15, hạt giống cố định.
          Khớp bằng bình phương tối thiểu trên ma trận Vandermonde. Vì có nhiễu, không mô hình nào
          hạ được MSE validation xuống dưới sàn σ² = 0.0225 — MSE train nhỏ hơn sàn đó là dấu hiệu
          mô hình đang học thuộc nhiễu.
        </span>
      </figcaption>
    </figure>
  );
}
