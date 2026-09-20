import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "champagne" | "ghost";
};

export default function Button({ variant = "gold", className = "", ...rest }: Props) {
  const base =
    "min-h-[44px] rounded-full px-6 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50";
  const styles =
    variant === "gold"
      ? "text-white shadow-[0_6px_20px_rgba(184,134,11,0.22)] bg-[linear-gradient(135deg,#F3C343_0%,#D4AF37_50%,#B8860B_100%)]"
      : variant === "champagne"
        ? "border-[1.5px] border-gold bg-[#FFFDF8] text-[#8A6715]"
        : "text-secondary";
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}
