import { useEffect, useMemo, useState } from 'react';
import CauHoiView from './CauHoiView';
import GiaiThichLai from './GiaiThichLai';
import type { MucOnTap } from './OnTap';
import { chuoiTuan, doc, mucDo, mucTieuTuan, TEN_MUC_DO, tuan, type TienDo } from '../tien-do';
import { baiTiepTheo, baoCaoTuan, MUC_TIEU_MAC_DINH, type KhaiNiemDL } from '../do-thi';
import { docBuoi, ghiBuoi, laQuayLai, soCauOn, type PhienBuoi } from './buoi';

const dongHo = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;

export function ThanhTienTrinh({ buoi, phut, onThoat }: { buoi: PhienBuoi; phut: number; onThoat: () => void }) {
  const [bayGio, setBayGio] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setBayGio(Date.now()), 1000); return () => clearInterval(t); }, []);
  const thuTu = ['khoi-dong', 'hoc-moi', 'chot', 'xong'].indexOf(buoi.buoc);
  const lop = (i: number) => (i < thuTu ? 'xong' : i === thuTu ? 'dang' : '');
  return (
    <div className="thanh-buoi">
      <button className="nut-thoat" onClick={onThoat} aria-label="Thoát buổi học">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
      </button>
      <div className="tien-trinh" role="img" aria-label={`Bước ${Math.min(thuTu + 1, 3)} trên 3`}>
        <span className={lop(0)} /><span className={lop(1)} /><span className={lop(2)} />
      </div>
      <span className="dong-ho" aria-label="Thời gian đã học">{dongHo(bayGio - buoi.batDau)} / {phut}:00</span>
    </div>
  );
}

const TRON = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

export default function BuoiHoc({ ds, cauHoi }: { ds: KhaiNiemDL[]; cauHoi: MucOnTap[] }) {
  const [td, setTd] = useState<TienDo | null>(null);
  const [buoi, setBuoiState] = useState<PhienBuoi | null>(null);
  const [hangOn, setHangOn] = useState<MucOnTap[]>([]);
  const [viTri, setViTri] = useState(0);
  const [daTraLoi, setDaTraLoi] = useState(false);
  const [daChep, setDaChep] = useState(false);

  const setBuoi = (b: PhienBuoi | null) => { ghiBuoi(b); setBuoiState(b); };
  const theoKhoa = useMemo(() => new Map(cauHoi.map((c) => [c.khoa, c])), [cauHoi]);

  useEffect(() => {
    const t = doc();
    setTd(t);
    const q = new URLSearchParams(location.search);
    const cu = docBuoi();
    const mucTieu = ds.some((k) => k.id === t.mucTieu) ? t.mucTieu! : MUC_TIEU_MAC_DINH;
    let b: PhienBuoi;
    if (cu && q.get('buoc') === 'chot') b = { ...cu, buoc: 'chot' };
    else if (cu && cu.buoc !== 'xong' && !q.has('nhanh')) b = cu;
    else b = { batDau: Date.now(), nhanh: q.has('nhanh'), buoc: 'khoi-dong', khaiNiem: baiTiepTheo(t, ds, mucTieu)?.id, on: { dung: 0, tong: 0 } };
    // Hàng ôn: câu quá hạn lâu nhất trước (dễ quên nhất), cắt theo thời lượng buổi, rồi trộn khái niệm
    const han = cauHoi.filter((c) => t.cauHoi[c.khoa] && t.cauHoi[c.khoa].the.due.getTime() <= Date.now())
      .sort((a, c) => t.cauHoi[a.khoa].the.due.getTime() - t.cauHoi[c.khoa].the.due.getTime());
    const hang = TRON(han.slice(0, soCauOn(han.length, t.keHoach?.phut ?? 25, laQuayLai(t), b.nhanh)));
    setHangOn(hang);
    if (b.buoc === 'khoi-dong' && !hang.length) b = { ...b, buoc: b.nhanh ? 'xong' : 'hoc-moi' };
    setBuoi(b);
  }, []);

  if (!td || !buoi) return <p className="buoi-hoc mo">Đang chuẩn bị buổi học…</p>;

  const phut = buoi.nhanh ? 5 : td.keHoach?.phut ?? 25;
  const kn = ds.find((k) => k.id === buoi.khaiNiem);
  const thoat = () => { setBuoi(null); location.href = '/'; };
  const qua = (buoc: PhienBuoi['buoc']) => setBuoi({ ...buoi, buoc });

  let noiDung;
  if (buoi.buoc === 'khoi-dong') {
    const c = hangOn[viTri];
    noiDung = !c ? null : (
      <>
        <p className="nhan-muc xanh">Khởi động · câu {viTri + 1}/{hangOn.length}</p>
        <CauHoiView
          key={c.khoa}
          khoa={c.khoa}
          c={c.c}
          nhan={c.khaiNiem.ten}
          tienQuyet={c.tienQuyet}
          onXong={(dung) => { setDaTraLoi(true); setBuoi({ ...buoi, on: { dung: buoi.on.dung + (dung ? 1 : 0), tong: buoi.on.tong + 1 } }); }}
        />
        <div className="nut-cuoi">
          <button className="lon" disabled={!daTraLoi} onClick={() => {
            setDaTraLoi(false);
            if (viTri + 1 < hangOn.length) setViTri(viTri + 1);
            else qua(buoi.nhanh ? 'xong' : 'hoc-moi');
          }}>
            {viTri + 1 < hangOn.length ? 'Câu tiếp' : buoi.nhanh ? 'Xem tổng kết' : 'Sang phần học mới'}
          </button>
          {!buoi.nhanh && <button className="phu lon" onClick={() => qua('hoc-moi')}>Bỏ qua phần ôn</button>}
        </div>
      </>
    );
  } else if (buoi.buoc === 'hoc-moi') {
    noiDung = kn ? (
      <>
        <p className="nhan-muc xanh">Học mới</p>
        <h1>{kn.ten}</h1>
        {kn.dinhNghia && <p style={{ fontSize: 18 }}>{kn.dinhNghia}</p>}
        <p className="mo">Bài học mở ở chế độ tập trung. Học xong bấm <b>Chốt lại</b> ở cuối bài.</p>
        <div className="nut-cuoi">
          <a className="nut lon" href={`/khai-niem/${kn.id}?buoi=1`}>Vào bài học</a>
          <button className="phu lon" onClick={() => qua('chot')}>Hôm nay không học mới</button>
        </div>
      </>
    ) : (
      <>
        <h1>Đã đi hết đường tới mục tiêu</h1>
        <p>Chọn mục tiêu mới ở <a href="/lo-trinh">Lộ trình</a>, hoặc chốt lại buổi hôm nay.</p>
        <button className="lon" onClick={() => qua('chot')}>Chốt lại</button>
      </>
    );
  } else if (buoi.buoc === 'chot') {
    noiDung = (
      <>
        <p className="nhan-muc xanh">Chốt lại</p>
        {kn ? <GiaiThichLai khaiNiem={kn.id} ten={kn.ten} yChinh={kn.yChinh ?? []} /> : <p>Hôm nay không học khái niệm mới.</p>}
        <div className="nut-cuoi"><button className="lon" onClick={() => qua('xong')}>Xem tổng kết</button></div>
      </>
    );
  } else {
    const t = doc();
    const mucTieu = ds.some((k) => k.id === t.mucTieu) ? t.mucTieu! : MUC_TIEU_MAC_DINH;
    const soBuoi = tuan(t, new Date()).filter((x) => x > 0).length;
    const can = mucTieuTuan(t);
    const sau = baiTiepTheo(t, ds, mucTieu);
    noiDung = (
      <>
        <p className="nhan-muc xanh">Xong buổi học · {Math.max(1, Math.round((Date.now() - buoi.batDau) / 60000))} phút</p>
        <h1>{soBuoi >= can ? 'Tuần này đạt kế hoạch' : `Tuần này ${soBuoi}/${can} buổi`}</h1>
        <p className="mo">Chuỗi: <b>{chuoiTuan(t).tuan} tuần</b> liền đạt kế hoạch.</p>
        <section className="the">
          <div className="hang-tong-ket"><span>Ôn tập</span><b>{buoi.on.tong ? `${buoi.on.dung}/${buoi.on.tong} đúng` : 'Không có câu đến hạn'}</b></div>
          {kn && <div className="hang-tong-ket"><span>{kn.ten}</span><b>{TEN_MUC_DO[mucDo(t, kn.khoa)]}</b></div>}
          {kn && <div className="hang-tong-ket"><span>Giải thích lại</span><b>{t.giaiThich[kn.id] ? 'Đã viết' : 'Chưa viết'}</b></div>}
        </section>
        {sau && (
          <section className="the" style={{ background: 'var(--nhan-nhat)', borderColor: 'transparent' }}>
            <p className="nhan-muc xanh">Buổi sau bắt đầu tại</p>
            <b style={{ fontSize: 17 }}>{sau.ten}</b>
            <p className="mo" style={{ margin: '4px 0 0' }}>Mở trang Hôm nay là vào thẳng, khỏi phải nghĩ học gì.</p>
          </section>
        )}
        <div className="nut-cuoi">
          <button className="phu lon" onClick={async () => { try { await navigator.clipboard.writeText(baoCaoTuan(t, ds, mucTieu)); setDaChep(true); } catch {} }}>
            {daChep ? 'Đã chép ✓' : 'Sao chép báo cáo tuần'}
          </button>
          <button className="lon" onClick={thoat}>Xong, nghỉ thôi</button>
        </div>
      </>
    );
  }

  return (
    <>
      <ThanhTienTrinh buoi={buoi} phut={phut} onThoat={thoat} />
      <div className="buoi-hoc">{noiDung}</div>
    </>
  );
}
