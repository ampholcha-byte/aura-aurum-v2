import type { Metadata } from "next";
import "./globals.css";
import MobileAppFrame from "@/components/common/MobileAppFrame";

export const metadata: Metadata = {
  title: "DEEGGOLD — ออมทองออนไลน์",
  description: "ห้างทองดีเยาวราช ระบบออมทองคำแท่ง 96.5% ออนไลน์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <MobileAppFrame>{children}</MobileAppFrame>
      </body>
    </html>
  );
}
