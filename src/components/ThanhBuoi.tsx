// Thanh buổi học hiện trên trang khái niệm khi mở từ buổi học (?buoi=1)
import { useEffect, useState } from 'react';
import { ThanhTienTrinh } from './BuoiHoc';
import { docBuoi, ghiBuoi, type PhienBuoi } from './buoi';
import { doc } from '../tien-do';

export default function ThanhBuoi({ khaiNiem }: { khaiNiem: string }) {
  const [buoi, setBuoi] = useState<PhienBuoi | null>(null);
  const [phut, setPhut] = useState(25);
  useEffect(() => {
    const b = docBuoi();
    if (!new URLSearchParams(location.search).has('buoi') || !b || b.khaiNiem !== khaiNiem) return;
    const moi = { ...b, buoc: 'hoc-moi' as const };
    ghiBuoi(moi);
    setBuoi(moi);
    setPhut(doc().keHoach?.phut ?? 25);
    document.body.classList.add('tap-trung');
  }, []);
  if (!buoi) return null;
  return (
    <>
      <ThanhTienTrinh buoi={buoi} phut={phut} onThoat={() => { ghiBuoi(null); location.href = '/'; }} />
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10 }}>
        <a className="nut lon" href="/buoi-hoc?buoc=chot">Học xong → Chốt lại</a>
      </div>
    </>
  );
}
