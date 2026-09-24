"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PiggyBank, Package, History, User } from "lucide-react";

const items = [
  { href: "/", label: "หน้าแรก", icon: Home },
  { href: "/savings", label: "ออมทอง", icon: PiggyBank },
  { href: "/redeem", label: "ขอรับทอง", icon: Package },
  { href: "/history", label: "ประวัติ", icon: History },
  { href: "/profile", label: "โปรไฟล์", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 mt-auto border-t border-gold-border bg-white/95 backdrop-blur">
      <div className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                active ? "text-burgundy" : "text-secondary"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
