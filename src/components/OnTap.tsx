import { useEffect, useMemo, useState } from 'react';
import CauHoiView, { type CauHoi } from './CauHoiView';
import { denHan, doc, nhap, theoDoi, xuat } from '../tien-do';
import type { KhaiNiemTom } from '../lib';

export type MucOnTap = { khoa: string; c: CauHoi; khaiNiem: KhaiNiemTom; tienQuyet: KhaiNiemTom[] };

const TRON = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const LEECH = 3; // quên từ 3 lần trở lên → gợi ý đọc lại bài thay vì cứ ôn

export default function OnTap({ tatCa }: { tatCa: MucOnTap[] }) {
  const [phien, setPhien] = useState<MucOnTap[] | null>(null);
  const [viTri, setViTri] = useState(0);
  const [daTraLoi, setDaTraLoi] = useState(false);
  const [td, setTd] = useState<ReturnType<typeof doc> | null>(null);
  const [thongBao, setThongBao] = useState('');

  useEffect(() => { setTd(doc()); return theoDoi(() => setTd(doc())); }, []);

  const theoKhoa = useMemo(() => new Map(tatCa.map((m) => [m.khoa, m])), [tatCa]);
  const hanOn = td ? denHan(td, [...theoKhoa.keys()]) : [];
  const daHoc = td ? tatCa.filter((m) => td.cauHoi[m.khoa]).length : 0;
  const hanTiepTheo = td
    ? tatCa.map((m) => td.cauHoi[m.khoa]?.the.due.getTime()).filter((x): x is number => !!x && x > Date.now()).sort()[0]
    : undefined;

  const batDau = () => {
    // Trộn câu của nhiều khái niệm (interleaving), không ôn theo từng khái niệm
    setPhien(TRON(hanOn.map((k) => theoKhoa.get(k)!)));
    setViTri(0);
    setDaTraLoi(false);
  };

  const taiXuong = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([xuat()], { type: 'application/json' }));
    a.download = `laifs-tien-do-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const taiLen = async (f: File | undefined) => {
    if (!f || !confirm('Ghi đè toàn bộ tiến độ hiện tại bằng file này?')) return;
    try {
      nhap(await f.text());
      setThongBao('✓ Đã nhập tiến độ.');
    } catch (e) {
      setThongBao(`✗ Không nhập được: ${(e as Error).message}`);
    }
  };

  if (!td) return <p>Đang tải tiến độ…</p>;

  const hienTai = phien?.[viTri];
  const soLanQuen = hienTai ? td.cauHoi[hienTai.khoa]?.the.lapses ?? 0 : 0;

  return (
    <div className="on-tap">
      {!phien || !hienTai ? (
        <>
          {phien && <p className="ok"><b>✓ Xong phiên ôn tập {phien.length} câu.</b></p>}
          {hanOn.length > 0 ? (
            <p>
              Có <b>{hanOn.length}</b> câu đến hạn ôn, trộn từ nhiều khái niệm.{' '}
              <button onClick={batDau}>Bắt đầu ôn</button>
            </p>
          ) : daHoc === 0 ? (
            <p>Chưa có gì để ôn. Làm trắc nghiệm trong bài học trước, câu hỏi sẽ tự vào lịch ôn.</p>
          ) : (
            <p>
              Hôm nay hết câu cần ôn 🎉
              {hanTiepTheo && <> Lần ôn tiếp theo: <b>{new Date(hanTiepTheo).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</b>.</>}
            </p>
          )}
          <p className="nhan">Đã học {daHoc}/{tatCa.length} câu hỏi.</p>
        </>
      ) : (
        <>
          <p className="nhan">Câu {viTri + 1}/{phien.length} · <a href={hienTai.khaiNiem.coTrang ? `/khai-niem/${hienTai.khaiNiem.id}` : undefined}>{hienTai.khaiNiem.ten}</a></p>
          <CauHoiView
            key={hienTai.khoa + viTri}
            khoa={hienTai.khoa}
            c={hienTai.c}
            nhan="Ôn tập"
            tienQuyet={hienTai.tienQuyet}
            onXong={() => setDaTraLoi(true)}
          />
          {daTraLoi && soLanQuen >= LEECH && (
            <p className="goi-y">
              Câu này đã quên {soLanQuen} lần. Có lẽ vấn đề là chưa hiểu chứ không phải chưa nhớ — thử{' '}
              {hienTai.khaiNiem.coTrang ? <a href={`/khai-niem/${hienTai.khaiNiem.id}`}>đọc lại bài {hienTai.khaiNiem.ten}</a> : `đọc lại bài ${hienTai.khaiNiem.ten}`}.
            </p>
          )}
          <button disabled={!daTraLoi} onClick={() => { setViTri(viTri + 1); setDaTraLoi(false); }}>
            {viTri + 1 < phien.length ? 'Câu tiếp →' : 'Kết thúc'}
          </button>
        </>
      )}

      <details className="sao-luu" id="sao-luu">
        <summary>Sao lưu tiến độ</summary>
        <p>Tiến độ chỉ lưu trong trình duyệt này. Xoá dữ liệu trình duyệt hoặc đổi máy sẽ mất — hãy tải file về định kỳ.</p>
        <button onClick={taiXuong}>Tải file tiến độ</button>{' '}
        <label className="nut-file">
          Nhập từ file (ghi đè tiến độ hiện tại)
          <input type="file" accept="application/json,.json" onChange={(e) => taiLen(e.target.files?.[0])} />
        </label>
        {thongBao && <p role="status">{thongBao}</p>}
      </details>
    </div>
  );
}
