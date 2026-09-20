"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Button from "@/components/common/Button";
import GoldCard from "@/components/common/GoldCard";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB, calcWithdrawNet, WITHDRAW_FEE } from "@/utils/formatters";

/** SCREEN_8 — ถอนเงินสำเร็จ */
function WithdrawSuccessInner() {
  const params = useSearchParams();
  const amount = Number(params.get("amount") ?? 1000);
  const ref = params.get("ref") ?? "REF-98824103";
  const { cashBalance } = useWalletStore();
  const net = calcWithdrawNet(amount);

  return (
    <main className="flex min-h-screen flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">09:41</p>
        <p className="text-sm font-bold text-espresso">ทำรายการสำเร็จ</p>
        <div className="w-8" />
      </div>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] shadow-[0_6px_20px_rgba(184,134,11,0.3)]">
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-espresso">ถอนเงินสำเร็จ</p>
        <p className="text-xs text-secondary">ระบบกำลังโอนเงินเข้าบัญชีปลายทางของคุณอย่างปลอดภัย</p>
      </div>
      <p className="financial-digits text-center text-3xl font-extrabold text-emerald">{formatTHB(net)} THB</p>
      <GoldCard className="space-y-2 p-4 text-sm">
        <div className="flex justify-between"><span className="text-secondary">บัญชีปลายทาง</span><b className="text-espresso">KBANK 724-2-xxxxx-3</b></div>
        <div className="flex justify-between"><span className="text-secondary">ยอดถอน</span><b className="financial-digits text-espresso">{formatTHB(amount)} THB</b></div>
        <div className="flex justify-between"><span className="text-secondary">ค่าธรรมเนียม</span><b className="financial-digits text-aus-red">-{formatTHB(WITHDRAW_FEE)} THB</b></div>
        <div className="flex justify-between"><span className="text-secondary">วันที่และเวลา</span><b className="text-espresso">19 ก.ย. 2569, 15:30 น.</b></div>
        <div className="flex justify-between"><span className="text-secondary">รหัสอ้างอิง</span><b className="text-espresso">{ref}</b></div>
      </GoldCard>
      <GoldCard className="p-4 text-center">
        <p className="text-xs text-secondary">ยอดเงินคงเหลือใหม่ (โอนอัตโนมัติ 1-3 นาที)</p>
        <p className="financial-digits text-xl font-extrabold text-espresso">฿{formatTHB(cashBalance)} THB</p>
      </GoldCard>
      <Button variant="champagne" className="w-full">📥 บันทึกสลิป E-Receipt</Button>
      <Link href="/"><Button className="w-full">กลับสู่หน้าหลัก ➔</Button></Link>
    </main>
  );
}

export default function WithdrawSuccessPage() {
  return (
    <Suspense>
      <WithdrawSuccessInner />
    </Suspense>
  );
}
