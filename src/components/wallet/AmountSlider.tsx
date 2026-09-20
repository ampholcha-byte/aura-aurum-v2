type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
};

export default function AmountSlider({ min, max, value, onChange }: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={1}
      value={Math.min(Math.max(value, min), max)}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full accent-[#D4AF37]"
      aria-label="ปรับยอดเงิน"
    />
  );
}
