# HANDOVER — DEEGGOLD ออมทองออนไลน์ (aura_aurum_v2)

> เอกสารส่งงานสำหรับเอเจนต์/นักพัฒนาคนถัดไป อัปเดตล่าสุด: 24 ก.ย. 2569
> สเปกหลัก: `claude.md` (ฟีเจอร์ + business rules) และ `DESIGN.md` (design system "Yaowarat Sovereign Gold")
> Repo: `https://github.com/ampholcha-byte/aura-aurum-v2` (branch `main`) · Deploy: Vercel (import จาก GitHub, auto-deploy ทุก push ขึ้น main)
> Production URL: `https://aura-aurum-v2.vercel.app` (deploy แล้วถึง commit `d506bb0`)

## 1. วิธีรัน

```powershell
npm run dev     # http://localhost:3000 (เทส LAN มือถือ: npm run dev -- --hostname 0.0.0.0 --port 3000)
npm run build   # verify — ต้องผ่านก่อน push (ปัจจุบันผ่าน 13 routes)
git push        # Vercel deploy อัตโนมัติหลัง push ขึ้น main
```

Stack: Next.js 14.2.5 (App Router) + React 18 + TS + Tailwind 3.4 + zustand + lucide-react. ไม่มี test framework, ไม่มี backend — ทุกอย่างเป็น mock state ใน memory (zustand) + `setTimeout` จำลอง processing/QR

## 2. Route Map (13 routes)

| Route | ไฟล์ | Screen ref |
|---|---|---|
| `/` Home Dashboard | `src/app/page.tsx` | SCREEN_42 |
| `/savings` ออมทอง | `src/app/savings/page.tsx` | SCREEN_28 (+26/24/22 via modal) |
| `/savings/create-plan` สร้างแผน DCA | `src/app/savings/create-plan/page.tsx` | SCREEN_20/18 |
| `/wallet/deposit` ฝากเงิน | `src/app/wallet/deposit/page.tsx` | SCREEN_16 |
| `/wallet/deposit/qr` QR ฝาก | `src/app/wallet/deposit/qr/page.tsx` | SCREEN_14 |
| `/wallet/deposit/success` ใบเสร็จฝาก | `src/app/wallet/deposit/success/page.tsx` | SCREEN_12 |
| `/wallet/withdraw` ถอนเงิน | `src/app/wallet/withdraw/page.tsx` | SCREEN_10 |
| `/wallet/withdraw/success` ใบเสร็จถอน | `src/app/wallet/withdraw/success/page.tsx` | SCREEN_8 |
| `/redeem` ขอรับทอง (ส่งบ้าน/รับสาขา) | `src/app/redeem/page.tsx` | — (นอกสเปกเดิม, ทำเพิ่ม) |
| `/redeem/success` ใบรับคำขอ | `src/app/redeem/success/page.tsx` | — |
| `/history` ประวัติ + filter | `src/app/history/page.tsx` | — (ทำเพิ่ม) |
| `/profile` สมาชิก/ที่อยู่/ปลอดภัย | `src/app/profile/page.tsx` | — (ทำเพิ่ม) |

Shell ทุกหน้า (ยกเว้นหน้า success/QR ที่ render เองเต็มจอ): `MobileAppFrame` (max-w 430px, bg `#FFF8F1`, **`flex flex-col`**) ครอบผ่าน `src/app/layout.tsx` — `BottomNav` ใช้ `sticky bottom-0` + `mt-auto` เพื่อยึดขอบล่างจอแม้เนื้อหาสั้น (ห้ามเอา flex ออกจาก frame)

## 3. State (zustand)

- `src/stores/useWalletStore.ts` — `cashBalance` (seed 30,145.45), `transactions[]`
  - `deposit` / `withdraw` (กระทบยอด Cash) · `payForGold` (ตัด Cash + log "ออมทอง") · `logSaving` (ออมผ่าน QR ไม่กระทบ Cash) · `logRedeem(grams, ref)`
- `src/stores/useGoldStore.ts` — `goldGrams` (seed **0.0133**), `sellPricePerGram = 49650/15.244`, `buyPricePerBaht 48750`, `sellPricePerBaht 49650`, `plans[]`
  - `addGold` / `redeemGold` / `addPlan` · `MIN_REDEEM_GRAMS = 0.06`
- `src/types/transaction.ts` — `TxnType = deposit | withdraw | saving | redeem`; ฟิลด์ `timestamp` (epoch ms, ใช้กรองช่วงเวลา), `grams?` (เฉพาะ redeem), `createdAt` (string โชว์)
- `src/utils/formatters.ts` — `formatTHB` (2 ทศนิยม), `formatGoldGrams` (4 ทศนิยม), `calcGoldGrams`, `calcWithdrawNet` (`-10` บาท), `WITHDRAW_FEE`

## 4. Business Rules (จาก claude.md §5 — ห้ามแหก)

1. ทองทศนิยม 4 ตำแหน่ง · สูตร `กรัม = บาท ÷ ราคาขายออก/กรัม` · แลกรับจริงขั้นต่ำ **0.06g**
2. ฝาก/ถอน 100–2,000,000 บาท · ฝากฟรี · ถอน fee 10 บาท (`Net = Amount − 10`)
3. DCA ขั้นต่ำ 100 บาท · เงินไม่พอข้ามรอบ ไม่มีค่าปรับ

## 5. Design Tokens (ย่อ)

`tailwind.config.js`: `ivory #FFF8F1`, `burgundy #7A0F1A/#660C15`, `aus-red`, `gold #D4AF37`, `gold-border`, `espresso #2D2421` (ใช้ `text-espresso`), `secondary #7A6F68`, `emerald` · ฟอนต์ `Sarabun` + `Plus Jakarta Sans` (`globals.css`) · ตัวเลขการเงินใส่ class `financial-digits`/`.tnum` · ปุ่ม min-height 44px · modal เป็น bottom-sheet `max-w-[430px] rounded-t-3xl`

## 6. เสร็จแล้ว vs เหลือ

**เสร็จ:** Sprint 1–4 ครบ (Home, ออมทอง+3 modal, DCA+summary, ฝาก/ถอน+QR+ใบเสร็จ×2) + โมดูลเพิ่ม: Redeem เต็มโฟลว์, History (filter ประเภท 5 แบบ + ช่วงเวลา ทั้งหมด/7/30 วัน), Profile (ข้อมูลสมาชิก, Address Book CRUD + default, เปลี่ยนรหัสผ่าน, PIN 6 หลัก) + ขึ้น GitHub/Vercel แล้ว (เทสบนมือถือผ่าน production URL ได้)

**รอบ review/ปรับปรุง 24 ก.ย. 2569 (commit `d506bb0`, deploy แล้ว):**
- แก้ BottomNav ลอยกลางหน้าเมื่อเนื้อหาสั้น → frame เป็น flex column + nav `mt-auto` (ทดสอบแล้วยึดล่างจอทุกหน้า)
- Redeem: เพิ่มช่องเบอร์โทรผู้รับ (validate `^0\d{8,9}$` จากตัวเลขล้วน), กล่องสรุปมูลค่าทอง + ค่าจัดส่ง/ประกันภัย −35฿ (`DELIVERY_FEE_THB` mock คงที่, เก็บปลายทาง), input กรัมขอบแดง + hint แดงเมื่อเกินช่วง 0.06–ยอดคงเหลือ, ใบรับคำขอโชว์เบอร์ติดต่อ (query `phone`)
- QrPayModal: ปุ่ม "บันทึก QR Code" เดิมผูกกับ `onClose` (กดแล้วยกเลิกรายการ) → แก้เป็นแสดง hint + ปุ่ม X ปิดแยกต่างหาก
- ใบเสร็จฝากเงินเดิม hardcode "QR Payment" → ส่ง query `channel` (qr/truemoney/ats) มาแสดงช่องทางจริง
- rename `claude.md.md` → `claude.md` (เนื้อหาเดิม 100%) + แก้ reference ในเอกสาร + เพิ่ม ignore ไฟล์ขยะ (`dev-server.log`, `*.tsbuildinfo`, `.freebuff/`)

**รอบ UI/iPad 24 ก.ย. 2569 (commits `c132907` ต่อ):**
- **รองรับ iPad:** `MobileAppFrame` มือถือ 430px / จอ ≥768px (`md:`) ขยาย 700px กึ่งกลางจอ — ย้าย inline `maxWidth` ออกเป็น Tailwind class เพื่อให้ responsive ทำงาน · Home: การ์ด Cash/Gold Wallet จับคู่ 2 คอลัมน์บน iPad (`md:grid-cols-2`) หน้าอื่นยังคอลัมน์เดียว (กรอบขยายให้แล้ว)
- **Visual Hierarchy การ์ด Wallet (Home):** ตัวเลขยอดเงินเป็น hero (text-2xl extrabold, หน่วย THB/กรัม ตัวเล็กสีเทา) · padding การ์ด p-5 · **สีปุ่มเหมือนเดิมตาม feedback** (ปุ่มหลัก = ทองไล่เฉดตัวขาว, ปุ่มรอง = ครีมขอบทอง 1.5px)

**เหลือ (ยังไม่ทำ):** ต่อ API/ราคาทองเรียลไทม์ + auth จริง · QR code จริง + บันทึกสลิป/บันทึก QR (ตอนนี้เป็นปุ่ม UI + hint) · เชื่อม Address Book ของ profile เข้ากับฟอร์ม redeem (ตอนนี้ redeem มีที่อยู่+เบอร์โทรของตัวเอง — ฟิลด์ตรงกัน พร้อมผูก) · ระบบ PIN บังคับใช้ตอนยืนยันรายการ · ค่าจัดส่ง 35฿ เป็น mock คงที่ ควรคิดตามมูลค่าทอง · Hero Card หน้าแรกควรซ่อน "+0.30%" เมื่อมูลค่าทองเป็นศูนย์ · test/QA จริงจัง (responsive, edge cases)

## 7. Gotchas (อ่านก่อนแก้โค้ด)

1. หน้าใช้ `useSearchParams` (qr/success) ต้องห่อ `<Suspense>` ไม่งั้น build พัง (prerender)
2. lucide-react เวอร์ชันนี้ **ไม่มี `ReceiptSearch`** — ตรวจชื่อไอคอนก่อนใช้ (ที่ชัวร์: Home, PiggyBank, Package, History, User, Check, Coins, Truck, Store, Lock, KeyRound, MapPin, Star, Trash2, Pencil, X)
3. `createdAt` ของรายการใหม่เป็น string คงที่ `"19 ก.ย. 2569, 15:30 น."` — การกรองเวลาพึ่ง `timestamp` เท่านั้น
4. seed `goldGrams = 0.0133` **ไม่ถึงเกณฑ์แลก 0.06g** — หน้า redeem จะแสดง progress + ปุ่มออมเพิ่มจนกว่าจะซื้อทองเพิ่มผ่าน /savings (ตั้งใจตาม rule)
5. ยอด mock ในสเปกขัดกันเอง (สินทรัพย์รวม 10,030 < Cash 30,145) — โค้ดคำนวณ total = cash + มูลค่าทองจริง ไม่ได้ hardcode ตามสเปก
6. ข้อมูลทั้งหมดหายเมื่อ refresh (in-memory) — ถ้าต้องคงอยู่ให้เติม `zustand/middleware` persist
7. **E2E เทสหลายหน้าต่อเนื่อง:** ต้องเดินผ่านลิงก์/ปุ่มในหน้า (client-side nav) เท่านั้น — โหลด URL ตรง/full reload จะรีเซ็ต store กลางทาง (เช่น เคส redeem ที่ต้องซื้อทองผ่าน /savings ก่อนจะพังทันที)
8. **Dev server CSS ค้าง (JIT เสีย):** ถ้า style ที่ render ไม่ตรงโค้ด (utility หาย เช่น `.flex` ทั้งที่ class อยู่ใน DOM) — ให้ kill process ที่จับ port (`netstat -ano | findstr :3001` → `taskkill /F /PID <pid>`; Git Bash ใช้ `taskkill //F //PID`), ลบ `.next`, รันใหม่ — restart แบบปกติอาจชน `EADDRINUSE`
9. ช่องทางฝากเงินไหลผ่าน query `channel` (`qr`/`truemoney`/`ats`): ฟอร์ม → success ตรง, หรือ ฟอร์ม → qr → success (หน้า qr แนบ `channel=qr` เอง) — ใบเสร็จ default เป็น "QR Payment" ถ้าไม่มี param
10. หน้า success/QR render `<main min-h-screen>` เต็มจอเองโดยไม่มี BottomNav — หลัง frame เปลี่ยนเป็น flex ยังทำงานปกติ (ลูกเดี่ยว + min-h-screen = เต็มจอเหมือนเดิม) แต่ถ้าจะเติม BottomNav ให้หน้าพวกนี้ ต้องออกแบบโครง flex/`mt-auto` ของหน้านั้นเพิ่มเอง
11. **ห้ามรัน `npm run build` ขณะ dev server รันอยู่** — build เขียนทับ `.next` ที่ dev ใช้ ทำให้ dev พังทันทีด้วย `500 MODULE_NOT_FOUND './xxx.js'` ใน webpack-runtime (เคยเจอจริง 24 ก.ย. 2569) — วิธีแก้: kill process ที่จับ port → ลบ `.next` → start ใหม่ · ถ้าต้อง build จริง ให้หยุด dev ก่อน หรือรัน dev บน port อื่น
