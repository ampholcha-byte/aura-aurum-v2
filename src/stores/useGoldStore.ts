import { create } from "zustand";
import type { GoldPlan } from "@/types/goldPlan";

type GoldState = {
  goldGrams: number;
  /** ราคาขายออกต่อกรัม (สมมติจาก 49,650/บาททอง ~15.244g) */
  sellPricePerGram: number;
  buyPricePerBaht: number;
  sellPricePerBaht: number;
  plans: GoldPlan[];
  addGold: (grams: number) => void;
  redeemGold: (grams: number) => void;
  addPlan: (plan: GoldPlan) => void;
};

export const MIN_REDEEM_GRAMS = 0.06;

export const useGoldStore = create<GoldState>((set) => ({
  goldGrams: 0.0133,
  sellPricePerGram: 49650 / 15.244,
  buyPricePerBaht: 48750,
  sellPricePerBaht: 49650,
  plans: [
    { id: "p1", amountTHB: 400, frequency: "monthly", session: "DAY", channel: "cash", active: true },
  ],
  addGold: (grams) => set((s) => ({ goldGrams: +(s.goldGrams + grams).toFixed(4) })),
  redeemGold: (grams) =>
    set((s) => ({ goldGrams: +Math.max(0, s.goldGrams - grams).toFixed(4) })),
  addPlan: (plan) => set((s) => ({ plans: [...s.plans, plan] })),
}));
