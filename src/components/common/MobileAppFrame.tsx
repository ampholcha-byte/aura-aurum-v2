import type { ReactNode } from "react";

type MobileAppFrameProps = {
  children: ReactNode;
};

/**
 * MobileAppFrame — กรอบหน้าจอหลัก Mobile-First (CLAUDE.md §6)
 * มือถือ: กว้างสุด 430px · จอ ≥768px (iPad): ขยายเป็น 700px กึ่งกลางจอ
 * ใช้ครอบทุกหน้าจอผ่าน app/layout.tsx
 */
export default function MobileAppFrame({ children }: MobileAppFrameProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-ivory shadow-[0_0_40px_rgba(122,15,26,0.08)] md:max-w-[700px]">
      {children}
    </div>
  );
}
