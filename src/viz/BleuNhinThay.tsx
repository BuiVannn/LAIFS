import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// BLEU nhìn thấy được: chọn một bản dịch máy, tô các n-gram khớp với bản tham chiếu,
// rồi hiện p1..p4, brevity penalty và BLEU cuối cùng. Mọi con số do chính code này tính.

const THAM_CHIEU = 'chính phủ đã công bố kế hoạch mới vào sáng thứ hai';

type BanDich = { ten: string; cau: string; mo_ta: string };

const BAN_DICH: Record<string, BanDich> = {
  dao: {
    ten: 'A — đảo trật tự cụm',
    cau: 'vào sáng thứ hai chính phủ đã công bố kế hoạch mới',
    mo_ta: 'Nghĩa giữ nguyên 100%, chỉ chuyển cụm thời gian ra đầu câu.',
  },
  dongNghia: {
    ten: 'B — thay từ đồng nghĩa',
    cau: 'chính phủ đã thông báo kế hoạch mới vào sáng thứ hai',
    mo_ta: 'Nghĩa giữ nguyên, chỉ đổi "công bố" thành "thông báo".',
  },
  saiNgay: {
    ten: 'C — sai ngày (lỗi nghiêm trọng)',
    cau: 'chính phủ đã công bố kế hoạch mới vào sáng thứ ba',
    mo_ta: 'Chỉ sai đúng một từ, nhưng sai hẳn ngày: thứ hai thành thứ ba.',
  },
  cut: {
    ten: 'D — dịch cụt',
    cau: 'chính phủ đã công bố kế hoạch mới',
    mo_ta: 'Bỏ hẳn cụm thời gian. Mọi thứ nói ra đều đúng, nhưng thiếu thông tin.',
  },
};

const W = 680, PAD = 20, CAO_DONG = 34, CAO_O = 26;

const tach = (s: string) => s.split(' ');
const doRong = (t: string) => Math.round(t.length * 9.5) + 18;

type O = { t: string; x: number; y: number; w: number; i: number };

// Xếp token thành nhiều dòng, toạ độ nguyên để không lệch hydration
function xepDong(toks: string[], y0: number): { o: O[]; cao: number } {
  const o: O[] = [];
  let x = PAD, y = y0;
  toks.forEach((t, i) => {
    const w = doRong(t);
    if (x + w > W - PAD) { x = PAD; y += CAO_DONG; }
    o.push({ t, x, y, w, i });
    x += w + 6;
  });
  return { o, cao: y + CAO_DONG - y0 };
}

function dem(toks: string[], n: number): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = 0; i + n <= toks.length; i++) {
    const k = toks.slice(i, i + n).join(' ');
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

// Precision bậc n có clipping + vị trí các n-gram được tính là khớp
function doPrecision(cand: string[], ref: string[], n: number) {
  const conLai = dem(ref, n);
  const viTri: number[] = [];
  let khop = 0;
  for (let i = 0; i + n <= cand.length; i++) {
    const k = cand.slice(i, i + n).join(' ');
    const c = conLai.get(k) ?? 0;
    if (c > 0) { conLai.set(k, c - 1); khop++; viTri.push(i); }
  }
  return { khop, tong: Math.max(0, cand.length - n + 1), viTri };
}

function tinhBleu(cand: string[], ref: string[]) {
  const p = [1, 2, 3, 4].map((n) => doPrecision(cand, ref, n));
  const c = cand.length, r = ref.length;
  const bp = c > r ? 1 : c === 0 ? 0 : Math.exp(1 - r / c);
  const co0 = p.some((x) => x.tong === 0 || x.khop === 0);
  const hinhHoc = co0 ? 0 : Math.exp(p.reduce((s, x) => s + Math.log(x.khop / x.tong), 0) / 4);
  return { p, bp, hinhHoc, bleu: bp * hinhHoc * 100, c, r };
}

type Props = { banDich?: keyof typeof BAN_DICH; bac?: number; duDoan?: DuDoanCauHoi };

export default function BleuNhinThay(props: Props) {
  const [khoa, setKhoa] = useState<keyof typeof BAN_DICH>(props.banDich ?? 'dao');
  const [n, setN] = useState(props.bac ?? 1);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoaBanDich = !!props.banDich;
  const hien = !props.duDoan || daDoan !== null;

  const ref = useMemo(() => tach(THAM_CHIEU), []);
  const cand = useMemo(() => tach(BAN_DICH[khoa].cau), [khoa]);
  const kq = useMemo(() => tinhBleu(cand, ref), [cand, ref]);

  const dongRef = useMemo(() => xepDong(ref, 44), [ref]);
  const dongCand = useMemo(() => xepDong(cand, 44 + dongRef.cao + 40), [cand, dongRef.cao]);
  const H = 44 + dongRef.cao + 40 + dongCand.cao + 10;

  // Token nào nằm trong một n-gram được tính khớp (ở bậc n đang chọn)
  const toCand = new Set<number>();
  if (hien) for (const i of kq.p[n - 1].viTri) for (let k = 0; k < n; k++) toCand.add(i + k);
  // Bên tham chiếu: tô các n-gram của bản dịch có mặt trong tham chiếu
  const toRef = new Set<number>();
  if (hien) {
    const canTim = new Set(kq.p[n - 1].viTri.map((i) => cand.slice(i, i + n).join(' ')));
    for (let i = 0; i + n <= ref.length; i++) {
      if (canTim.has(ref.slice(i, i + n).join(' '))) for (let k = 0; k < n; k++) toRef.add(i + k);
    }
  }

  const veDong = (d: { o: O[] }, to: Set<number>) =>
    d.o.map((o) => (
      <g key={o.i}>
        <rect x={o.x} y={o.y - CAO_O + 6} width={o.w} height={CAO_O} rx={6}
          fill={to.has(o.i) ? 'var(--nhan)' : 'var(--nen-phu)'}
          stroke={to.has(o.i) ? 'var(--nhan)' : 'var(--vien)'} strokeWidth={1} />
        <text x={o.x + Math.round(o.w / 2)} y={o.y} textAnchor="middle" fontSize={15}
          fill={to.has(o.i) ? 'var(--tren-nhan)' : 'var(--chu)'}>{o.t}</text>
      </g>
    ));

  const ps = kq.p.map((x) => (x.tong === 0 ? 0 : x.khop / x.tong));

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={daDoan !== null} />}
      <div className="viz-dieu-khien">
        <label>
          Bản dịch máy
          <select disabled={khoaBanDich} value={khoa} onChange={(e) => setKhoa(e.target.value as keyof typeof BAN_DICH)}>
            {Object.entries(BAN_DICH).map(([k, b]) => (
              <option key={k} value={k}>{b.ten}</option>
            ))}
          </select>
        </label>
        <label>
          Đang tô n-gram bậc n = <b>{n}</b>
          <input type="range" min={1} max={4} step={1} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Bản tham chiếu và bản dịch ${BAN_DICH[khoa].ten}, tô các ${n}-gram khớp nhau`}>
        <text x={PAD} y={20} className="nhan">Bản tham chiếu (người dịch)</text>
        {veDong(dongRef, toRef)}
        <text x={PAD} y={44 + dongRef.cao + 16} className="nhan">Bản dịch máy — {BAN_DICH[khoa].ten}</text>
        {veDong(dongCand, toCand)}
      </svg>

      <figcaption aria-live="polite">
        {!hien ? (
          <>Chọn một dự đoán ở trên để hiện điểm.</>
        ) : (
          <>
            {BAN_DICH[khoa].mo_ta}
            <br />
            {[1, 2, 3, 4].map((k) => (
              <span key={k}>
                {k === n ? <b>p{k} = {kq.p[k - 1].khop}/{kq.p[k - 1].tong} = {ps[k - 1].toFixed(4)}</b>
                  : <>p{k} = {kq.p[k - 1].khop}/{kq.p[k - 1].tong} = {ps[k - 1].toFixed(4)}</>}
                {k < 4 ? ' · ' : ''}
              </span>
            ))}
            <br />
            Độ dài: bản dịch <b>{kq.c}</b> từ, tham chiếu <b>{kq.r}</b> từ → BP = <b>{kq.bp.toFixed(4)}</b>
            {kq.c > kq.r ? ' (dài hơn tham chiếu nên không bị phạt)' : kq.c === kq.r ? ' (bằng nhau)' : ' (ngắn hơn nên bị phạt)'}
            <br />
            Trung bình nhân của p1..p4 = <b>{kq.hinhHoc.toFixed(4)}</b> → BLEU = {kq.bp.toFixed(4)} × {kq.hinhHoc.toFixed(4)} ={' '}
            <b className={kq.bleu >= 80 ? 'canh-bao' : 'ok'}>{kq.bleu.toFixed(2)}</b>
          </>
        )}
      </figcaption>
    </figure>
  );
}
