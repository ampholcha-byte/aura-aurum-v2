"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Button from "@/components/common/Button";
import GoldCard from "@/components/common/GoldCard";
import { useGoldStore } from "@/stores/useGoldStore";
import { formatGoldGrams } from "@/utils/formatters";

/** ใบรับคำขอรับทอง */
function RedeemSuccessInner() {
  const params = useSearchParams();
  const grams = Number(params.get("grams") ?? 0.06);
  const method = params.get("method") === "pickup" ? "รับที่สาขา" : "จัดส่งถึงบ้าน";
  const dest = params.get("dest") ?? "-";
  const phone = params.get("phone");
  const ref = params.get("ref") ?? "RDM-00000000";
  const { goldGrams } = useGoldStore();

  return (
    <main className="flex min-h-screen flex-col gap-4 px-4 py-6">
      <p className="text-center text-sm font-bold text-espresso">คำขอรับทอง</p>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] shadow-[0_6px_20px_rgba(184,134,11,0.3)]">
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-espresso">รับคำขอเรียบร้อย</p>
        <p className="text-xs text-secondary">เจ้าหน้าที่จะติดต่อยืนยันก่อนจัดส่ง/นัดรับ</p>
      </div>
      <p className="financial-digits text-center text-3xl font-extrabold text-espresso">
        {formatGoldGrams(grams)} <span className="text-sm">กรัม</span>
      </p>
      <GoldCard className="space-y-2 p-4 text-sm">
        <div className="flex justify-between"><span className="text-secondary">วิธีรับทอง</span><b className="text-espresso">{method}</b></div>
        <div className="flex justify-between gap-4"><span className="shrink-0 text-secondary">สถานที่</span><b className="text-right text-espresso">{dest}</b></div>
        {phone && (
          <div className="flex justify-between"><span className="text-secondary">เบอร์ติดต่อผู้รับ</span><b className="financial-digits text-espresso">{phone}</b></div>
        )}
        <div className="flex justify-between"><span className="text-secondary">รหัสอ้างอิง</span><b className="text-espresso">{ref}</b></div>
      </GoldCard>
      <GoldCard className="p-4 text-center">
        <p className="text-xs text-secondary">ทองคงเหลือ</p>
        <p className="financial-digits text-xl font-extrabold text-espresso">{formatGoldGrams(goldGrams)} กรัม</p>
      </GoldCard>
      <Link href="/"><Button className="w-full">กลับสู่หน้าหลัก ➔</Button></Link>
      <Link href="/savings"><Button variant="champagne" className="w-full">กลับไปหน้าออมทอง</Button></Link>
    </main>
  );
}

export default function RedeemSuccessPage() {
  return (
    <Suspense>
      <RedeemSuccessInner />
    </Suspense>
  );
}
