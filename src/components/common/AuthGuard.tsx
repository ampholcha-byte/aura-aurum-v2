"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

/** หน้าที่ไม่ต้องล็อกอิน */
const PUBLIC_PATHS = ["/login"];

/**
 * AuthGuard — บังคับล็อกอินทุกหน้า (ยกเว้น PUBLIC_PATHS)
 * ยังไม่ล็อกอิน → redirect ไป /login พร้อม flash "กรุณาเข้าสู่ระบบก่อน"
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { member, restore } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restore();
    setReady(true);
  }, [restore]);

  useEffect(() => {
    if (!ready) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!member && !isPublic) router.replace("/login?next=" + encodeURIComponent(pathname));
  }, [ready, member, pathname, router]);

  // รอ restore session ก่อนกัน flash หน้าเนื้อหาตอน refresh
  if (!ready) return null;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!member && !isPublic) return null;

  return <>{children}</>;
}
