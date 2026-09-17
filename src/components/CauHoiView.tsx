import { useState } from 'react';
import { ghiKetQua } from '../tien-do';
import type { KhaiNiemTom } from '../lib';

export type CauHoi = {
  id: string;
  loai: 'mot' | 'nhieu' | 'so';
  de: string;
  lua_chon?: string[];
  dap_an: number | number[];
  sai_so: number;
  do_kho: number;
  giai_thich: string;
};

type TraLoi = string | number[];

const chamDiem = (c: CauHoi, tl: TraLoi) => {
  if (c.loai === 'so') return String(tl).trim() !== '' && Math.abs(Number(String(tl).replace(',', '.')) - (c.dap_an as number)) <= c.sai_so;
  const sx = (a: number[]) => [...a].sort().join();
  return sx(tl as number[]) === sx(([] as number[]).concat(c.dap_an));
};

type Props = {
  khoa: string; // "<khái niệm>/<id câu>"
  c: CauHoi;
  nhan: string;
  tienQuyet?: KhaiNiemTom[];
  onXong?: (dung: boolean) => void;
};

export default function CauHoiView({ khoa, c, nhan, tienQuyet = [], onXong }: Props) {
  const [tl, setTl] = useState<TraLoi>(c.loai === 'so' ? '' : []);
  const [ketQua, setKetQua] = useState<{ dung: boolean; chac: boolean } | null>(null);

  const coTraLoi = c.loai === 'so' ? String(tl).trim() !== '' : (tl as number[]).length > 0;

  const nop = (chac: boolean) => {
    const dung = chamDiem(c, tl);
    ghiKetQua(khoa, dung, chac);
    setKetQua({ dung, chac });
    onXong?.(dung);
  };

  const chon = (j: number) => {
    if (ketQua) return;
    const cu = tl as number[];
    setTl(c.loai === 'mot' ? [j] : cu.includes(j) ? cu.filter((x) => x !== j) : [...cu, j]);
  };

  const dapAn = ([] as number[]).concat(c.dap_an);

  return (
    <fieldset className={`cau-hoi ${ketQua ? (ketQua.dung ? 'dung' : 'sai') : ''}`}>
      <legend>
        {nhan} · <span aria-label={`độ khó ${c.do_kho}/3`}>{'●'.repeat(c.do_kho)}{'○'.repeat(3 - c.do_kho)}</span>
        {c.loai === 'nhieu' && ' · chọn nhiều đáp án'}
      </legend>
      <p>{c.de}</p>

      {c.loai === 'so' ? (
        <input
          type="text"
          inputMode="decimal"
          aria-label="Đáp án (số)"
          disabled={!!ketQua}
          value={tl as string}
          onChange={(e) => setTl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && coTraLoi && !ketQua && nop(true)}
        />
      ) : (
        c.lua_chon!.map((lc, j) => (
          <label key={j} className={ketQua && dapAn.includes(j) ? 'la-dap-an' : ''}>
            <input
              type={c.loai === 'mot' ? 'radio' : 'checkbox'}
              name={khoa}
              checked={(tl as number[]).includes(j)}
              disabled={!!ketQua}
              onChange={() => chon(j)}
            />
            {lc}
          </label>
        ))
      )}

      {!ketQua ? (
        <div className="nut-nop">
          <button onClick={() => nop(true)} disabled={!coTraLoi}>Kiểm tra · chắc chắn</button>
          <button className="phu" onClick={() => nop(false)} disabled={!coTraLoi}>Kiểm tra · đang đoán</button>
        </div>
      ) : (
        <div className="giai-thich" role="status">
          <p>
            <b>{ketQua.dung ? '✓ Đúng.' : `✗ Chưa đúng.${c.loai === 'so' ? ` Đáp án: ${c.dap_an}.` : ''}`}</b>{' '}
            {ketQua.dung && !ketQua.chac && 'Bạn đoán đúng — câu này sẽ quay lại sớm hơn để chắc là đã hiểu. '}
            {!ketQua.dung && ketQua.chac && 'Bạn chắc chắn mà vẫn sai — đây là lúc học được nhiều nhất, đọc kỹ giải thích nhé. '}
            {c.giai_thich}
          </p>
          {!ketQua.dung && tienQuyet.length > 0 && (
            <p className="goi-y">
              Vướng? Có thể cần ôn lại:{' '}
              {tienQuyet.map((t, i) => (
                <span key={t.id}>
                  {i > 0 && ', '}
                  {t.coTrang ? <a href={`/khai-niem/${t.id}`}>{t.ten}</a> : t.ten}
                </span>
              ))}
            </p>
          )}
          <button className="phu" onClick={() => { setKetQua(null); setTl(c.loai === 'so' ? '' : []); }}>Làm lại</button>
        </div>
      )}
    </fieldset>
  );
}
