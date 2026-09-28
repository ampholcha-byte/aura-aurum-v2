"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  /** ราคาทองคำแท่ง (บาททอง) จาก store */
  barBuy: number;
  barSell: number;
  /** ราคาทองรูปพรรณ (บาททอง) — mock ตามสไตล์สมาคม */
  ornBuy?: number;
  ornSell?: number;
  /** การเปลี่ยนแปลงประจำวัน (บาท) บวก = ขึ้น */
  change?: number;
  /** เวลาประกาศล่าสุด + รอบ */
  announcedAt?: string;
};

const STORAGE_KEY = "deeggold-price-announce-dismissed";

/** วันที่วันนี้รูปแบบ YYYY-MM-DD (เทียบกับวันที่เก็บไว้ใน localStorage) */
const todayKey = () => new Date().toISOString().slice(0, 10);

/** ป๊อปอัปประกาศราคาทองสมาคม — เปิดอัตโนมัติหน้าแรก (ข้ามได้ 1 วันผ่าน localStorage) */
export default function GoldPriceAnnouncementModal({
  barBuy,
  barSell,
  ornBuy = 48150,
  ornSell = 50150,
  change = 50,
  announcedAt = "เวลา 16:02 น. (รอบที่ 19)",
}: Props) {
  const [open, setOpen] = useState(false);
  const [skipToday, setSkipToday] = useState(false);

  // เปิดหลัง mount เท่านั้น เพื่ออ่าน localStorage โดยไม่ชน hydration
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== todayKey()) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const close = () => {
    if (skipToday) {
      try {
        localStorage.setItem(STORAGE_KEY, todayKey());
      } catch {
        /* localStorage ใช้ไม่ได้ — ปิดอย่างเดียว */
      }
    }
    setOpen(false);
  };

  if (!open) return null;

  const dateLabel = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows: [string, number, number][] = [
    ["ทองคำแท่ง 96.5%", barBuy, barSell],
    ["ทองรูปพรรณ 96.5%", ornBuy, ornSell],
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ประกาศราคาทองสมาคม"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-[390px] overflow-hidden rounded-2xl border-[1.5px] border-gold bg-[#FFFDF8] shadow-[0_20px_60px_rgba(45,36,33,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ส่วนหัวแถบทอง */}
        <div className="relative bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_55%,#B8860B_100%)] px-4 py-3 text-center">
          <button
            aria-label="ปิดประกาศ"
            onClick={close}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-[#5C4308] transition active:scale-95"
          >
            <X size={18} />
          </button>
          <p className="pr-8 text-[13px] font-bold leading-snug text-[#3D2B06]">
            ราคารับซื้อ-ขายออก ตามประกาศสมาคมค้าทองคำ
          </p>
        </div>

        {/* ตารางราคา */}
        <div className="px-4 pt-3">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b-[1.5px] border-gold-border">
                <th className="pb-2 text-left text-[11px] font-semibold text-secondary">ประเภท</th>
                <th className="pb-2 text-[11px] font-semibold text-secondary">รับซื้อ</th>
                <th className="pb-2 text-[11px] font-semibold text-secondary">ขายออก</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, buy, sell]) => (
                <tr key={label} className="border-b border-gold-border/60">
                  <td className="py-2.5 text-left text-xs font-semibold text-espresso">{label}</td>
                  <td className="financial-digits py-2.5 text-sm font-extrabold text-espresso">
                    {buy.toLocaleString("th-TH")}
                  </td>
                  <td className="financial-digits py-2.5 text-sm font-extrabold text-burgundy">
                    {sell.toLocaleString("th-TH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* แถวสรุปผลประจำวัน */}
          <div className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-[#FFF9E6] py-1.5">
            <span className="financial-digits text-xs font-bold text-emerald">▲ +{change.toLocaleString("th-TH")}</span>
            <span className="text-xs text-secondary">บาททอง — เทียบประกาศรอบก่อน</span>
          </div>
        </div>

        {/* ท้ายตาราง: วันที่ + เวลาประกาศ */}
        <div className="px-4 pt-2.5 text-center">
          <p className="text-[11px] font-semibold text-espresso">{dateLabel}</p>
          <p className="financial-digits text-[11px] text-secondary">ประกาศ {announcedAt}</p>
        </div>

        {/* Checkbox + ปุ่มปิด */}
        <div className="px-4 pb-4 pt-3">
          <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2">
            <input
              type="checkbox"
              checked={skipToday}
              onChange={(e) => setSkipToday(e.target.checked)}
              className="h-4 w-4 accent-[#B8860B]"
            />
            <span className="text-xs font-medium text-secondary">ไม่ต้องแสดงอีกในวันนี้</span>
          </label>
          <button
            onClick={close}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_50%,#B8860B_100%)] text-sm font-semibold text-white transition active:scale-[0.98]"
          >
            ปิดประกาศ
          </button>
        </div>
      </div>
    </div>
  );
}
