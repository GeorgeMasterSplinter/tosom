import { useEffect, useState } from "react";

export default function MatchBreakdownItem({ label, value, max = 100 }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setAnimatedValue(0);
    
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  const getQualityColor = (score) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 55) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityBarColor = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-yellow-500";
    return "bg-red-500";
  };

  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-neutral-300 text-sm">{label}</span>
        <span className={`font-medium ${getQualityColor(value)}`}>
          {isAnimating ? Math.round(animatedValue) : value}%
        </span>
      </div>
      
      <div className="w-full bg-neutral-800 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getQualityBarColor(value)} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}