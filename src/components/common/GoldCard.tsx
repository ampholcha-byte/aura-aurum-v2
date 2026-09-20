import type { ReactNode } from "react";

export default function GoldCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gold-border bg-white shadow-[0_4px_20px_rgba(212,175,55,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
