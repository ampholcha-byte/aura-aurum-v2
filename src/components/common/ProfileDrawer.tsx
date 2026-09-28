"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, KeyRound, ShieldCheck, Landmark, LogOut,
  Smartphone, BadgeCheck, Bell, BellRing, Volume2, ChevronRight, ScrollText,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { LEGAL_DOCS } from "@/data/legal/legalDocs";

/** รหัสพอร์ต mock (ตามสเปก — ภายหลังดึงจาก backend) */
const PORT_CODE = "58405";

/** ปุ่ม Toggle Switch โทนทอง DEEGOLD */
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[linear-gradient(135deg,#D4AF37_0%,#B8860B_100%)]" : "bg-[#E8D8BA]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type Props = { open: boolean; onClose: () => void };

/** Slide-over โปรไฟล์ & การตั้งค่า — เปิดจากปุ่มโปรไฟล์มุมขวาบน Dashboard */
export default function ProfileDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const member = useAuthStore((s) => s.member);
  const logout = useAuthStore((s) => s.logout);

  // แอนิเมชันเข้าออก (slide จากขวา)
  const [visible, setVisible] = useState(false);
  const [logoutAsk, setLogoutAsk] = useState(false);
  const [legalKey, setLegalKey] = useState<"privacy" | "terms" | null>(null);
  const [notif, setNotif] = useState({ savings: true, plan: true, system: false, sound: false });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const name = member?.name ?? "นายสมชาย มั่งคั่งกิจ";
  const phone = member?.phone ?? "081-234-5678";

  const doLogout = () => {
    logout();
    setLogoutAsk(false);
    onClose();
    router.replace("/login");
  };

  const goProfile = () => {
    onClose();
    router.push("/profile");
  };

  const notifItems: { key: keyof typeof notif; label: string; sub: string; icon: typeof Bell }[] = [
    { key: "savings", label: "แจ้งเตือนการออม", sub: "ฝาก/ถอนเงินเข้าพอร์ต", icon: Bell },
    { key: "plan", label: "แจ้งเตือนแผนการออม", sub: "ครบกำหนดผ่อน/ครบแผน", icon: BellRing },
    { key: "system", label: "แจ้งเตือนจากระบบ", sub: "ประกาศและสถานะรายการ", icon: ShieldCheck },
    { key: "sound", label: "แจ้งเตือนด้วยเสียง", sub: "เสียงเมื่อมีรายการใหม่", icon: Volume2 },
  ];

  const menuItems = [
    { icon: KeyRound, label: "เปลี่ยนรหัสผ่าน", onClick: goProfile },
    { icon: ShieldCheck, label: "จัดการระบบความปลอดภัย (2FA)", onClick: goProfile },
    { icon: Landmark, label: "จัดการบัญชีธนาคารของคุณ", onClick: goProfile },
  ];

  const legalDoc = legalKey ? LEGAL_DOCS[legalKey] : null;

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide-over panel (ด้านขวา) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="โปรไฟล์และการตั้งค่า"
        className={`fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-[360px] flex-col bg-[#FFF8F1] shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ปุ่มปิด */}
        <button
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:scale-95"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* ส่วนที่ 1: User Profile Header */}
          <div className="bg-gradient-to-br from-[#7A0F1A] to-[#660C15] px-5 pb-5 pt-6 text-white">
            <div className="flex items-center gap-3 pr-12">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] text-xl font-extrabold shadow-[0_4px_14px_rgba(184,134,11,0.35)]">
                {name.charAt(3)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold leading-tight">{name}</p>
                <p className="financial-digits mt-1 flex items-center gap-1.5 text-sm opacity-90">
                  <Smartphone size={14} className="shrink-0" /> {phone}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-full bg-white/10 px-3.5 py-2">
              <span className="financial-digits text-xs font-semibold">
                รหัสพอร์ต: {PORT_CODE}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F3C343]">
                <BadgeCheck size={12} /> ยืนยันตัวตนแล้ว
              </span>
            </div>
          </div>

          {/* เมนูด่วน */}
          <nav className="px-4 pt-4" aria-label="เมนูด่วนโปรไฟล์">
            <div className="overflow-hidden rounded-2xl border border-gold-border bg-white shadow-[0_4px_20px_rgba(212,175,55,0.08)]">
              {menuItems.map(({ icon: Icon, label, onClick }, i) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={`flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#FFF9E6] active:scale-[0.99] ${
                    i > 0 ? "border-t border-[#F5E5DC]" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#8A6715]">
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-espresso">{label}</span>
                  <ChevronRight size={16} className="shrink-0 text-secondary" />
                </button>
              ))}
              {/* ออกจากระบบ — แดงสุภาพ */}
              <button
                onClick={() => setLogoutAsk(true)}
                className="flex min-h-[52px] w-full items-center gap-3 border-t border-[#F5E5DC] px-4 py-3 text-left transition hover:bg-[#FDF2F2] active:scale-[0.99]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aus-red/10 text-aus-red">
                  <LogOut size={17} />
                </span>
                <span className="flex-1 text-sm font-semibold text-aus-red">ออกจากระบบ</span>
              </button>
            </div>
          </nav>

          {/* ส่วนที่ 2: การตั้งค่าการแจ้งเตือน */}
          <section className="px-4 pt-5" aria-label="การตั้งค่าการแจ้งเตือน">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-espresso">
              <Bell size={15} className="text-gold-dark" /> แจ้งเตือน
            </h3>
            <div className="overflow-hidden rounded-2xl border border-gold-border bg-white shadow-[0_4px_20px_rgba(212,175,55,0.08)]">
              {notifItems.map(({ key, label, sub, icon: Icon }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-[#F5E5DC]" : ""}`}
                >
                  <Icon size={16} className="shrink-0 text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-espresso">{label}</p>
                    <p className="text-[10px] text-secondary">{sub}</p>
                  </div>
                  <Toggle
                    label={label}
                    checked={notif[key]}
                    onChange={(v) => setNotif((s) => ({ ...s, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ส่วนที่ 3: ลิงก์นโยบายและข้อกำหนด */}
          <footer className="px-4 pb-8 pt-5">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setLegalKey("privacy")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary underline-offset-2 transition hover:text-espresso hover:underline"
              >
                <ScrollText size={13} /> นโยบายความเป็นส่วนตัว
              </button>
              <button
                onClick={() => setLegalKey("terms")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary underline-offset-2 transition hover:text-espresso hover:underline"
              >
                <ScrollText size={13} /> ข้อตกลงและเงื่อนไขการใช้บริการ
              </button>
              <p className="mt-1 text-center text-[10px] text-secondary/70">
                ห้างทองดีเยาวราช (DEEGOLD) · คุ้มครองข้อมูลตาม พ.ร.บ. PDPA
              </p>
            </div>
          </footer>
        </div>
      </aside>

      {/* Dialog ยืนยันออกจากระบบ */}
      {logoutAsk && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-[340px] rounded-2xl bg-white p-5 text-center">
            <p className="text-base font-bold text-espresso">ออกจากระบบ?</p>
            <p className="mt-1 text-xs text-secondary">คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งาน</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setLogoutAsk(false)}
                className="min-h-[44px] rounded-full border-[1.5px] border-[#E8D8BA] text-sm font-semibold text-secondary"
              >
                ยกเลิก
              </button>
              <button
                onClick={doLogout}
                className="min-h-[44px] rounded-full bg-[linear-gradient(135deg,#7A0F1A_0%,#660C15_100%)] text-sm font-bold text-white"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal เอกสารนโยบาย/ข้อตกลง */}
      {legalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalDoc.title}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setLegalKey(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#8A6715]">
                  <ScrollText size={19} />
                </span>
                <div>
                  <p className="text-base font-bold leading-tight text-espresso">{legalDoc.title}</p>
                  <p className="text-[10px] text-secondary">อัปเดตล่าสุด: {legalDoc.updatedAt}</p>
                </div>
              </div>
              <button
                aria-label="ปิด"
                onClick={() => setLegalKey(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-secondary"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {legalDoc.sections.map((s) => (
                <div key={s.heading} className="rounded-xl bg-[#FDFCFA] p-3.5">
                  <p className="text-sm font-bold text-espresso">{s.heading}</p>
                  <p className="mt-1 text-xs leading-relaxed text-secondary">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[10px] text-secondary/70">
              ห้างทองดีเยาวราช (DEEGOLD) · ฉบับแสดงบนแอปพลิเคชัน
            </p>
          </div>
        </div>
      )}
    </>
  );
}
