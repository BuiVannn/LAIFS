import { useState } from 'react';

type CauHoi = {
  loai: 'mot' | 'nhieu' | 'so';
  de: string;
  lua_chon?: string[];
  dap_an: number | number[];
  sai_so: number;
  do_kho: number;
  giai_thich: string;
};

const dung = (c: CauHoi, tl: string | number[] | undefined) => {
  if (tl === undefined) return false;
  if (c.loai === 'so') return tl !== '' && Math.abs(Number(String(tl).replace(',', '.')) - (c.dap_an as number)) <= c.sai_so;
  const dapAn = ([] as number[]).concat(c.dap_an).sort().join();
  return ([] as number[]).concat(tl as number[]).sort().join() === dapAn;
};

export default function Quiz({ id, cauHoi }: { id: string; cauHoi: CauHoi[] }) {
  const [traLoi, setTraLoi] = useState<Record<number, string | number[]>>({});
  const [daNop, setDaNop] = useState<Record<number, boolean>>({});

  const nop = (i: number) => {
    const moi = { ...daNop, [i]: true };
    setDaNop(moi);
    if (Object.keys(moi).length === cauHoi.length) {
      const soDung = cauHoi.filter((c, j) => dung(c, traLoi[j])).length;
      try {
        localStorage.setItem(`quiz:${id}`, JSON.stringify({ dung: soDung, tong: cauHoi.length }));
      } catch {}
    }
  };

  const soDung = cauHoi.filter((c, i) => daNop[i] && dung(c, traLoi[i])).length;

  return (
    <div className="quiz">
      {cauHoi.map((c, i) => {
        const nopRoi = daNop[i];
        const tl = traLoi[i];
        const chon = (j: number) => {
          if (nopRoi) return;
          if (c.loai === 'mot') setTraLoi({ ...traLoi, [i]: [j] });
          else {
            const cu = (tl as number[]) ?? [];
            setTraLoi({ ...traLoi, [i]: cu.includes(j) ? cu.filter((x) => x !== j) : [...cu, j] });
          }
        };
        return (
          <fieldset key={i} className={nopRoi ? (dung(c, tl) ? 'dung' : 'sai') : ''}>
            <legend>
              Câu {i + 1} · {'●'.repeat(c.do_kho)}{'○'.repeat(3 - c.do_kho)}
              {c.loai === 'nhieu' && ' · chọn nhiều đáp án'}
            </legend>
            <p>{c.de}</p>
            {c.loai === 'so' ? (
              <input
                type="text"
                inputMode="decimal"
                aria-label={`Đáp án câu ${i + 1}`}
                disabled={nopRoi}
                value={(tl as string) ?? ''}
                onChange={(e) => setTraLoi({ ...traLoi, [i]: e.target.value })}
              />
            ) : (
              c.lua_chon!.map((lc, j) => {
                const daChon = ((tl as number[]) ?? []).includes(j);
                const laDapAn = ([] as number[]).concat(c.dap_an).includes(j);
                return (
                  <label key={j} className={nopRoi && laDapAn ? 'la-dap-an' : ''}>
                    <input type={c.loai === 'mot' ? 'radio' : 'checkbox'} name={`q${i}`} checked={daChon} disabled={nopRoi} onChange={() => chon(j)} />
                    {lc}
                  </label>
                );
              })
            )}
            {nopRoi ? (
              <p className="giai-thich">
                <b>{dung(c, tl) ? '✓ Đúng.' : `✗ Chưa đúng.${c.loai === 'so' ? ` Đáp án: ${c.dap_an}.` : ''}`}</b> {c.giai_thich}
              </p>
            ) : (
              <button onClick={() => nop(i)} disabled={tl === undefined || tl === '' || (Array.isArray(tl) && !tl.length)}>
                Kiểm tra
              </button>
            )}
          </fieldset>
        );
      })}
      <p aria-live="polite">
        Đã làm {Object.keys(daNop).length}/{cauHoi.length} câu · đúng {soDung}
        {Object.keys(daNop).length > 0 && (
          <button className="phu" onClick={() => { setTraLoi({}); setDaNop({}); }}>Làm lại</button>
        )}
      </p>
    </div>
  );
}
