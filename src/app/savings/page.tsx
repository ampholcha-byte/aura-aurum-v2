"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Info } from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import BottomNav from "@/components/common/BottomNav";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";
import InstantBuyModal from "@/components/modals/InstantBuyModal";
import ProcessingModal from "@/components/modals/ProcessingModal";
import QrPayModal from "@/components/modals/QrPayModal";
import { useWalletStore } from "@/stores/useWalletStore";
import { useGoldStore } from "@/stores/useGoldStore";
import { formatTHB, formatGoldGrams, calcGoldGrams } from "@/utils/formatters";

/** SCREEN_28 — แดชบอร์ดออมทอง */
export default function SavingsPage() {
  const { cashBalance, payForGold, logSaving, transactions } = useWalletStore();
  const { goldGrams, sellPricePerGram, plans, addGold } = useGoldStore();
  const [showBuy, setShowBuy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [qrAmount, setQrAmount] = useState<number | null>(null);

  const settleBuy = (amount: number, channel: "cash" | "qr") => {
    setShowBuy(false);
    if (channel === "qr") {
      setQrAmount(amount);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      payForGold(amount, `REF-${Date.now()}`);
      addGold(+calcGoldGrams(amount, sellPricePerGram).toFixed(4));
      setProcessing(false);
    }, 1500);
  };

  const settleQr = () => {
    if (qrAmount == null) return;
    const amount = qrAmount;
    setQrAmount(null);
    setProcessing(true);
    setTimeout(() => {
      logSaving(amount, `REF-${Date.now()}`);
      addGold(+calcGoldGrams(amount, sellPricePerGram).toFixed(4));
      setProcessing(false);
    }, 1500);
  };

  return (
    <>
      <TopAppBar title="ออมทอง" />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <GoldCard className="p-5 text-center">
          <p className="text-xs text-secondary">ทองสะสมทั้งหมด</p>
          <p className="financial-digits mt-1 text-3xl font-extrabold text-espresso">
            {formatGoldGrams(goldGrams)} <span className="text-sm">กรัม</span>
          </p>
          <Button className="mt-3 w-full" onClick={() => setShowBuy(true)}>
            <span className="inline-flex items-center gap-1"><Plus size={18} /> ออม</span>
          </Button>
        </GoldCard>

        <div className="flex items-start gap-2 rounded-2xl bg-[#FFF9E6] p-3 text-xs text-espresso">
          <Info size={16} className="mt-0.5 shrink-0 text-gold-dark" />
          โอนไปบัญชีทองคำเมื่อสะสมครบขั้นต่ำ 0.06 กรัม (ถอน / ขาย / นัดรับทองคำจริง)
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-espresso">แผนออมทอง</h2>
            <Link href="/savings/create-plan" className="text-xs font-semibold text-burgundy">
              + สร้างแผนออมใหม่
            </Link>
          </div>
          {plans.map((p) => (
            <GoldCard key={p.id} className="mb-2 flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-bold text-espresso">
                  {p.frequency === "monthly" ? "รายเดือน" : p.frequency === "weekly" ? "รายสัปดาห์" : "รายวัน"} · {formatTHB(p.amountTHB)} THB
                </p>
                <p className="text-[11px] text-secondary">
                  {p.session === "DAY" ? "กลางวัน" : "กลางคืน"} · {p.channel === "cash" ? "Cash Wallet" : "ATS"}
                </p>
              </div>
              <span className="rounded-full bg-emerald/10 px-2 py-1 text-[11px] font-bold text-emerald">ใช้งาน</span>
            </GoldCard>
          ))}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-espresso">ประวัติธุรกรรมล่าสุด</h2>
            <Link href="/history" className="text-xs font-semibold text-burgundy">ดูทั้งหมด ›</Link>
          </div>
          {transactions.slice(0, 3).map((t) => (
            <GoldCard key={t.id} className="mb-2 flex items-center justify-between p-3">
              <p className="text-sm font-semibold text-espresso">{t.title}</p>
              <p className={`financial-digits text-sm font-bold ${t.type === "withdraw" ? "text-aus-red" : "text-emerald"}`}>
                {t.type === "withdraw" ? "-" : "+"}฿{formatTHB(t.amountTHB)}
              </p>
            </GoldCard>
          ))}
        </section>
      </main>
      <BottomNav />

      {showBuy && (
        <InstantBuyModal
          sellPricePerGram={sellPricePerGram}
          cashBalance={cashBalance}
          onClose={() => setShowBuy(false)}
          onConfirm={settleBuy}
        />
      )}
      {processing && <ProcessingModal />}
      {qrAmount != null && (
        <QrPayModal amount={qrAmount} onPaid={settleQr} onClose={() => setQrAmount(null)} />
      )}
    </>
  );
}
