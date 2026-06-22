/**
 * ToSom — Dashboard InsightSection
 * 
 * Viser AI-innsikt / refleksjonar basert på bruker-data.
 */

interface InsightSectionProps {
  insights: Array<{
    title: string;
    text: string;
    suggestion: string;
  }>;
}

const insightIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#D4AF37" strokeWidth="1.2" opacity="0.4" />
    <path d="M12 8v4l2 2" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export function InsightSection({ insights }: InsightSectionProps) {
  if (insights.length === 0) {
    return (
      <div
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          Fyll ut profilen din for personlege innsikter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl animate-[fadeIn_0.3s_ease-out]"
          style={{
            background: 'rgba(212, 175, 55, 0.03)',
            border: '1px solid rgba(212, 175, 55, 0.1)',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {/* Title */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
              }}
            >
              {insightIcon}
            </div>
            <h4 className="text-base font-semibold" style={{ color: '#D4AF37' }}>
              {insight.title}
            </h4>
          </div>

          {/* Text */}
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: 'rgba(255, 255, 255, 0.65)' }}
          >
            {insight.text}
          </p>

          {/* Suggestion */}
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              background: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              color: 'rgba(212, 175, 55, 0.7)',
            }}
          >
            {insight.suggestion}
          </div>
        </div>
      ))}
    </div>
  );
}