"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";
import QuickChips from "@/components/wallet/QuickChips";
import AmountSlider from "@/components/wallet/AmountSlider";
import ProcessingModal from "@/components/modals/ProcessingModal";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB, calcWithdrawNet, WITHDRAW_FEE } from "@/utils/formatters";

/** SCREEN_10 — ระบุรายการถอนเงิน */
export default function WithdrawPage() {
  const router = useRouter();
  const { cashBalance, withdraw } = useWalletStore();
  const [amount, setAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);
  const valid = amount >= 100 && amount <= Math.min(cashBalance, 2000000);
  const net = calcWithdrawNet(amount);

  const submit = () => {
    if (!valid) return;
    setProcessing(true);
    setTimeout(() => {
      const ref = `REF-${Math.floor(10000000 + Math.random() * 89999999)}`;
      withdraw(amount, ref);
      setProcessing(false);
      router.push(`/wallet/withdraw/success?amount=${amount}&ref=${encodeURIComponent(ref)}`);
    }, 1500);
  };

  return (
    <>
      <TopAppBar
        title="รายการถอนเงิน"
        showBack
        rightSlot={<Link href="/history" className="text-xs font-semibold text-burgundy">ประวัติ ›</Link>}
      />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <GoldCard className="p-4">
          <p className="text-xs text-secondary">ยอดเงินคงเหลือ (พร้อมถอนทันที)</p>
          <p className="financial-digits mt-1 text-2xl font-extrabold text-espresso">฿{formatTHB(cashBalance)} THB</p>
        </GoldCard>

        <GoldCard className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-bold text-espresso">ธนาคารกสิกรไทย (KBANK)</p>
            <p className="text-xs text-secondary">724-2-xxxxx-3 · นายสมชาย มั่งคั่งกิจ</p>
          </div>
          <ArrowLeftRight size={20} className="text-gold-dark" />
        </GoldCard>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-espresso">จำนวนเงิน</p>
            <button onClick={() => setAmount(Math.floor(cashBalance))} className="text-xs font-bold text-burgundy">
              ถอนทั้งหมด
            </button>
          </div>
          <input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="financial-digits min-h-[52px] w-full rounded-xl border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-4 text-xl font-bold text-espresso focus:border-gold focus:outline-none"
          />
          <div className="mt-3"><QuickChips options={[100, 500, 1000, 5000]} value={amount} onPick={setAmount} /></div>
          <div className="mt-3"><AmountSlider min={100} max={Math.max(100, Math.floor(cashBalance))} value={amount} onChange={setAmount} /></div>
        </div>

        <GoldCard className="space-y-1 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">ค่าธรรมเนียมการโอน</span>
            <b className="financial-digits text-aus-red">-{formatTHB(WITHDRAW_FEE)} THB</b>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">ยอดเงินที่จะได้รับสุทธิ</span>
            <b className="financial-digits text-lg text-emerald">฿{formatTHB(net)} THB</b>
          </div>
        </GoldCard>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="champagne" onClick={() => router.back()}>ยกเลิก</Button>
          <Button disabled={!valid} onClick={submit}>ยืนยันการถอนเงิน</Button>
        </div>
      </main>
      {processing && <ProcessingModal />}
    </>
  );
}
