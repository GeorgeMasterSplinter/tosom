interface Props {
  step: number; // 1–8
}

export default function Progress({ step }: Props) {
  const total = 8;
  const percentage = (step / total) * 100;

  return (
    <div className="max-w-md mx-auto px-4 w-full mb-6 mt-6">
      <p className="text-sm leading-relaxed text-[#1A1A1A] mb-2 animate-fadeIn">
        Ta den tiden du trenger.
      </p>
      <div className="flex justify-between text-sm leading-relaxed text-[#1A1A1A] mb-4">
        <span>Steg {step} av {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden px-2">
        <div
          className="h-full bg-[#CBAA7A] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}