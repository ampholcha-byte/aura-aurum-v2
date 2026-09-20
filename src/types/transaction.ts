export type TxnType = "deposit" | "withdraw" | "saving" | "redeem";

export type Transaction = {
  id: string;
  type: TxnType;
  title: string;
  /** ยอดเงินบาท (แลกทองใช้ 0 + ดูน้ำหนักจาก grams) */
  amountTHB: number;
  /** น้ำหนักทอง (กรัม) — ใช้เฉพาะรายการแลกทอง */
  grams?: number;
  createdAt: string;
  /** epoch ms สำหรับกรองตามช่วงเวลา */
  timestamp: number;
  ref?: string;
};
