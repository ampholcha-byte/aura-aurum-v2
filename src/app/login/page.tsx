"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Lock, Eye, EyeOff, MessageCircle, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

/** หน้าเข้าสู่ระบบ — การ์ดกลางจอธีม DEEGGOLD (mock auth: สมชาย / 123456 หรือเบอร์ 081-234-5678) */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = login(username, password);
    if (err) {
      setError(err);
      return;
    }
    const next = searchParams.get("next");
    router.replace(next && next.startsWith("/") ? next : "/");
  };

  const inputCls =
    "financial-digits min-h-[52px] w-full rounded-xl border-[1.5px] border-gold-border bg-[#FDFCFA] pl-11 pr-11 text-sm font-semibold text-espresso placeholder:font-normal placeholder:text-secondary focus:border-gold focus:outline-none";

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-[400px] rounded-2xl border-[1.5px] border-gold bg-white p-6 shadow-[0_4px_20px_rgba(212,175,55,0.08)] md:p-8">
          {/* Top Brand Section */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/brand/logo.png"
              alt="DEEGGOLD"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] drop-shadow-[0_6px_16px_rgba(122,15,26,0.25)]"
            />
            <h1 className="mt-3 text-xl font-extrabold text-espresso">เข้าสู่ระบบ</h1>
            <p className="mt-0.5 text-xs font-medium text-secondary">ระบบออมทองคำแท่งออนไลน์</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3.5">
            {/* เบอร์โทรศัพท์ / รหัสสมาชิก */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-bold text-espresso">
                เบอร์โทรศัพท์ / รหัสสมาชิก
              </label>
              <div className="relative">
                <Phone size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-dark" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="ชื่อสมาชิก หรือ 08X-XXX-XXXX"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* รหัสผ่าน */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-espresso">
                  รหัสผ่าน
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#B31D1D] transition active:scale-95"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-dark" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ข้อความ error */}
            {error && (
              <p className="flex items-center gap-1.5 rounded-lg bg-[#FDF0F0] px-3 py-2 text-xs font-semibold text-[#B31D1D]">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </p>
            )}

            {/* ปุ่มเข้าสู่ระบบ */}
            <button
              type="submit"
              className="mt-1.5 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#7A0F1A_0%,#660C15_100%)] text-base font-bold text-white shadow-[0_6px_20px_rgba(122,15,26,0.3)] transition active:scale-[0.98]"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* สมัครสมาชิก / Line OA */}
          <div className="mt-5 flex flex-col items-center gap-2.5">
            <p className="text-xs text-secondary">
              ยังไม่มีบัญชี?{" "}
              <Link href="/login" className="font-bold text-burgundy underline-offset-2 hover:underline">
                สมัครสมาชิกใหม่
              </Link>
            </p>
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-gold bg-[#FFFDF8] px-4 text-xs font-semibold text-[#8A6715] transition active:scale-[0.98]"
            >
              <MessageCircle size={15} />
              ติดต่อเจ้าหน้าที่ผ่าน Line OA
            </a>
            <p className="financial-digits rounded-lg bg-[#FFF9E6] px-3 py-1.5 text-[11px] text-[#8A6715]">
              ทดลองเข้าระบบ: สมชาย / 123456
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-5 text-center">
        <p className="text-[11px] text-secondary/80">
          © ห้างทองดีเยาวราช (DEEGGOLD) All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
