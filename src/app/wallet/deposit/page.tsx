"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopAppBar from "@/components/common/TopAppBar";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";
import QuickChips from "@/components/wallet/QuickChips";
import ProcessingModal from "@/components/modals/ProcessingModal";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB } from "@/utils/formatters";

type Channel = "qr" | "truemoney" | "ats";

/** SCREEN_16 — กรอกรายการฝากเงิน */
function DepositForm() {
  const router = useRouter();
  const { cashBalance, deposit } = useWalletStore();
  const [channel, setChannel] = useState<Channel>("qr");
  const [amount, setAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);
  const valid = amount >= 100 && amount <= 2000000;

  const submit = () => {
    if (!valid) return;
    if (channel === "qr") {
      router.push(`/wallet/deposit/qr?amount=${amount}`);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const ref = `REF ${Math.floor(10000000 + Math.random() * 89999999)}`;
      deposit(amount, ref);
      setProcessing(false);
      router.push(`/wallet/deposit/success?amount=${amount}&ref=${encodeURIComponent(ref)}`);
    }, 1500);
  };

  return (
    <>
      <TopAppBar
        title="รายการฝากเงิน"
        showBack
        rightSlot={<Link href="/history" className="text-xs font-semibold text-burgundy">ประวัติ ›</Link>}
      />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <GoldCard className="p-4">
          <p className="text-xs text-secondary">ยอดเงินคงเหลือใน Cash Wallet</p>
          <p className="financial-digits mt-1 text-2xl font-extrabold text-espresso">฿{formatTHB(cashBalance)}</p>
        </GoldCard>

        <div>
          <p className="mb-2 text-sm font-bold text-espresso">ช่องทางการฝากเงิน</p>
          <div className="flex flex-col gap-2">
            {([
              ["qr", "QR Payment (พร้อมเพย์ — แนะนำ)"],
              ["truemoney", "TrueMoney Wallet"],
              ["ats", "หักบัญชีธนาคารอัตโนมัติ"],
            ] as [Channel, string][]).map(([c, label]) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`min-h-[52px] rounded-xl border-[1.5px] px-4 text-left text-sm font-semibold ${channel === c ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-gold-border bg-white text-espresso"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-espresso">ระบุจำนวนเงิน</p>
          <input
            type="number"
            min={100}
            max={2000000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="financial-digits min-h-[52px] w-full rounded-xl border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-4 text-xl font-bold text-espresso focus:border-gold focus:outline-none"
          />
          <div className="mt-3">
            <QuickChips options={[100, 500, 1000, 5000, 10000]} value={amount} onPick={setAmount} />
          </div>
          <p className="mt-2 text-xs text-secondary">วงเงิน 100 – 2,000,000 บาท · ฟรีค่าธรรมเนียม</p>
        </div>

        <Button disabled={!valid} onClick={submit}>
          ดำเนินการฝากเงิน
        </Button>
      </main>
      {processing && <ProcessingModal />}
    </>
  );
}

export default function DepositPage() {
  return (
    <Suspense>
      <DepositForm />
    </Suspense>
  );
}
