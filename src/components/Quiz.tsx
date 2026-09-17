import CauHoiView, { type CauHoi } from './CauHoiView';
import type { KhaiNiemTom } from '../lib';

export default function Quiz({ khaiNiem, cauHoi, tienQuyet }: { khaiNiem: string; cauHoi: CauHoi[]; tienQuyet: KhaiNiemTom[] }) {
  return (
    <div className="quiz">
      {cauHoi.map((c, i) => (
        <CauHoiView key={c.id} khoa={`${khaiNiem}/${c.id}`} c={c} nhan={`Câu ${i + 1}`} tienQuyet={tienQuyet} />
      ))}
    </div>
  );
}
