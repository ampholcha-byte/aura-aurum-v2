"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, ShieldCheck, Truck, Store } from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import BottomNav from "@/components/common/BottomNav";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";
import ProcessingModal from "@/components/modals/ProcessingModal";
import { useGoldStore, MIN_REDEEM_GRAMS } from "@/stores/useGoldStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatGoldGrams, formatTHB } from "@/utils/formatters";

type Method = "delivery" | "pickup";

const branches = [
  "สาขาเยาวราช (สำนักงานใหญ่)",
  "สาขาเซ็นทรัลพระราม 9",
  "สาขาเมกาบางนา",
];

/** ค่าจัดส่ง + ประกันภัยเต็มมูลค่า (mock — ขึ้นกับมูลค่าทองที่แลก) */
const DELIVERY_FEE_THB = 35;

/** โมดูลขอรับทอง — ส่งบ้าน / รับสาขา (ขั้นต่ำ 0.06 กรัม) */
export default function RedeemPage() {
  const router = useRouter();
  const { goldGrams, sellPricePerGram, redeemGold } = useGoldStore();
  const { logRedeem } = useWalletStore();
  const [method, setMethod] = useState<Method>("delivery");
  const [grams, setGrams] = useState(MIN_REDEEM_GRAMS);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState(branches[0]);
  const [processing, setProcessing] = useState(false);

  const eligible = goldGrams >= MIN_REDEEM_GRAMS;
  const progress = Math.min(100, (goldGrams / MIN_REDEEM_GRAMS) * 100);
  const outOfRange = grams < MIN_REDEEM_GRAMS || grams > goldGrams;
  const deliveryFee = method === "delivery" ? DELIVERY_FEE_THB : 0;
  const goldValue = grams * sellPricePerGram;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = /^0\d{8,9}$/.test(phoneDigits);

  const valid =
    eligible &&
    grams >= MIN_REDEEM_GRAMS &&
    grams <= goldGrams &&
    (method === "pickup" || (address.trim().length >= 10 && phoneOk));

  const submit = () => {
    if (!valid) return;
    setProcessing(true);
    setTimeout(() => {
      const ref = `RDM-${Math.floor(10000000 + Math.random() * 89999999)}`;
      redeemGold(+grams.toFixed(4));
      logRedeem(+grams.toFixed(4), ref);
      setProcessing(false);
      const dest = method === "delivery" ? address.trim() : branch;
      const phoneQ = method === "delivery" ? `&phone=${encodeURIComponent(phoneDigits)}` : "";
      router.push(
        `/redeem/success?grams=${grams}&method=${method}&dest=${encodeURIComponent(dest)}${phoneQ}&ref=${ref}`
      );
    }, 1500);
  };

  return (
    <>
      <TopAppBar title="ขอรับทอง" />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <GoldCard className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-espresso">ทองสะสมของคุณ</p>
            <p className="financial-digits text-base font-extrabold text-espresso">
              {formatGoldGrams(goldGrams)} กรัม
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F5E5DC]">
            <div className="h-full rounded-full bg-[linear-gradient(135deg,#F3C343,#B8860B)]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-secondary">
            {eligible
              ? "ครบเกณฑ์แลกรับทองจริงแล้ว (ขั้นต่ำ 0.06 กรัม)"
              : `อีก ${formatGoldGrams(MIN_REDEEM_GRAMS - goldGrams)} กรัม จะครบขั้นต่ำ 0.06 กรัม`}
          </p>
          {!eligible && (
            <Link href="/savings">
              <Button className="mt-3 w-full">ออมทองเพิ่ม</Button>
            </Link>
          )}
        </GoldCard>

        {eligible && (
          <>
            <div>
              <p className="mb-2 text-sm font-bold text-espresso">วิธีรับทอง</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod("delivery")}
                  className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] text-sm font-semibold ${method === "delivery" ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-gold-border bg-white text-espresso"}`}
                >
                  <Truck size={20} /> ส่งถึงบ้าน
                </button>
                <button
                  onClick={() => setMethod("pickup")}
                  className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] text-sm font-semibold ${method === "pickup" ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-gold-border bg-white text-espresso"}`}
                >
                  <Store size={20} /> รับที่สาขา
                </button>
              </div>
            </div>

            <GoldCard className="p-4">
              <p className="text-sm font-bold text-espresso">น้ำหนักที่ต้องการแลก (กรัม)</p>
              <input
                type="number"
                min={MIN_REDEEM_GRAMS}
                max={goldGrams}
                step={0.0001}
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className={`financial-digits mt-2 min-h-[52px] w-full rounded-xl border-[1.5px] bg-[#FDFCFA] px-4 text-xl font-bold text-espresso focus:outline-none ${outOfRange ? "border-aus-red" : "border-[#E8D8BA] focus:border-gold"}`}
              />
              <p className="mt-1 text-[11px] text-secondary">
                แลกได้ {formatGoldGrams(MIN_REDEEM_GRAMS)} – {formatGoldGrams(goldGrams)} กรัม
              </p>
              {outOfRange && (
                <p className="mt-1 text-[11px] font-semibold text-aus-red">
                  กรุณาระบุน้ำหนักตั้งแต่ {formatGoldGrams(MIN_REDEEM_GRAMS)} ถึง {formatGoldGrams(goldGrams)} กรัม
                </p>
              )}
            </GoldCard>

            {method === "delivery" ? (
              <GoldCard className="p-4">
                <p className="text-sm font-bold text-espresso">ที่อยู่จัดส่ง (ประกันภัยคุ้มครอง)</p>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                  className="mt-2 w-full rounded-xl border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] p-3 text-sm text-espresso focus:border-gold focus:outline-none"
                />
                <label className="mt-3 block text-xs font-semibold text-secondary">เบอร์โทรศัพท์ผู้รับ</label>
                <div className="relative mt-1">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))}
                    placeholder="081-234-5678"
                    className={`financial-digits mt-0 min-h-[44px] w-full rounded-lg border-[1.5px] bg-[#FDFCFA] pl-9 pr-3 text-sm text-espresso focus:outline-none ${phone !== "" && !phoneOk ? "border-aus-red" : "border-[#E8D8BA] focus:border-gold"}`}
                  />
                </div>
                {phone !== "" && !phoneOk && (
                  <p className="mt-1 text-[11px] font-semibold text-aus-red">เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 081-234-5678)</p>
                )}
              </GoldCard>
            ) : (
              <GoldCard className="p-4">
                <p className="text-sm font-bold text-espresso">เลือกสาขารับทอง</p>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-lg border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-3 text-sm text-espresso"
                >
                  {branches.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </GoldCard>
            )}

            {/* สรุปค่าใช้จ่าย: มูลค่าทอง + ค่าจัดส่ง/ประกันภัย */}
            <GoldCard className="space-y-1 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">มูลค่าทองที่แลก</span>
                <b className="financial-digits text-espresso">฿{formatTHB(goldValue)} THB</b>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">{method === "delivery" ? "ค่าจัดส่ง + ประกันภัยเต็มมูลค่า" : "ค่าบริการรับที่สาขา"}</span>
                <b className={`financial-digits ${method === "delivery" ? "text-aus-red" : "text-emerald"}`}>
                  {method === "delivery" ? `-${formatTHB(deliveryFee)} THB` : "ฟรี"}
                </b>
              </div>
              <div className="mt-1 flex justify-between border-t border-[#F5E5DC] pt-1">
                <span className="font-semibold text-espresso">ยอดชำระเพิ่มเติม (เก็บปลายทาง)</span>
                <b className={`financial-digits ${method === "delivery" ? "text-aus-red" : "text-emerald"}`}>
                  {method === "delivery" ? `฿${formatTHB(deliveryFee)} THB` : "฿0.00 THB"}
                </b>
              </div>
            </GoldCard>

            <div className="flex items-start gap-2 rounded-2xl bg-[#FFF9E6] p-3 text-xs text-espresso">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-dark" />
              ทองคำแท้ 96.5% พร้อมใบรับประกัน · จัดส่งประกันภัยเต็มมูลค่า
            </div>

            <Button disabled={!valid} onClick={submit}>
              ยืนยันขอรับทอง {formatGoldGrams(grams)} กรัม
            </Button>
          </>
        )}
      </main>
      <BottomNav />
      {processing && <ProcessingModal />}
    </>
  );
}
