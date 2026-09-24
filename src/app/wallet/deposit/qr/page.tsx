"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatTHB } from "@/utils/formatters";

/** SCREEN_14 — ชำระเงิน QR Payment (ฝากเงิน) */
function DepositQrInner() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = Number(params.get("amount") ?? 1000);
  const { deposit } = useWalletStore();
  const [secs, setSecs] = useState(598);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const paid = () => {
    const ref = `REF ${Math.floor(10000000 + Math.random() * 89999999)}`;
    deposit(amount, ref);
    router.push(`/wallet/deposit/success?amount=${amount}&ref=${encodeURIComponent(ref)}&channel=qr`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 px-4 py-6 text-center">
      <div className="w-full rounded-3xl border-2 border-gold bg-gradient-to-b from-[#1d2a5b] to-[#2c3f7f] p-5 text-white">
        <p className="text-sm font-bold text-[#F3C343]">Thai QR Payment</p>
        <div className="mx-auto mt-3 flex h-52 w-52 items-center justify-center rounded-2xl bg-white">
          <p className="px-6 text-xs text-secondary">QR Code<br />พร้อมเพย์</p>
        </div>
        <p className="mt-3 text-xs opacity-80">บริษัท ห้างทองเยาวราช ชินโกลด์ จำกัด</p>
        <p className="financial-digits mt-1 text-2xl font-extrabold">{formatTHB(amount)} THB</p>
        <p className="financial-digits mt-1 text-sm font-bold text-[#F3C343]">
          {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")} นาที
        </p>
      </div>
      <Button className="w-full" onClick={paid}>ชำระเสร็จแล้ว</Button>
      <Button variant="champagne" className="w-full" onClick={() => router.back()}>ปิดหน้าต่าง</Button>
    </main>
  );
}

export default function DepositQrPage() {
  return (
    <Suspense>
      <DepositQrInner />
    </Suspense>
  );
}
