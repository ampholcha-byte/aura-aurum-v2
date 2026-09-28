"use client";

import { useState } from "react";
import { X, ShieldCheck, Cookie, FileText, FileDown, ScrollText } from "lucide-react";
import { LEGAL_DOCS, type LegalDoc } from "@/data/legal/legalDocs";

type PolicyKey = LegalDoc["key"];

const ICONS: Record<PolicyKey, typeof ShieldCheck> = {
  privacy: ShieldCheck,
  cookie: Cookie,
  dsr: FileText,
  terms: ScrollText,
};

/** ป้ายลิงก์ใน footer (สั้น) — เอกสารเต็มอยู่ใน LEGAL_DOCS */
const LINK_LABELS: Record<PolicyKey, string> = {
  privacy: "นโยบายความเป็นส่วนตัว",
  cookie: "นโยบายการใช้คุกกี้",
  dsr: "แบบฟอร์มขอใช้สิทธิ (PDPA)",
  terms: "ข้อตกลงและเงื่อนไข",
};

/** Footer legal links (PDPA): Privacy / Cookie / Data Subject Rights — เปิด modal รายละเอียด */
export default function LegalLinksFooter() {
  const [open, setOpen] = useState<PolicyKey | null>(null);

  const order: PolicyKey[] = ["privacy", "cookie", "dsr"];
  const active = open ? LEGAL_DOCS[open] : null;
  const ActiveIcon = active ? ICONS[active.key] : null;

  return (
    <>
      <nav aria-label="ลิงก์นโยบายและข้อกฎหมาย" className="pt-1">
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
          {order.map((key, i) => (
            <span key={key} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-secondary/50">·</span>}
              <button
                type="button"
                onClick={() => setOpen(key)}
                className="text-[11px] font-medium text-secondary underline-offset-2 transition hover:text-espresso hover:underline active:scale-95"
              >
                {LINK_LABELS[key]}
              </button>
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-secondary/70">
          คุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. PDPA พ.ศ. 2562
        </p>
      </nav>

      {/* Modal รายละเอียดนโยบาย */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {ActiveIcon && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#8A6715]">
                    <ActiveIcon size={19} />
                  </span>
                )}
                <div>
                  <p className="text-base font-bold leading-tight text-espresso">{active.title}</p>
                  <p className="text-[10px] text-secondary">อัปเดตล่าสุด: {active.updatedAt}</p>
                </div>
              </div>
              <button
                aria-label="ปิด"
                onClick={() => setOpen(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-secondary"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {active.sections.map((s) => (
                <div key={s.heading} className="rounded-xl bg-[#FDFCFA] p-3.5">
                  <p className="text-sm font-bold text-espresso">{s.heading}</p>
                  <p className="mt-1 text-xs leading-relaxed text-secondary">{s.body}</p>
                </div>
              ))}
            </div>
            {active.fileUrl && (
              <a
                href={active.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-gold bg-[#FFFDF8] text-sm font-semibold text-[#8A6715]"
              >
                <FileDown size={16} /> ดาวน์โหลดเอกสารฉบับเต็ม (PDF)
              </a>
            )}
            <p className="mt-4 text-center text-[10px] text-secondary/70">
              ห้างทองดีเยาวราช (DEEGOLD) · ฉบับแสดงบนแอปพลิเคชัน
            </p>
          </div>
        </div>
      )}
    </>
  );
}
