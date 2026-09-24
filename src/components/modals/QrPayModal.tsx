"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { formatTHB } from "@/utils/formatters";

type Props = {
  amount: number;
  onPaid: () => void;
  onClose: () => void;
};

/** SCREEN_22 — QR Payment ชำระค่าทอง (นับถอยหลัง 10:00) */
export default function QrPayModal({ amount, onPaid, onClose }: Props) {
  const [secs, setSecs] = useState(600);
  const [saveHint, setSaveHint] = useState(false);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-[430px] rounded-t-3xl bg-white p-5 pb-8 text-center">
        <button
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-secondary"
        >
          <X size={20} />
        </button>
        <p className="text-base font-bold text-espresso">สแกน QR ชำระค่าทอง</p>
        <div className="mx-auto mt-4 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-gold bg-[#FFFDF8]">
          <p className="px-6 text-xs text-secondary">Thai QR Code<br />Biller ID · Ref</p>
        </div>
        <p className="financial-digits mt-3 text-xl font-extrabold text-espresso">
          {formatTHB(amount)} THB
        </p>
        <p className="financial-digits mt-1 text-sm font-bold text-aus-red">
          {mm}:{ss} นาที
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="champagne" onClick={() => setSaveHint(true)}>บันทึก QR Code</Button>
          <Button onClick={onPaid}>ชำระเสร็จแล้ว</Button>
        </div>
        {saveHint && (
          <p className="mt-2 text-xs text-secondary">ฟีเจอร์บันทึก QR Code ยังไม่เปิดใช้งานในเวอร์ชันนี้</p>
        )}
      </div>
    </div>
  );
}
