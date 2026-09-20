"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import Button from "@/components/common/Button";
import GoldCard from "@/components/common/GoldCard";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB } from "@/utils/formatters";

/** SCREEN_12 — ฝากเงินสำเร็จ (Transaction Receipt) */
function DepositSuccessInner() {
  const params = useSearchParams();
  const amount = Number(params.get("amount") ?? 1000);
  const ref = params.get("ref") ?? "REF 98824103";
  const { cashBalance } = useWalletStore();

  return (
    <main className="flex min-h-screen flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl text-espresso">✕</Link>
        <p className="text-sm font-bold text-espresso">Transaction Receipt</p>
        <div className="w-6" />
      </div>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] shadow-[0_6px_20px_rgba(184,134,11,0.3)]">
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-espresso">ทำรายการสำเร็จ</p>
        <p className="text-xs text-secondary">ยอดเงินถูกเพิ่มเข้าสู่ Cash Wallet เรียบร้อยแล้ว</p>
      </div>
      <p className="financial-digits text-center text-3xl font-extrabold text-espresso">
        {formatTHB(amount)} <span className="text-sm">บาท</span>
      </p>
      <GoldCard className="space-y-2 p-4 text-sm">
        <div className="flex justify-between"><span className="text-secondary">ช่องทาง</span><b className="text-espresso">QR Payment</b></div>
        <div className="flex justify-between"><span className="text-secondary">วันที่เวลา</span><b className="text-espresso">19 ก.ย. 2569, 15:30 น.</b></div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">รหัสอ้างอิง {ref}</span>
          <Copy size={16} className="text-gold-dark" />
        </div>
      </GoldCard>
      <GoldCard className="p-4 text-center">
        <p className="text-xs text-secondary">ยอดคงเหลือใหม่</p>
        <p className="financial-digits text-xl font-extrabold text-emerald">฿{formatTHB(cashBalance)} (+฿{formatTHB(amount)})</p>
      </GoldCard>
      <Link href="/"><Button className="w-full">กลับสู่หน้าหลัก ➔</Button></Link>
      <Button variant="champagne" className="w-full">📥 บันทึกสลิป e-Receipt</Button>
    </main>
  );
}

export default function DepositSuccessPage() {
  return (
    <Suspense>
      <DepositSuccessInner />
    </Suspense>
  );
}
