import { useEffect, useState } from 'react';
import { chuoiTuan, denHan, doc, duBaoOn, mucTieuTuan, ngayHocCuoi, ngayKey, theoDoi, tuan, type TienDo } from '../tien-do';
import { baiTiepTheo, baoCaoTuan, duongHoc, mucDoKN, MUC_TIEU_MAC_DINH, TEN_THU, type KhaiNiemDL } from '../do-thi';
import { soCauOn, laQuayLai } from './buoi';

const TEN_MUC: Record<string, string> = { 'chua-hoc': 'Chưa học', 'da-thu': 'Đã thử', hieu: 'Hiểu', vung: 'Vững', 'chua-co': 'Sắp có' };

export default function HomNay({ ds }: { ds: KhaiNiemDL[] }) {
  const [td, setTd] = useState<TienDo | null>(null);
  const [daChep, setDaChep] = useState(false);
  useEffect(() => { setTd(doc()); return theoDoi(() => setTd(doc())); }, []);

  if (!td) return <p className="mo">Đang tải tiến độ…</p>;

  const now = new Date();
  const tatCaKhoa = ds.flatMap((k) => k.khoa);
  const mucTieu = ds.some((k) => k.id === td.mucTieu) ? td.mucTieu! : MUC_TIEU_MAC_DINH;
  const tenMucTieu = ds.find((k) => k.id === mucTieu)?.ten ?? mucTieu;
  const kh = td.keHoach;
  const phut = kh?.phut ?? 25;
  const hanOn = denHan(td, tatCaKhoa).length;
  const quayLai = laQuayLai(td, now);
  const soOn = soCauOn(hanOn, phut, quayLai);
  const tiep = baiTiepTheo(td, ds, mucTieu);
  const duong = duongHoc(ds, mucTieu);
  const dem = { vung: 0, hieu: 0 };
  duong.forEach((k) => { const m = mucDoKN(td, k); if (m === 'vung' || m === 'hieu') dem[m]++; });
  const ngayTuan = tuan(td, now);
  const homNayThu = (now.getDay() + 6) % 7;
  const soBuoi = ngayTuan.filter((x) => x > 0).length;
  const can = mucTieuTuan(td);
  const chuoi = chuoiTuan(td, now);
  const duBao = duBaoOn(td, tatCaKhoa, now);
  const maxDuBao = Math.max(1, ...duBao);
  const cuoi = ngayHocCuoi(td);
  const conLai = duong.filter((k) => !['hieu', 'vung'].includes(mucDoKN(td, k))).slice(0, 4);

  const chep = async () => {
    try { await navigator.clipboard.writeText(baoCaoTuan(td, ds, mucTieu, now)); setDaChep(true); } catch {}
  };

  return (
    <div className="hom-nay">
      <header className="hang" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="mo" style={{ margin: 0 }}>
            {now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            {kh ? ` · Kế hoạch: ${kh.phut} phút, ${kh.sauViec || `lúc ${kh.gio}`}` : ''}
          </p>
          <h1 style={{ margin: '4px 0 0' }}>{quayLai ? 'Mừng bạn quay lại' : 'Hôm nay học gì?'}</h1>
        </div>
        <a href="/ke-hoach">{kh ? 'Sửa kế hoạch' : 'Lập kế hoạch học (1 phút)'}</a>
      </header>

      <div className="luoi-hom-nay">
        <section className="the rong-2" aria-labelledby="tieu-de-buoi">
          <div className="hang" style={{ justifyContent: 'space-between' }}>
            <div>
              <p className="nhan-muc">Buổi học hôm nay</p>
              <h2 id="tieu-de-buoi" style={{ margin: '4px 0 0', fontSize: 28 }}>{phut} phút, chia 3 bước</h2>
            </div>
            <span className="muc-do hieu">Mục tiêu: {tenMucTieu}</span>
          </div>
          {quayLai && cuoi && (
            <p className="goi-y" style={{ marginTop: 14 }}>
              Lần học trước: {cuoi.split('-').reverse().join('/')}. Nghỉ một thời gian là bình thường — hôm nay chỉ ôn {soOn} câu dễ quên nhất,
              phần còn lại để các buổi sau.
            </p>
          )}
          <ol className="buoc-buoi">
            <li>
              <span className="nhan-muc xanh">1 · Khởi động</span>
              <b>{soOn ? `Ôn ${soOn} câu đến hạn` : 'Không có câu cần ôn'}</b>
              <span className="mo" style={{ fontSize: 14 }}>{soOn ? 'Nhớ lại trước, rồi mới học mới.' : 'Bỏ qua, vào học luôn.'}</span>
            </li>
            <li>
              <span className="nhan-muc xanh">2 · Học mới</span>
              <b>{tiep ? tiep.ten : 'Đã đi hết đường tới mục tiêu'}</b>
              <span className="mo" style={{ fontSize: 14 }}>{tiep ? 'Chế độ tập trung, đoán trước rồi chạy.' : <a href="/lo-trinh">Chọn mục tiêu mới</a>}</span>
            </li>
            <li>
              <span className="nhan-muc xanh">3 · Chốt lại</span>
              <b>Giải thích lại bằng lời của bạn</b>
              <span className="mo" style={{ fontSize: 14 }}>3–5 câu, không nhìn lại bài.</span>
            </li>
          </ol>
          <div className="hang">
            <a className="nut lon" href="/buoi-hoc">Bắt đầu buổi học</a>
            <a className="nut phu lon" href="/buoi-hoc?nhanh=1">Bận? Chỉ ôn 5 phút</a>
            <span className="mo" style={{ fontSize: 14 }}>Ôn nhanh vẫn được tính một buổi.</span>
          </div>
        </section>

        <section className="the" aria-labelledby="tieu-de-nhip">
          <p className="nhan-muc" id="tieu-de-nhip">Nhịp tuần</p>
          <div className="hang" style={{ alignItems: 'baseline', marginTop: 8 }}>
            <span className="so-lon">{soBuoi}/{can}</span>
            <span className="mo">buổi tuần này</span>
          </div>
          <div className="o-ngay" role="list">
            {TEN_THU.map((t, i) => (
              <div key={t} role="listitem" aria-label={`${t}: ${ngayTuan[i] ? `${ngayTuan[i]} câu` : 'chưa học'}`}>
                {t}
                <span className={`o ${ngayTuan[i] ? 'co' : ''} ${i === homNayThu ? 'hom-nay' : ''}`} />
              </div>
            ))}
          </div>
          <div className="chuoi">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: 'var(--nhap)' }}><rect x="3" y="4" width="16" height="15" rx="2" /><path d="M3 9h16M8 2v4M14 2v4M8 14l2 2 4-4" /></svg>
            <span>{chuoi.tuan ? <><b>{chuoi.tuan} tuần liền</b> đạt kế hoạch</> : 'Đạt kế hoạch tuần này để bắt đầu chuỗi'}</span>
          </div>
          <p className="mo" style={{ fontSize: 13, marginBottom: 0 }}>
            {chuoi.dungPhep ? 'Tuần trước bị lỡ nhưng chuỗi vẫn còn nhờ tuần nghỉ phép. ' : ''}
            Mỗi 4 tuần có 1 tuần nghỉ phép: lỡ một tuần không làm đứt chuỗi.
          </p>
        </section>
      </div>

      <div className="luoi-hom-nay">
        <section className="the" aria-labelledby="tieu-de-muc-tieu">
          <div className="hang" style={{ justifyContent: 'space-between' }}>
            <p className="nhan-muc" id="tieu-de-muc-tieu">Tiến tới mục tiêu</p>
            <a href="/lo-trinh" style={{ fontSize: 14 }}>Xem bản đồ</a>
          </div>
          <b style={{ fontSize: 17 }}>{tenMucTieu}</b>
          <div className="thanh" role="img" aria-label={`${dem.vung} Vững, ${dem.hieu} Hiểu trên ${duong.length} khái niệm`}>
            <span style={{ width: `${(100 * dem.vung) / duong.length}%`, background: 'var(--nhan)' }} />
            <span style={{ width: `${(100 * dem.hieu) / duong.length}%`, background: 'var(--hieu)' }} />
          </div>
          <p className="mo" style={{ fontSize: 14, margin: '0 0 12px' }}>{dem.vung} Vững · {dem.hieu} Hiểu · {duong.length - dem.vung - dem.hieu} còn lại</p>
          <ul className="danh-sach-gon">
            {conLai.map((k) => {
              const m = mucDoKN(td, k);
              return (
                <li key={k.id}>
                  {k.coTrang ? <a href={`/khai-niem/${k.id}`}>{k.ten}</a> : <span className="mo">{k.ten}</span>}
                  <span className={`muc-do ${m}`}>{TEN_MUC[m]}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="the" aria-labelledby="tieu-de-du-bao">
          <p className="nhan-muc" id="tieu-de-du-bao">Lịch ôn 7 ngày tới</p>
          <div className="cot-du-bao" role="list">
            {duBao.map((n, i) => {
              const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
              const nhan = i === 0 ? 'Nay' : TEN_THU[(d.getDay() + 6) % 7];
              return (
                <div key={ngayKey(d)} role="listitem" aria-label={`${nhan}: ${n} câu`}>
                  <b>{n}</b>
                  <span className="cot" style={{ height: `${(80 * n) / maxDuBao}%` }} />
                  <span className="mo">{nhan}</span>
                </div>
              );
            })}
          </div>
          <p className="mo" style={{ fontSize: 13, margin: 0 }}>Biết trước ngày nào nhiều câu để không bị dồn. Học thêm khái niệm mới sẽ làm các cột sau cao hơn.</p>
        </section>

        <section className="the" aria-labelledby="tieu-de-nhom">
          <p className="nhan-muc" id="tieu-de-nhom">Học cùng nhóm</p>
          <div className="bao-cao">{baoCaoTuan(td, ds, mucTieu, now)}</div>
          <button className="phu" onClick={chep}>{daChep ? 'Đã chép ✓' : 'Sao chép gửi nhóm chat'}</button>
          <p className="mo" style={{ fontSize: 13, marginBottom: 0 }}>Không có bảng xếp hạng. Chỉ kể mình đã học gì để cả nhóm cùng giữ nhịp.</p>
        </section>
      </div>
    </div>
  );
}
