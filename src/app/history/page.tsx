"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Coins, Package, History } from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import BottomNav from "@/components/common/BottomNav";
import GoldCard from "@/components/common/GoldCard";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB, formatGoldGrams } from "@/utils/formatters";
import type { TxnType } from "@/types/transaction";

type TypeFilter = "all" | TxnType;
type TimeFilter = "all" | "7d" | "30d";

const DAY = 86_400_000;
const typeFilters: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "deposit", label: "ฝากเงิน" },
  { key: "withdraw", label: "ถอนเงิน" },
  { key: "saving", label: "ออมทอง" },
  { key: "redeem", label: "แลกทอง" },
];
const timeFilters: { key: TimeFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "7d", label: "7 วันล่าสุด" },
  { key: "30d", label: "30 วันล่าสุด" },
];

const typeStyle: Record<TxnType, { icon: typeof Coins; chip: string; amount: string }> = {
  deposit: { icon: ArrowDownToLine, chip: "bg-emerald/10 text-emerald", amount: "text-emerald" },
  withdraw: { icon: ArrowUpFromLine, chip: "bg-[#B31D1D]/10 text-aus-red", amount: "text-aus-red" },
  saving: { icon: Coins, chip: "bg-[#D4AF37]/15 text-[#8A6715]", amount: "text-[#8A6715]" },
  redeem: { icon: Package, chip: "bg-burgundy/10 text-burgundy", amount: "text-burgundy" },
};

/** ประวัติธุรกรรมทั้งหมด — กรองตามประเภท + ช่วงเวลา */
export default function HistoryPage() {
  const { transactions } = useWalletStore();
  const [type, setType] = useState<TypeFilter>("all");
  const [range, setRange] = useState<TimeFilter>("all");

  const filtered = useMemo(() => {
    const cutoff = range === "all" ? 0 : Date.now() - (range === "7d" ? 7 : 30) * DAY;
    return transactions.filter(
      (t) => (type === "all" || t.type === type) && t.timestamp >= cutoff
    );
  }, [transactions, type, range]);

  return (
    <>
      <TopAppBar title="ประวัติ" />
      <main className="flex flex-col gap-3 px-4 pb-6 pt-4">
        {/* ฟิลเตอร์ประเภท */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setType(f.key)}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-xs font-bold ${
                type === f.key
                  ? "text-white bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_50%,#B8860B_100%)]"
                  : "border-[1.5px] border-gold bg-[#FFFDF8] text-[#8A6715]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ฟิลเตอร์ช่วงเวลา */}
        <div className="grid grid-cols-3 gap-1 rounded-full bg-[#F5E5DC] p-1">
          {timeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setRange(f.key)}
              className={`min-h-[36px] rounded-full text-xs font-bold ${
                range === f.key ? "bg-white text-burgundy shadow" : "text-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-secondary">พบ {filtered.length} รายการ</p>

        {filtered.length === 0 ? (
          <GoldCard className="flex flex-col items-center gap-2 p-8 text-center">
            <History size={32} className="text-gold-dark" />
            <p className="text-sm font-semibold text-espresso">ไม่พบรายการในช่วงที่เลือก</p>
            <p className="text-xs text-secondary">ลองเปลี่ยนประเภทหรือช่วงเวลา</p>
          </GoldCard>
        ) : (
          filtered.map((t) => {
            const s = typeStyle[t.type];
            const Icon = s.icon;
            return (
              <GoldCard key={t.id} className="flex items-center gap-3 p-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${s.chip}`}>
                  <Icon size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-espresso">{t.title}</p>
                  <p className="text-[11px] text-secondary">
                    {t.createdAt}{t.ref ? ` · ${t.ref}` : ""}
                  </p>
                </div>
                {t.type === "redeem" ? (
                  <p className={`financial-digits text-sm font-bold ${s.amount}`}>
                    -{formatGoldGrams(t.grams ?? 0)} ก.
                  </p>
                ) : (
                  <p className={`financial-digits text-sm font-bold ${s.amount}`}>
                    {t.type === "withdraw" ? "-" : "+"}฿{formatTHB(t.amountTHB)}
                  </p>
                )}
              </GoldCard>
            );
          })
        )}
      </main>
      <BottomNav />
    </>
  );
}
