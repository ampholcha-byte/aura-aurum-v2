import type { ReactNode } from "react";

type MobileAppFrameProps = {
  children: ReactNode;
};

/**
 * MobileAppFrame — กรอบหน้าจอหลัก Mobile-First (CLAUDE.md §6)
 * max-width 430px, กึ่งกลางจอ, พื้นหลัง Ivory, สูงเต็ม viewport
 * ใช้ครอบทุกหน้าจอผ่าน app/layout.tsx
 */
export default function MobileAppFrame({ children }: MobileAppFrameProps) {
  return (
    <div
      className="mx-auto flex min-h-screen flex-col bg-ivory shadow-[0_0_40px_rgba(122,15,26,0.08)]"
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        background: "#FFF8F1",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
