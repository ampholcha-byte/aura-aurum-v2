import { create } from "zustand";
import type { Transaction } from "@/types/transaction";

const DAY = 86_400_000;
const seedNow = Date.now();
const stampTH = "19 ก.ย. 2569, 15:30 น.";

type WalletState = {
  cashBalance: number;
  transactions: Transaction[];
  deposit: (amount: number, ref: string) => void;
  withdraw: (amount: number, ref: string) => void;
  /** ชำระค่าทองจาก Cash Wallet + บันทึกเป็น "ออมทอง" */
  payForGold: (amount: number, ref: string) => void;
  /** บันทึกออมทองที่จ่ายผ่าน QR (ไม่กระทบยอด Cash) */
  logSaving: (amount: number, ref: string) => void;
  /** บันทึกแลกทอง (หน่วยกรัม) */
  logRedeem: (grams: number, ref: string) => void;
};

const seedTxns: Transaction[] = [
  { id: "t1", type: "deposit", title: "ฝากเงิน", amountTHB: 1000, createdAt: "19 ก.ย. 2569, 15:30 น.", timestamp: seedNow, ref: "REF 98824103" },
  { id: "t2", type: "saving", title: "ออมทอง", amountTHB: 400, createdAt: "18 ก.ย. 2569, 09:00 น.", timestamp: seedNow - DAY, ref: "REF 98824011" },
  { id: "t3", type: "withdraw", title: "ถอนเงิน", amountTHB: 1000, createdAt: "17 ก.ย. 2569, 18:20 น.", timestamp: seedNow - 2 * DAY, ref: "REF-98824103" },
  { id: "t4", type: "redeem", title: "แลกทอง", amountTHB: 0, grams: 0.06, createdAt: "10 ก.ย. 2569, 11:00 น.", timestamp: seedNow - 9 * DAY, ref: "RDM-98110022" },
];

export const useWalletStore = create<WalletState>((set) => ({
  cashBalance: 30145.45,
  transactions: seedTxns,
  deposit: (amount, ref) =>
    set((s) => ({
      cashBalance: +(s.cashBalance + amount).toFixed(2),
      transactions: [
        { id: `d-${Date.now()}`, type: "deposit", title: "ฝากเงิน", amountTHB: amount, createdAt: stampTH, timestamp: Date.now(), ref },
        ...s.transactions,
      ],
    })),
  withdraw: (amount, ref) =>
    set((s) => ({
      cashBalance: +(s.cashBalance - amount).toFixed(2),
      transactions: [
        { id: `w-${Date.now()}`, type: "withdraw", title: "ถอนเงิน", amountTHB: amount, createdAt: stampTH, timestamp: Date.now(), ref },
        ...s.transactions,
      ],
    })),
  payForGold: (amount, ref) =>
    set((s) => ({
      cashBalance: +(s.cashBalance - amount).toFixed(2),
      transactions: [
        { id: `s-${Date.now()}`, type: "saving", title: "ออมทอง", amountTHB: amount, createdAt: stampTH, timestamp: Date.now(), ref },
        ...s.transactions,
      ],
    })),
  logSaving: (amount, ref) =>
    set((s) => ({
      transactions: [
        { id: `s-${Date.now()}`, type: "saving", title: "ออมทอง", amountTHB: amount, createdAt: stampTH, timestamp: Date.now(), ref },
        ...s.transactions,
      ],
    })),
  logRedeem: (grams, ref) =>
    set((s) => ({
      transactions: [
        { id: `r-${Date.now()}`, type: "redeem", title: "แลกทอง", amountTHB: 0, grams, createdAt: stampTH, timestamp: Date.now(), ref },
        ...s.transactions,
      ],
    })),
}));
