import { Coins } from "lucide-react";

/** SCREEN_24 — ป๊อปอัปกำลังดำเนินงาน */
export default function ProcessingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-8">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gold-border border-t-gold" />
          <Coins size={32} className="text-gold-dark" />
        </div>
        <p className="text-sm font-semibold text-espresso">กำลังดำเนินงาน...</p>
      </div>
    </div>
  );
}
