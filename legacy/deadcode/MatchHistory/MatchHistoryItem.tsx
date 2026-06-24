import Image from "next/image";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default function MatchHistoryItem({ item }) {
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

  const formatDate = (date) => {
    if (!date) return "Ukjent dato";
    return format(date, "d. MMM yyyy", { locale: nb });
  };

  const getDurationText = (days) => {
    if (days === 0) return "Mindre enn en dag";
    if (days === 1) return "1 dag";
    return `${days} dager`;
  };

  return (
    <div className="bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-4 hover:border-[#CBAA7A]/40 transition-all duration-200">
      <div className="flex items-center space-x-4">
        {item.partnerImage ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image 
              src={item.partnerImage} 
              alt={item.partnerName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-neutral-400 text-lg">
              {item.partnerName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-medium truncate">{item.partnerName}</h3>
            <span className={`text-lg font-bold ${getQualityColor(item.finalScore)}`}>
              {item.finalScore}%
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm text-neutral-400">
            <span>{formatDate(item.endedAt)}</span>
            <span>{getDurationText(item.duration)}</span>
          </div>
          
          {item.reason && (
            <p className="text-neutral-500 text-sm mt-2 truncate">
              Årsak: {item.reason}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs text-neutral-500 mb-1">
          <span>Emosjonal resonans</span>
          <span>{item.resonanceScore}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${getQualityBarColor(item.resonanceScore)}`}
            style={{ width: `${item.resonanceScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}