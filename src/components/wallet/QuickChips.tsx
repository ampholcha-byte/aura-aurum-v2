type Props = {
  options: number[];
  value: number;
  onPick: (v: number) => void;
};

export default function QuickChips({ options, value, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onPick(value + opt)}
          className="min-h-[44px] rounded-full border-[1.5px] border-gold bg-[#FFFDF8] px-4 text-sm font-semibold text-[#8A6715] active:scale-95"
        >
          +{opt.toLocaleString("th-TH")}
        </button>
      ))}
    </div>
  );
}
