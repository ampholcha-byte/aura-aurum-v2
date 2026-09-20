/** ตัวเลขเงินบาท: 2 ทศนิยม + comma (10,030.02) */
export function formatTHB(value: number): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** น้ำหนักทอง: ทศนิยม 4 ตำแหน่ง (0.0133) */
export function formatGoldGrams(value: number): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

/** ราคาทองต่อกรัมจากยอดเงิน: น้ำหนัก = ยอดเงิน / ราคาขายออกต่อกรัม */
export function calcGoldGrams(amountTHB: number, sellPricePerGram: number): number {
  if (sellPricePerGram <= 0) return 0;
  return amountTHB / sellPricePerGram;
}

/** ยอดถอนสุทธิ: Net = Amount - 10.00 */
export const WITHDRAW_FEE = 10;
export function calcWithdrawNet(amount: number): number {
  return Math.max(0, amount - WITHDRAW_FEE);
}
