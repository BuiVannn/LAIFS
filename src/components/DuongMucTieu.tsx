// Cột trái trang khái niệm: đường tới mục tiêu hiện tại, tô trạng thái từng bài
import { useEffect, useState } from 'react';
import { doc, theoDoi, type TienDo } from '../tien-do';
import { duongHoc, mucDoKN, MUC_TIEU_MAC_DINH, type KhaiNiemDL } from '../do-thi';

export default function DuongMucTieu({ ds, hienTai }: { ds: KhaiNiemDL[]; hienTai: string }) {
  const [td, setTd] = useState<TienDo | null>(null);
  useEffect(() => { setTd(doc()); return theoDoi(() => setTd(doc())); }, []);
  const mucTieu = td?.mucTieu && ds.some((k) => k.id === td.mucTieu) ? td.mucTieu : MUC_TIEU_MAC_DINH;
  let duong = duongHoc(ds, mucTieu);
  const ngoaiDuong = !duong.some((k) => k.id === hienTai);
  if (ngoaiDuong) duong = duongHoc(ds, hienTai);
  const tenMucTieu = ds.find((k) => k.id === (ngoaiDuong ? hienTai : mucTieu))?.ten;
  return (
    <nav aria-label="Đường tới mục tiêu">
      <p className="nhan-muc">{ngoaiDuong ? 'Đường tới bài này' : 'Mục tiêu'}</p>
      <b>{tenMucTieu}</b>
      <ol className="duong-muc-tieu">
        {duong.map((k) => {
          const m = mucDoKN(td, k);
          const cham = <i className={`cham ${m}`} aria-hidden="true" />;
          return (
            <li key={k.id}>
              {k.coTrang ? (
                <a href={`/khai-niem/${k.id}`} aria-current={k.id === hienTai ? 'page' : undefined}>{cham}{k.ten}</a>
              ) : (
                <span className="ten">{cham}{k.ten}</span>
              )}
            </li>
          );
        })}
      </ol>
      <p style={{ marginTop: 12 }}><a href="/lo-trinh">Đổi mục tiêu</a></p>
    </nav>
  );
}
