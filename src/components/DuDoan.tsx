import { useState } from 'react';

export type DuDoanCauHoi = { de: string; lua_chon: string[]; dap_an: number; giai_thich: string };

// Hỏi "đoán trước" cho một viz. Viz khoá nút chạy tới khi đã đoán (daDoan !== null),
// và chỉ hiện giải thích khi đã chạy xong (daChay).
export function useDuDoan() {
  const [daDoan, setDaDoan] = useState<number | null>(null);
  return { daDoan, setDaDoan };
}

export default function DuDoan({ q, daDoan, setDaDoan, daChay }: { q: DuDoanCauHoi; daDoan: number | null; setDaDoan: (i: number) => void; daChay: boolean }) {
  return (
    <div className="du-doan">
      <p><b>🔮 Đoán trước:</b> {q.de}</p>
      {q.lua_chon.map((lc, i) => (
        <label key={i} className={daChay && i === q.dap_an ? 'la-dap-an' : ''}>
          <input type="radio" checked={daDoan === i} disabled={daDoan !== null} onChange={() => setDaDoan(i)} />
          {lc}
        </label>
      ))}
      {daDoan === null && <p className="nhan">Chọn một dự đoán để mở khoá nút chạy.</p>}
      {daDoan !== null && !daChay && <p className="nhan">Giờ chạy phần trực quan bên dưới để kiểm chứng.</p>}
      {daDoan !== null && daChay && (
        <p className="giai-thich" role="status">
          <b>{daDoan === q.dap_an ? '✓ Đoán đúng.' : '✗ Khác với dự đoán.'}</b> {q.giai_thich}
        </p>
      )}
    </div>
  );
}
