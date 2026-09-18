import { useEffect, useRef, useState } from 'react';
import { ghiBaiTapDat } from '../tien-do';

type Test = { ten: string; dat: boolean; loi?: string; goi_y?: string | null };
type KetQua = { loi: string | null; goi_y?: string | null; stdout: string; tests: Test[] };

const GIOI_HAN_GIAY = 10; // chạy quá lâu thì dừng, thường là lặp vô hạn

export default function CodeRunner({ id, starter, tests }: { id: string; starter: string; tests: string }) {
  const khoa = `code:${id}`;
  const [code, setCode] = useState(starter);
  const [trangThai, setTrangThai] = useState<'dang-tai' | 'san-sang' | 'dang-chay'>('dang-tai');
  const [kq, setKq] = useState<KetQua | null>(null);
  const worker = useRef<Worker | null>(null);
  const hetGio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const taoWorker = () => {
    worker.current?.terminate();
    setTrangThai('dang-tai');
    const w = new Worker('/pyodide-worker.js', { type: 'module' });
    w.onmessage = (e) => {
      if (e.data.sanSang) return setTrangThai('san-sang');
      if (e.data.dangTai) return;
      setTrangThai('san-sang');
      clearTimeout(hetGio.current);
      const moi: KetQua = { loi: e.data.loi ?? null, goi_y: e.data.goi_y ?? null, stdout: e.data.stdout ?? '', tests: e.data.tests ?? [] };
      setKq(moi);
      if (!moi.loi && moi.tests.length && moi.tests.every((t) => t.dat)) {
        ghiBaiTapDat(id);
      }
    };
    worker.current = w;
  };

  useEffect(() => {
    try { const luu = localStorage.getItem(khoa); if (luu) setCode(luu); } catch {}
    taoWorker();
    return () => { clearTimeout(hetGio.current); worker.current?.terminate(); };
  }, []);

  const doiCode = (v: string) => {
    setCode(v);
    try { localStorage.setItem(khoa, v); } catch {}
  };

  const chay = () => {
    setKq(null);
    setTrangThai('dang-chay');
    worker.current!.postMessage({ code, tests });
    hetGio.current = setTimeout(() => {
      taoWorker(); // dừng hẳn worker đang kẹt
      setKq({ loi: `Đã chạy quá ${GIOI_HAN_GIAY} giây nên bị dừng.`, goi_y: 'Thường là vòng lặp không có điều kiện dừng, hoặc mảng quá lớn. Kiểm tra lại điều kiện `while`.', stdout: '', tests: [] });
    }, GIOI_HAN_GIAY * 1000);
  };

  // ponytail: textarea thường, đổi sang CodeMirror khi cần tô màu cú pháp / tự thụt lề
  const phimTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const t = e.currentTarget, s = t.selectionStart;
    doiCode(code.slice(0, s) + '    ' + code.slice(t.selectionEnd));
    requestAnimationFrame(() => (t.selectionStart = t.selectionEnd = s + 4));
  };

  const soDat = kq?.tests.filter((t) => t.dat).length ?? 0;

  return (
    <div className="code-runner">
      <textarea value={code} onChange={(e) => doiCode(e.target.value)} onKeyDown={phimTab} spellCheck={false} rows={Math.max(12, code.split('\n').length + 2)} aria-label="Code Python" />
      <div className="viz-dieu-khien">
        <button onClick={chay} disabled={trangThai !== 'san-sang'}>
          {trangThai === 'dang-tai' ? 'Đang tải Python…' : trangThai === 'dang-chay' ? 'Đang chạy…' : 'Chạy & chấm'}
        </button>
        {trangThai === 'dang-chay' && <button onClick={taoWorker}>Dừng</button>}
        <button className="phu" onClick={() => doiCode(starter)}>Về code ban đầu</button>
      </div>
      {kq && (
        <div className="ket-qua" aria-live="polite">
          {kq.loi ? (
            <>
              <pre className="loi">{kq.loi}</pre>
              {kq.goi_y && <p className="goi-y">💡 {kq.goi_y}</p>}
            </>
          ) : (
            <>
              <p><b className={soDat === kq.tests.length ? 'ok' : 'canh-bao'}>{soDat}/{kq.tests.length} test đạt</b>{soDat === kq.tests.length && ' 🎉'}</p>
              <ul>
                {kq.tests.map((t) => (
                  <li key={t.ten} className={t.dat ? 'ok' : 'canh-bao'}>
                    {t.dat ? '✓' : '✗'} <code>{t.ten}</code>{t.loi && <> — {t.loi}</>}
                    {!t.dat && t.goi_y && <div className="goi-y" style={{ marginTop: 6 }}>💡 {t.goi_y}</div>}
                  </li>
                ))}
              </ul>
            </>
          )}
          {kq.stdout && <><p>Output:</p><pre>{kq.stdout}</pre></>}
        </div>
      )}
    </div>
  );
}
