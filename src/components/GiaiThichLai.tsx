import { useEffect, useState } from 'react';
import { doc, ghiGiaiThich } from '../tien-do';

export default function GiaiThichLai({ khaiNiem, ten, yChinh }: { khaiNiem: string; ten: string; yChinh: string[] }) {
  const [noiDung, setNoiDung] = useState('');
  const [daLuu, setDaLuu] = useState(false);

  useEffect(() => {
    const cu = doc().giaiThich[khaiNiem];
    if (cu) { setNoiDung(cu); setDaLuu(true); }
  }, []);

  const luu = () => { ghiGiaiThich(khaiNiem, noiDung.trim()); setDaLuu(true); };

  return (
    <div className="giai-thich-lai">
      <label htmlFor={`gtl-${khaiNiem}`}>
        Giải thích <b>{ten}</b> cho một người bạn chưa học, trong 3–5 câu, <b>không nhìn lại bài</b>. Chỗ nào viết không ra
        chính là chỗ chưa hiểu.
      </label>
      <textarea id={`gtl-${khaiNiem}`} rows={5} value={noiDung} onChange={(e) => { setNoiDung(e.target.value); setDaLuu(false); }} />
      <button onClick={luu} disabled={noiDung.trim().length < 20}>{daLuu ? 'Đã lưu ✓' : 'Lưu & so sánh'}</button>
      {daLuu && yChinh.length > 0 && (
        <div className="giai-thich">
          <p><b>Đối chiếu:</b> bài giải thích của bạn đã nhắc tới các ý này chưa?</p>
          <ul>{yChinh.map((y) => <li key={y}>{y}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
