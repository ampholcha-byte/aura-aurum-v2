"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
};

export default function TopAppBar({ title, showBack, rightSlot }: Props) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex min-h-[56px] items-center gap-2 bg-ivory/90 px-4 backdrop-blur">
      {showBack && (
        <button
          aria-label="ย้อนกลับ"
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full text-espresso"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="flex-1 text-base font-bold text-espresso">{title}</h1>
      {rightSlot}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F3C343] to-[#B8860B] text-sm font-bold text-white">
        ส
      </div>
    </header>
  );
}
