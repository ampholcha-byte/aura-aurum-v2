"use client";

import { useState } from "react";
import {
  Check, Pencil, MapPin, Plus, Trash2, Star,
  Lock, KeyRound, ChevronRight, ShieldCheck, X,
} from "lucide-react";
import TopAppBar from "@/components/common/TopAppBar";
import BottomNav from "@/components/common/BottomNav";
import GoldCard from "@/components/common/GoldCard";
import Button from "@/components/common/Button";

type Member = { name: string; phone: string; email: string; idCard: string };
type Address = {
  id: string; label: string; name: string; phone: string; detail: string; isDefault: boolean;
};

const inputCls =
  "min-h-[44px] w-full rounded-lg border-[1.5px] border-[#E8D8BA] bg-[#FDFCFA] px-3 text-sm text-espresso focus:border-gold focus:outline-none";

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-bold text-espresso">{title}</p>
          <button aria-label="ปิด" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full text-secondary">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** หน้าโปรไฟล์ — ข้อมูลสมาชิก, Address Book, ความปลอดภัย */
export default function ProfilePage() {
  const [member, setMember] = useState<Member>({
    name: "นายสมชาย มั่งคั่งกิจ",
    phone: "081-234-5678",
    email: "somchai@example.com",
    idCard: "1-1001-23456-78-9",
  });
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "a1", label: "บ้าน", name: "สมชาย มั่งคั่งกิจ", phone: "081-234-5678", detail: "123/45 ถ.เยาวราช แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ กรุงเทพฯ 10100", isDefault: true },
    { id: "a2", label: "ที่ทำงาน", name: "สมชาย มั่งคั่งกิจ", phone: "081-234-5678", detail: "99 อาคารโกลด์ทาวเวอร์ ชั้น 12 ถ.สาทร แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120", isDefault: false },
  ]);
  const [pinSet, setPinSet] = useState(false);
  const [sheet, setSheet] = useState<"profile" | "address" | "password" | "pin" | null>(null);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // ---- ฟอร์มย่อย ----
  const [mName, setMName] = useState(member.name);
  const [mEmail, setMEmail] = useState(member.email);
  const [aLabel, setALabel] = useState("บ้าน");
  const [aName, setAName] = useState("");
  const [aPhone, setAPhone] = useState("");
  const [aDetail, setADetail] = useState("");
  const [pwCur, setPwCur] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinErr, setPinErr] = useState("");

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const openAddress = (a?: Address) => {
    setEditingAddr(a ?? null);
    setALabel(a?.label ?? "บ้าน");
    setAName(a?.name ?? member.name);
    setAPhone(a?.phone ?? member.phone);
    setADetail(a?.detail ?? "");
    setSheet("address");
  };

  const saveAddress = () => {
    if (aName.trim() === "" || aPhone.trim() === "" || aDetail.trim().length < 10) return;
    if (editingAddr) {
      setAddresses((list) => list.map((a) => (a.id === editingAddr.id ? { ...a, label: aLabel, name: aName.trim(), phone: aPhone.trim(), detail: aDetail.trim() } : a)));
      flash("อัปเดตที่อยู่เรียบร้อย");
    } else {
      setAddresses((list) => [...list, { id: `a-${Date.now()}`, label: aLabel, name: aName.trim(), phone: aPhone.trim(), detail: aDetail.trim(), isDefault: list.length === 0 }]);
      flash("เพิ่มที่อยู่เรียบร้อย");
    }
    setSheet(null);
  };

  const savePassword = () => {
    if (pwCur === "" || pwNew.length < 8 || pwNew !== pwConfirm) {
      setPwErr("กรุณากรอกรหัสผ่านปัจจุบัน รหัสผ่านใหม่ ≥ 8 ตัวอักษร และยืนยันให้ตรงกัน");
      return;
    }
    setPwErr("");
    setPwCur(""); setPwNew(""); setPwConfirm("");
    setSheet(null);
    flash("เปลี่ยนรหัสผ่านเรียบร้อย");
  };

  const savePin = () => {
    if (!/^\d{6}$/.test(pin) || pin !== pinConfirm) {
      setPinErr("PIN ต้องเป็นตัวเลข 6 หลัก และยืนยันให้ตรงกัน");
      return;
    }
    setPinErr("");
    setPin(""); setPinConfirm("");
    setPinSet(true);
    setSheet(null);
    flash("ตั้งค่า PIN เรียบร้อย");
  };

  return (
    <>
      <TopAppBar title="โปรไฟล์" />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        {notice && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald/10 p-3 text-xs font-semibold text-emerald">
            <Check size={16} /> {notice}
          </div>
        )}

        {/* การ์ดสมาชิก */}
        <section className="rounded-2xl bg-gradient-to-br from-[#7A0F1A] to-[#660C15] p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] text-xl font-extrabold">
              ส
            </div>
            <div className="flex-1">
              <p className="text-base font-bold">{member.name}</p>
              <p className="financial-digits text-xs opacity-80">{member.phone}</p>
            </div>
            <button
              aria-label="แก้ไขข้อมูลสมาชิก"
              onClick={() => { setMName(member.name); setMEmail(member.email); setSheet("profile"); }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <Pencil size={18} />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald/20 px-2.5 py-1 text-[11px] font-bold text-emerald-light">
              <Check size={12} /> ยืนยันเบอร์โทรแล้ว
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F3C343]/20 px-2.5 py-1 text-[11px] font-bold text-[#F3C343]">
              <ShieldCheck size={12} /> KYC ผ่านแล้ว
            </span>
          </div>
        </section>

        {/* ข้อมูลสมาชิก */}
        <GoldCard className="space-y-2 p-4 text-sm">
          <p className="text-sm font-bold text-espresso">ข้อมูลสมาชิก</p>
          <div className="flex justify-between"><span className="text-secondary">ชื่อ-นามสกุล</span><b className="text-espresso">{member.name}</b></div>
          <div className="flex justify-between"><span className="text-secondary">เบอร์โทร</span><b className="financial-digits text-espresso">{member.phone}</b></div>
          <div className="flex justify-between"><span className="text-secondary">อีเมล</span><b className="text-espresso">{member.email}</b></div>
          <div className="flex justify-between"><span className="text-secondary">เลขบัตรประชาชน</span><b className="financial-digits text-espresso">{member.idCard}</b></div>
        </GoldCard>

        {/* Address Book */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-espresso">ที่อยู่สำหรับรับทอง</h2>
            <button onClick={() => openAddress()} className="inline-flex items-center gap-1 text-xs font-bold text-burgundy">
              <Plus size={14} /> เพิ่มที่อยู่
            </button>
          </div>
          {addresses.map((a) => (
            <GoldCard key={a.id} className="mb-2 p-3">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-espresso">
                    {a.label}
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF9E6] px-2 py-0.5 text-[10px] font-bold text-[#8A6715]">
                        <Star size={10} /> ค่าเริ่มต้น
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-espresso">{a.name} · <span className="financial-digits">{a.phone}</span></p>
                  <p className="text-[11px] text-secondary">{a.detail}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                {!a.isDefault && (
                  <button
                    onClick={() => setAddresses((l) => l.map((x) => ({ ...x, isDefault: x.id === a.id })))}
                    className="min-h-[36px] flex-1 rounded-full border-[1.5px] border-gold text-[11px] font-bold text-[#8A6715]"
                  >
                    ตั้งเป็นค่าเริ่มต้น
                  </button>
                )}
                <button
                  onClick={() => openAddress(a)}
                  className="min-h-[36px] flex-1 rounded-full border-[1.5px] border-[#E8D8BA] text-[11px] font-bold text-secondary"
                >
                  แก้ไข
                </button>
                <button
                  aria-label={`ลบที่อยู่ ${a.label}`}
                  onClick={() => setAddresses((l) => l.filter((x) => x.id !== a.id))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-aus-red"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </GoldCard>
          ))}
        </section>

        {/* ความปลอดภัย */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-espresso">ความปลอดภัย</h2>
          <GoldCard className="divide-y divide-[#F5E5DC]">
            <button onClick={() => { setPwErr(""); setSheet("password"); }} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"><Lock size={18} /></span>
              <span className="flex-1 text-sm font-semibold text-espresso">เปลี่ยนรหัสผ่าน</span>
              <ChevronRight size={18} className="text-secondary" />
            </button>
            <button onClick={() => { setPinErr(""); setSheet("pin"); }} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#8A6715]"><KeyRound size={18} /></span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-espresso">{pinSet ? "เปลี่ยน PIN" : "ตั้งค่า PIN"}</span>
                <span className="text-[11px] text-secondary">{pinSet ? "ตั้งค่าแล้ว" : "ยังไม่ได้ตั้งค่า — แนะนำให้ตั้งเพื่อยืนยันรายการ"}</span>
              </span>
              <ChevronRight size={18} className="text-secondary" />
            </button>
          </GoldCard>
        </section>
      </main>
      <BottomNav />

      {/* ชีทแก้ไขข้อมูลสมาชิก */}
      {sheet === "profile" && (
        <Sheet title="แก้ไขข้อมูลสมาชิก" onClose={() => setSheet(null)}>
          <label className="block text-xs font-semibold text-secondary">ชื่อ-นามสกุล</label>
          <input value={mName} onChange={(e) => setMName(e.target.value)} className={`${inputCls} mt-1`} />
          <label className="mt-3 block text-xs font-semibold text-secondary">อีเมล</label>
          <input value={mEmail} onChange={(e) => setMEmail(e.target.value)} className={`${inputCls} mt-1`} />
          <Button
            className="mt-5 w-full"
            disabled={mName.trim() === "" || mEmail.trim() === ""}
            onClick={() => { setMember((m) => ({ ...m, name: mName.trim(), email: mEmail.trim() })); setSheet(null); flash("อัปเดตข้อมูลสมาชิกเรียบร้อย"); }}
          >
            บันทึก
          </Button>
        </Sheet>
      )}

      {/* ชีทที่อยู่ */}
      {sheet === "address" && (
        <Sheet title={editingAddr ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"} onClose={() => setSheet(null)}>
          <p className="text-xs font-semibold text-secondary">ป้ายกำกับ</p>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {["บ้าน", "ที่ทำงาน", "อื่นๆ"].map((l) => (
              <button
                key={l}
                onClick={() => setALabel(l)}
                className={`min-h-[44px] rounded-full border-[1.5px] text-sm font-semibold ${aLabel === l ? "border-gold bg-[#FFF9E6] text-[#8A6715]" : "border-[#E8D8BA] text-secondary"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-xs font-semibold text-secondary">ชื่อผู้รับ</label>
          <input value={aName} onChange={(e) => setAName(e.target.value)} className={`${inputCls} mt-1`} />
          <label className="mt-3 block text-xs font-semibold text-secondary">เบอร์โทร</label>
          <input value={aPhone} onChange={(e) => setAPhone(e.target.value)} className={`${inputCls} mt-1`} />
          <label className="mt-3 block text-xs font-semibold text-secondary">ที่อยู่ (อย่างน้อย 10 ตัวอักษร)</label>
          <textarea rows={3} value={aDetail} onChange={(e) => setADetail(e.target.value)} className={`${inputCls} mt-1 py-2`} />
          <Button
            className="mt-5 w-full"
            disabled={aName.trim() === "" || aPhone.trim() === "" || aDetail.trim().length < 10}
            onClick={saveAddress}
          >
            บันทึกที่อยู่
          </Button>
        </Sheet>
      )}

      {/* ชีทเปลี่ยนรหัสผ่าน */}
      {sheet === "password" && (
        <Sheet title="เปลี่ยนรหัสผ่าน" onClose={() => setSheet(null)}>
          <label className="block text-xs font-semibold text-secondary">รหัสผ่านปัจจุบัน</label>
          <input type="password" value={pwCur} onChange={(e) => setPwCur(e.target.value)} className={`${inputCls} mt-1`} />
          <label className="mt-3 block text-xs font-semibold text-secondary">รหัสผ่านใหม่ (≥ 8 ตัวอักษร)</label>
          <input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} className={`${inputCls} mt-1`} />
          <label className="mt-3 block text-xs font-semibold text-secondary">ยืนยันรหัสผ่านใหม่</label>
          <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} className={`${inputCls} mt-1`} />
          {pwErr && <p className="mt-2 text-xs text-aus-red">{pwErr}</p>}
          <Button className="mt-5 w-full" onClick={savePassword}>ยืนยันเปลี่ยนรหัสผ่าน</Button>
        </Sheet>
      )}

      {/* ชีท PIN */}
      {sheet === "pin" && (
        <Sheet title={pinSet ? "เปลี่ยน PIN" : "ตั้งค่า PIN"} onClose={() => setSheet(null)}>
          <label className="block text-xs font-semibold text-secondary">PIN ใหม่ (ตัวเลข 6 หลัก)</label>
          <input
            type="password" inputMode="numeric" maxLength={6}
            value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className={`${inputCls} financial-digits mt-1 text-center text-lg tracking-[0.5em]`}
          />
          <label className="mt-3 block text-xs font-semibold text-secondary">ยืนยัน PIN</label>
          <input
            type="password" inputMode="numeric" maxLength={6}
            value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
            className={`${inputCls} financial-digits mt-1 text-center text-lg tracking-[0.5em]`}
          />
          {pinErr && <p className="mt-2 text-xs text-aus-red">{pinErr}</p>}
          <Button className="mt-5 w-full" onClick={savePin}>ยืนยัน PIN</Button>
        </Sheet>
      )}
    </>
  );
}
