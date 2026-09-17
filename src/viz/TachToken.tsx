import { useMemo, useState } from 'react';
import DuDoan, { useDuDoan, type DuDoanCauHoi } from '../components/DuDoan';

// Bảng merge BPE học OFFLINE từ một corpus tí hon: 56 câu tiếng Anh + 7 câu tiếng Việt
// (tỉ lệ 624 / 66 từ — cố ý lệch về tiếng Anh, giống các tokenizer thật).
// 300 merge + 58 ký tự gốc = vocab 358. Mọi con số trong bài đều tính bằng đúng bảng này.
const MERGE = [
  "▁ t", "▁t h", "▁th e", "i n", "▁ a", "▁ s", "i s", "▁ o", "▁ w", "▁ m", "e n", "▁t o", "in g", "▁ c",
  "▁ l", "o r", "e r", "a n", "▁ is", "▁ in", "▁ b", "▁ n", "▁ p", "o n", "a r", "▁o f", "▁ h", "▁ f", "r e",
  "l e", "i t", "▁a n", "a t", "o u", "a l", "▁ v", "▁an d", "▁t r", "e s", "▁th is", "r o", "g e", "▁o n",
  "i on", "o o", "▁s t", "en t", "c e", "▁ g", "e ar", "l d", "o m", "k ing", "o t", "▁ d", "▁ r", "c h",
  "▁w e", "▁a re", "▁n e", "e c", "▁l ear", "▁lear n", "at ion", "▁ re", "u a", "▁w or", "s t", "n g",
  "▁tr an", "▁tran s", "▁trans l", "▁transl ation", "e t", "i l", "e a", "on g", "ou t", "▁l an", "▁lan g",
  "▁lang ua", "o d", "od e", "▁m e", "h er", "a y", "i v", "▁p ro", "q u", "▁c h", "u n", "▁a b", "▁ab out",
  "t or", "a in", "al l", "▁langua ge", "▁s ent", "▁sent en", "▁senten ce", "▁a t", "u t", "i ce", "b le",
  "s e", "▁v er", "▁in t", "▁ qu", "▁o ld", "i r", "i m", "▁n g", "▁r un", "▁ i", "is h", "a m", "▁to m",
  "▁tom or", "▁tomor ro", "▁tomorro w", "▁m or", "n ing", "▁s h", "▁h is", "▁st u", "▁stu d", "▁s m",
  "▁sm all", "▁m ode", "▁mode l", "oo d", "t s", "▁ne w", "▁c om", "▁com p", "▁f or", "e d", "▁to k",
  "▁tok en", "e x", "▁ y", "▁y ou", "▁s p", "▁ver y", "es t", "▁int o", "▁n ot", "▁m an", "▁p r", "i ế",
  "▁m a", "in e", "l ish", "en d", "p or", "▁mor ning", "▁w h", "▁re a", "▁rea d", "▁b oo", "▁boo k", "it y",
  "▁learn ing", "▁h o", "▁tr ain", "▁g ood", "e p", "i g", "▁s o", "u y", "▁comp ut", "▁s y", "▁l ar",
  "▁lar ge", "▁m y", "al king", "▁f r", "ge t", "▁w it", "▁wit h", "p le", "u r", "▁b e", "▁me et", "▁l ot",
  "m b", "▁s im", "▁th an", "▁on e", "▁pro ble", "▁proble m", "▁h ọ", "▁họ c", "▁t iế", "▁tr ong", "▁v à",
  "▁ đ", "▁s it", "▁d o", "▁run s", "▁g ar", "▁gar d", "▁gard en", "▁w an", "▁ma ch", "▁mach ine", "▁ en",
  "▁en g", "▁eng lish", "▁v i", "▁w il", "▁wil l", "▁s end", "por t", "▁wh o", "▁t ea", "▁sh e", "▁read ing",
  "▁l ong", "▁his tor", "▁histor y", "▁c ity", "▁stud ent", "▁student s", "▁stud y", "▁h e", "▁b uy",
  "▁comput er", "▁wor k", "▁sy st", "▁syst e", "▁syste m", "▁p ar", "al le", "d i", "di c", "▁ne x",
  "▁nex t", "t er", "oo king", "▁f am", "▁fam il", "▁famil y", "▁the y", "▁w alking", "a ble", "▁ ex",
  "▁ex p", "es s", "▁l iv", "▁liv ing", "▁h ou", "▁hou se", "▁r iv", "▁riv er", "▁p e", "▁pe o", "▁peo ple",
  "▁c an", "▁sp ea", "▁spea k", "▁wor king", "▁b o", "▁bo y", "▁qu est", "▁quest ion", "▁f i", "▁fi le",
  "▁be f", "▁bef or", "▁befor e", "▁meet ing", "e v", "▁ne ed", "▁an ot", "▁anot her", "o w", "▁ u", "▁u se",
  "u l", "▁w ay", "a ir", "on t", "g h", "▁ it", "▁ ea", "s i", "▁sp l", "▁spl it", "▁token s", "▁v ec",
  "▁vec tor", "▁n u", "▁nu mb", "▁numb er", "▁wor d", "▁word s", "▁th at", "▁sim il", "▁simil ar"
];
const HANG = new Map(MERGE.map((m, i) => [m, i]));

// Cắt thô: số | chuỗi chữ cái | một dấu câu. Từ đứng sau khoảng trắng được gắn tiền tố ▁.
const TU = /\p{N}+|\p{L}+|[^\s\p{L}\p{N}]/gu;

function tachTho(cau: string) {
  const s = cau.normalize('NFC').toLowerCase();
  const ra: string[] = [];
  for (const m of s.matchAll(TU)) {
    const i = m.index ?? 0;
    ra.push((i === 0 || /\s/.test(s[i - 1]) ? '▁' : '') + m[0]);
  }
  return ra;
}

export function tachToken(cau: string) {
  const ra: string[] = [];
  for (const tho of tachTho(cau)) {
    const ky = [...tho];
    for (;;) {
      let tot = Infinity, vt = -1;
      for (let i = 0; i < ky.length - 1; i++) {
        const r = HANG.get(ky[i] + ' ' + ky[i + 1]);
        if (r !== undefined && r < tot) { tot = r; vt = i; }
      }
      if (vt < 0) break;
      ky.splice(vt, 2, ky[vt] + ky[vt + 1]);
    }
    ra.push(...ky);
  }
  return ra;
}

const CAP = [
  { vi: 'Tôi muốn học dịch máy bằng tiếng Việt.', en: 'I want to learn machine translation into Vietnamese.' },
  { vi: 'Con mèo ngồi trên chiếc ghế.', en: 'The cat sits on the chair.' },
  { vi: 'Chúng tôi sẽ gửi báo cáo vào ngày mai.', en: 'We will send the report tomorrow.' },
  { vi: 'Nhà vua và hoàng hậu sống trong lâu đài.', en: 'The king and the queen live in a castle.' },
];

const W = 600, PAD = 8, RONG_CHU = 8.2, DEM = 14, CAO = 26, KE = 8, NHAN_CAO = 22;
const MAU = ['', ' vung', ' hieu', ' da-thu'];

type O = { t: string; x: number; y: number; w: number; i: number };

// Xếp các ô token thành nhiều hàng, tự xuống dòng khi hết bề ngang
function xepHang(tokens: string[], y0: number) {
  const o: O[] = [];
  let x = PAD, y = y0;
  tokens.forEach((t, i) => {
    const w = Math.round([...t].length * RONG_CHU + DEM);
    if (x > PAD && x + w > W - PAD) { x = PAD; y += CAO + KE; }
    o.push({ t, x, y, w, i });
    x += w + 4;
  });
  return { o, cao: y + CAO };
}

const soByte = (s: string) => new TextEncoder().encode(s).length;

type Props = {
  cap?: number;
  duDoan?: DuDoanCauHoi;
};

export default function TachToken(props: Props) {
  const [iCap, setICap] = useState(props.cap ?? 0);
  const [tuDo, setTuDo] = useState('');
  const [hien, setHien] = useState(!props.duDoan);
  const { daDoan, setDaDoan } = useDuDoan();
  const khoa = !!props.duDoan;
  const cap = CAP[iCap];

  const khoi = useMemo(() => {
    const caus: { nhan: string; cau: string }[] = [
      { nhan: 'Tiếng Việt', cau: cap.vi },
      { nhan: 'Tiếng Anh', cau: cap.en },
    ];
    if (tuDo.trim()) caus.push({ nhan: 'Câu của bạn', cau: tuDo });
    let y = NHAN_CAO;
    return caus.map(({ nhan, cau }) => {
      const tokens = tachToken(cau);
      const { o, cao } = xepHang(tokens, y);
      const k = { nhan, cau, tokens, o, yNhan: y - 7 };
      y = cao + NHAN_CAO + KE;
      return { ...k, tong: y };
    });
  }, [iCap, tuDo]);

  const H = khoi.length ? khoi[khoi.length - 1].tong : 60;
  const vi = khoi[0].tokens.length, en = khoi[1].tokens.length;

  return (
    <figure className="viz">
      {props.duDoan && <DuDoan q={props.duDoan} daDoan={daDoan} setDaDoan={setDaDoan} daChay={hien} />}
      <div className="viz-dieu-khien">
        <label>
          Cặp câu Việt–Anh
          <select disabled={khoa} value={iCap} onChange={(e) => setICap(+e.target.value)}>
            {CAP.map((c, i) => (
              <option key={i} value={i}>{c.vi}</option>
            ))}
          </select>
        </label>
        <label>
          Gõ câu của bạn (tuỳ ý)
          <input type="text" disabled={khoa} value={tuDo} placeholder="ví dụ: Hôm nay trời đẹp." onChange={(e) => setTuDo(e.target.value)} />
        </label>
      </div>

      {props.duDoan && !hien && (
        <div className="viz-dieu-khien">
          <button onClick={() => setHien(true)} disabled={daDoan === null}>Tách token</button>
        </div>
      )}

      {hien && (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Các token của câu tiếng Việt (${vi} token) và câu tiếng Anh (${en} token)`}>
          {khoi.map((k) => (
            <g key={k.nhan}>
              <text x={PAD} y={k.yNhan} className="nhan">
                {k.nhan}: {k.tokens.length} token · {soByte(k.cau)} byte UTF-8
              </text>
              {k.o.map((o) => (
                <g key={o.i} className={'nut-kn' + MAU[o.i % MAU.length]}>
                  <rect x={o.x} y={o.y} width={o.w} height={CAO} rx={6} />
                  <text x={Math.round(o.x + o.w / 2)} y={o.y + 18} textAnchor="middle">{o.t}</text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      )}

      <figcaption aria-live="polite">
        {hien ? (
          <>
            Tiếng Việt <b>{vi}</b> token · tiếng Anh <b>{en}</b> token ·{' '}
            <b className={vi > en ? 'canh-bao' : 'ok'}>
              {vi > en ? `câu tiếng Việt tốn gấp ${(vi / en).toFixed(2)} lần` : 'câu tiếng Việt tốn ít hơn'}
            </b>
            <br />
            Dấu <b>▁</b> đánh dấu token mở đầu một từ. Bảng merge được học từ corpus 624 từ tiếng Anh + 66 từ tiếng Việt, vocab 358.
          </>
        ) : (
          <>Chọn một dự đoán rồi bấm “Tách token”.</>
        )}
      </figcaption>
    </figure>
  );
}
