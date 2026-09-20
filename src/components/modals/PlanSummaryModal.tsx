import Button from "@/components/common/Button";
import type { DcaChannel, DcaFrequency, DcaSession } from "@/types/goldPlan";

type Props = {
  frequency: DcaFrequency;
  session: DcaSession;
  amount: number;
  channel: DcaChannel;
  estGrams: string;
  onEdit: () => void;
  onConfirm: () => void;
};

/** SCREEN_18 — สรุปข้อมูลแผนการออม */
export default function PlanSummaryModal({ frequency, session, amount, channel, estGrams, onEdit, onConfirm }: Props) {
  const freqLabel = frequency === "monthly" ? "รายเดือน" : frequency === "weekly" ? "รายสัปดาห์" : "รายวัน";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-t-3xl bg-white p-5 pb-8">
        <p className="text-center text-base font-bold text-espresso">สรุปแผนการออม</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-secondary">ความถี่</dt><dd className="font-semibold text-espresso">{freqLabel}</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">ช่วงเวลา</dt><dd className="font-semibold text-espresso">{session === "DAY" ? "กลางวัน" : "กลางคืน"}</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">มูลค่าต่อครั้ง</dt><dd className="financial-digits font-semibold text-espresso">{amount.toLocaleString("th-TH")} THB</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">ช่องทางตัดเงิน</dt><dd className="font-semibold text-espresso">{channel === "cash" ? "บัญชีเงินสด" : "ATS กสิกรไทย"}</dd></div>
          <div className="flex justify-between"><dt className="text-secondary">น้ำหนักทองประมาณการ</dt><dd className="financial-digits font-semibold text-gold-dark">≈ {estGrams} กรัม</dd></div>
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="champagne" onClick={onEdit}>แก้ไขข้อมูล</Button>
          <Button onClick={onConfirm}>ยืนยันสร้างแผน</Button>
        </div>
      </div>
    </div>
  );
}
