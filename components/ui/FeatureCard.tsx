/* ═══════════════════════════════════════════
   ToSom Premium — FeatureCard Component
   Ikon + tittel + beskrivelse
   ═══════════════════════════════════════════ */

import { Card } from "./Card";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="opacity-0 translate-y-6 transition-all duration-[var(--ts-transition-slow)] ease-out"
      style={{ transitionDelay: `${delay}ms` }}
      data-feature-card
    >
      <Card variant="standard" padding="lg">
        <div
          className="mb-3 flex h-[56px] w-[56px] items-center justify-center rounded-[var(--ts-radius-md)] border"
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            borderColor: "rgba(212, 175, 55, 0.2)",
            color: "var(--ts-gold)",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            fontSize: "var(--ts-font-heading-m)",
            color: "var(--ts-text-primary)",
            marginBottom: "8px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "var(--ts-text-muted)",
            fontSize: "var(--ts-font-small)",
            lineHeight: "1.65",
          }}
        >
          {description}
        </p>
      </Card>
    </div>
  );
};

export default FeatureCard;
