"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";
import QuickChips from "@/components/wallet/QuickChips";
import AmountSlider from "@/components/wallet/AmountSlider";
import PlanSummaryModal from "@/components/modals/PlanSummaryModal";
import { useGoldStore } from "@/stores/useGoldStore";
import { calcGoldGrams, formatGoldGrams } from "@/utils/formatters";
import type { DcaChannel, DcaFrequency, DcaSession } from "@/types/goldPlan";

/** SCREEN_20 — กรอกข้อมูลสร้างแผน + SCREEN_18 สรุป */
export default function CreatePlanPage() {
  const router = useRouter();
  const { sellPricePerGram, addPlan } = useGoldStore();
  const [frequency, setFrequency] = useState<DcaFrequency>("monthly");
  const [session, setSession] = useState<DcaSession>("DAY");
  const [amount, setAmount] = useState(400);
  const [channel, setChannel] = useState<DcaChannel>("cash");
  const [showSummary, setShowSummary] = useState(false);

  const valid = amount >= 100;
  const estGrams = formatGoldGrams(calcGoldGrams(amount, sellPricePerGram));

  const confirm = () => {
    addPlan({ id: `p-${Date.now()}`, amountTHB: amount, frequency, session, channel, active: true });
    router.push("/savings");
  };

  return (
    <>
      <TopAppBar title="สร้างแผนออม" showBack />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <div className="flex items-start gap-2 rounded-2xl bg-[#FFF9E6] p-3 text-xs text-espresso">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-gold-dark" />
          ระบบออมอัตโนมัติอัจฉริยะ — เงินไม่พอจะข้ามรอบโดยไม่มีค่าปรับ
        </div>

        <GoldCard className="p-4">
          <p className="text-sm font-bold text-espresso">รอบการออม</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["daily", "weekly", "monthly"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`min-h-[44px] rounded-full border-[1.5px] text-sm font-semibold ${frequency === f ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"}`}
              >
                {f === "daily" ? "รายวัน" : f === "weekly" ? "รายสัปดาห์" : "รายเดือน"}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["DAY", "NIGHT"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSession(s)}
                className={`min-h-[44px] rounded-full border-[1.5px] text-sm font-semibold ${session === s ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"}`}
              >
                {s === "DAY" ? "กลางวัน" : "กลางคืน"}
              </button>
            ))}
          </div>
        </GoldCard>

        <GoldCard className="p-4">
          <p className="text-sm font-bold text-espresso">ระบุยอดออม</p>
          <input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="financial-digits mt-2 min-h-[44px] w-full rounded-lg border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-3 text-lg font-bold text-espresso focus:border-gold focus:outline-none"
          />
          <div className="mt-3">
            <AmountSlider min={100} max={50000} value={amount} onChange={setAmount} />
          </div>
          <div className="mt-3">
            <QuickChips options={[100, 500, 1000, 5000]} value={amount} onPick={setAmount} />
          </div>
          <p className="financial-digits mt-2 text-sm text-secondary">≈ {estGrams} กรัม/ครั้ง</p>
        </GoldCard>

        <GoldCard className="p-4">
          <p className="text-sm font-bold text-espresso">ช่องทางการตัดเงิน</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setChannel("cash")}
              className={`min-h-[44px] rounded-xl border-[1.5px] p-2 text-left text-sm font-semibold ${channel === "cash" ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"}`}
            >
              บัญชีเงินสด
              <span className="block text-[11px] font-normal">Cash Wallet</span>
            </button>
            <button
              onClick={() => setChannel("ats")}
              className={`min-h-[44px] rounded-xl border-[1.5px] p-2 text-left text-sm font-semibold ${channel === "ats" ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"}`}
            >
              บัญชีอัตโนมัติ
              <span className="block text-[11px] font-normal">ATS กสิกรไทย</span>
            </button>
          </div>
        </GoldCard>

        <Button disabled={!valid} onClick={() => setShowSummary(true)}>
          ดูสรุปแผน
        </Button>
      </main>

      {showSummary && (
        <PlanSummaryModal
          frequency={frequency}
          session={session}
          amount={amount}
          channel={channel}
          estGrams={estGrams}
          onEdit={() => setShowSummary(false)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
