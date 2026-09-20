"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { calcGoldGrams } from "@/utils/formatters";
import { formatGoldGrams } from "@/utils/formatters";

type Props = {
  sellPricePerGram: number;
  cashBalance: number;
  onClose: () => void;
  onConfirm: (amount: number, channel: "cash" | "qr") => void;
};

/** SCREEN_26 — ป๊อปอัปทำรายการออมทอง */
export default function InstantBuyModal({ sellPricePerGram, cashBalance, onClose, onConfirm }: Props) {
  const [amount, setAmount] = useState(10000);
  const [channel, setChannel] = useState<"cash" | "qr">("cash");
  const grams = calcGoldGrams(amount, sellPricePerGram);
  const valid = amount >= 100 && (channel === "qr" || amount <= cashBalance);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-t-3xl bg-white p-5 pb-8">
        <p className="text-center text-base font-bold text-espresso">ออมทอง</p>

        <label className="mt-4 block text-xs font-semibold text-secondary">ประเภททอง</label>
        <select className="mt-1 min-h-[44px] w-full rounded-lg border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-3 text-sm text-espresso" defaultValue="96.5">
          <option value="96.5">ทองคำแท่ง 96.5%</option>
        </select>

        <label className="mt-4 block text-xs font-semibold text-secondary">จำนวนเงินออม (THB)</label>
        <input
          type="number"
          min={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="financial-digits mt-1 min-h-[44px] w-full rounded-lg border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-3 text-lg font-bold text-espresso focus:border-gold focus:outline-none"
        />
        <p className="financial-digits mt-1 text-sm text-secondary">
          ≈ {formatGoldGrams(grams)} กรัม
        </p>

        <p className="mt-4 text-xs font-semibold text-secondary">ช่องทางชำระเงิน</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["cash", "qr"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`min-h-[44px] rounded-full border-[1.5px] text-sm font-semibold ${
                channel === c ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"
              }`}
            >
              {c === "cash" ? "บัญชีเงินสด" : "QR Payment"}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="champagne" onClick={onClose}>ยกเลิก</Button>
          <Button disabled={!valid} onClick={() => onConfirm(amount, channel)}>
            ยืนยันออมทอง
          </Button>
        </div>
        {!valid && (
          <p className="mt-2 text-center text-xs text-aus-red">
            ยอดออมขั้นต่ำ 100 บาท{channel === "cash" ? " และไม่เกินยอดเงินสดคงเหลือ" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
