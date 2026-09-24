"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpFromLine, Package, History, ChevronRight, ShieldCheck, Check } from "lucide-react";
import BottomNav from "@/components/common/BottomNav";
import GoldCard from "@/components/common/GoldCard";
import { useWalletStore } from "@/stores/useWalletStore";
import { useGoldStore } from "@/stores/useGoldStore";
import { formatTHB, formatGoldGrams } from "@/utils/formatters";

const quickActions = [
  { href: "/wallet/deposit", label: "ฝากเงิน", sub: "Cash Wallet", icon: ArrowDownToLine },
  { href: "/wallet/withdraw", label: "ถอนเงิน", sub: "เข้าธนาคาร", icon: ArrowUpFromLine },
  { href: "/redeem", label: "ขอรับทอง", sub: "ส่งบ้าน/รับสาขา", icon: Package },
  { href: "/history", label: "ประวัติ", sub: "บัญชี & ออม", icon: History },
];

export default function Home() {
  const { cashBalance, transactions } = useWalletStore();
  const { goldGrams, sellPricePerGram, buyPricePerBaht, sellPricePerBaht } = useGoldStore();
  const goldValue = goldGrams * sellPricePerGram;
  const total = cashBalance + goldValue;

  return (
    <>
      {/* Top App Bar */}
      <header className="flex items-center gap-3 px-4 pt-4">
        {/* ตราเหรียญทอง DEEGGOLD (โลโก้จริง) */}
        <Image
          src="/deeggold-logo.png"
          alt="DEEGGOLD"
          width={44}
          height={44}
          priority
          className="h-11 w-11 shrink-0 drop-shadow-[0_4px_12px_rgba(122,15,26,0.25)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight text-espresso">ทองแท่ง 96.5%</p>
          <p className="text-[11px] font-semibold leading-tight text-[#8A6715]">By DEEGGOLD</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold text-emerald">
          <Check size={11} /> ยืนยันเบอร์โทรแล้ว
        </span>
        <button
          aria-label="โปรไฟล์"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] text-sm font-bold text-white shadow-[0_4px_14px_rgba(184,134,11,0.25)]"
        >
          สม
        </button>
      </header>

      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        {/* Live Gold Price Ticker: การ์ดคู่ซ้าย-ขวา + ป้ายสถานะกลาง */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-espresso">ราคาทองวันนี้</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              เปิด 24 ชม.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GoldCard className="p-3.5">
              <p className="text-[11px] font-semibold text-secondary">ราคารับซื้อ</p>
              <p className="financial-digits mt-1 text-xl font-extrabold text-espresso">
                ฿{buyPricePerBaht.toLocaleString("th-TH")}
              </p>
              <p className="financial-digits mt-1 text-[11px] font-bold text-aus-red">▲ +50</p>
              <p className="financial-digits mt-0.5 text-[10px] text-secondary">ต่อน้ำหนัก 15.244 กรัม</p>
            </GoldCard>
            <GoldCard className="p-3.5">
              <p className="text-[11px] font-semibold text-secondary">ราคาขายออก</p>
              <p className="financial-digits mt-1 text-xl font-extrabold text-burgundy">
                ฿{sellPricePerBaht.toLocaleString("th-TH")}
              </p>
              <p className="financial-digits mt-1 text-[11px] font-bold text-aus-red">▲ +50</p>
              <p className="financial-digits mt-0.5 text-[10px] text-secondary">ต่อน้ำหนัก 15.244 กรัม</p>
            </GoldCard>
          </div>
        </section>

        {/* Total Assets Hero Card */}
        <section className="rounded-2xl bg-gradient-to-br from-[#7A0F1A] to-[#660C15] p-5 text-white shadow-lg">
          <p className="text-xs opacity-80">มูลค่าสินทรัพย์รวม</p>
          <p className="financial-digits mt-1 text-3xl font-extrabold">
            {formatTHB(total)} <span className="text-sm font-medium">THB</span>
          </p>
          <p className="financial-digits mt-1 text-xs text-emerald-light">
            +{formatTHB(goldValue)} THB (+0.30%)
          </p>
          <Link
            href="/savings"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#F3C343]"
          >
            ดูรายละเอียด <ChevronRight size={16} />
          </Link>
        </section>

        {/* Quick Action Grid */}
        <section className="grid grid-cols-4 gap-2">
          {quickActions.map(({ href, label, sub, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border border-gold-border bg-white p-2 text-center shadow-[0_4px_20px_rgba(212,175,55,0.08)]"
            >
              <Icon size={22} className="text-gold-dark" />
              <span className="text-xs font-bold text-espresso">{label}</span>
              <span className="text-[10px] text-secondary">{sub}</span>
            </Link>
          ))}
        </section>

        {/* Dual Wallet */}
        <div className="grid gap-4 md:grid-cols-2">
        <GoldCard className="flex flex-col p-5">
          <div className="flex-grow">
            <p className="text-xs font-semibold text-secondary">Cash Wallet</p>
            <p className="financial-digits mt-1.5 text-2xl font-extrabold leading-tight text-espresso">
              ฿{formatTHB(cashBalance)}
              <span className="ml-1 text-sm font-semibold text-secondary">THB</span>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/wallet/deposit"
              className="flex min-h-[44px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_50%,#B8860B_100%)] text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              + ฝากเงิน
            </Link>
            <Link
              href="/wallet/withdraw"
              className="flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-gold bg-[#FFFDF8] text-sm font-semibold text-[#8A6715] transition active:scale-[0.98]"
            >
              ถอนเงิน
            </Link>
          </div>
        </GoldCard>

        <GoldCard className="flex flex-col p-5">
          <div className="flex-grow">
            <p className="text-xs font-semibold text-secondary">Gold Wallet</p>
            <p className="financial-digits mt-1.5 text-2xl font-extrabold leading-tight text-espresso">
              {formatGoldGrams(goldGrams)}
              <span className="ml-1 text-sm font-semibold text-secondary">กรัม</span>
            </p>
            <p className="financial-digits mt-0.5 text-xs text-secondary">
              ~฿{formatTHB(goldValue)} THB
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/redeem"
              className="flex min-h-[44px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_50%,#B8860B_100%)] text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              ขอรับทองแท่ง
            </Link>
            <Link
              href="/savings"
              className="flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-gold bg-[#FFFDF8] text-sm font-semibold text-[#8A6715] transition active:scale-[0.98]"
            >
              ประวัติการออม
            </Link>
          </div>
        </GoldCard>
        </div>

        {/* Trust Banner */}
        <div className="flex items-center gap-2 rounded-2xl bg-[#FFF9E6] p-3 text-xs text-espresso">
          <ShieldCheck size={20} className="shrink-0 text-gold-dark" />
          การันตีรับทองคำแท้ 100% ประกันภัยส่งตรงถึงบ้าน
        </div>

        {/* Recent Activity */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-espresso">รายการล่าสุด</h2>
            <Link href="/history" className="text-xs font-semibold text-burgundy">
              ดูทั้งหมด ›
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {transactions.slice(0, 3).map((t) => (
              <GoldCard key={t.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-semibold text-espresso">{t.title}</p>
                  <p className="text-[11px] text-secondary">{t.createdAt}</p>
                </div>
                <p
                  className={`financial-digits text-sm font-bold ${
                    t.type === "withdraw" ? "text-aus-red" : "text-emerald"
                  }`}
                >
                  {t.type === "withdraw" ? "-" : "+"}฿{formatTHB(t.amountTHB)}
                </p>
              </GoldCard>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
