"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — SectionFeatures
   3-kolonnar feature-grid med ikon
   ═══════════════════════════════════════════ */

import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface SectionFeaturesProps {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
  gradient?: string;
  className?: string;
}

const defaultGradient =
  "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212, 175, 55, 0.04), transparent)";

export const SectionFeatures = ({
  title = "Hvorfor ToSom",
  subtitle,
  features,
  columns = 3,
  gradient = defaultGradient,
  className = "",
}: SectionFeaturesProps) => {
  const colClass = columns === 3
    ? "grid-cols-1 md:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2";

  return (
    <section
      className={`relative py-20 md:py-28 ${className}`}
      style={{ background: gradient }}
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          {title && (
            <h2
              className="mb-4 text-ts-text-primary animate-fadeInUp"
              style={{ fontSize: "clamp(24px, 3vw, 32px)" }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className="max-w-xl mx-auto text-ts-text-muted animate-fadeInUp"
              style={{ fontSize: "16px", lineHeight: "1.7" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className={`grid ${colClass} gap-6`}>
          {features.map((f, i) => (
            <Card
              key={i}
              className="animate-fadeInUp hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Ikon */}
              <div
                className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg border"
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  color: "#D4AF37",
                }}
              >
                {f.icon}
              </div>

              {/* Tittel */}
              <h3
                className="mb-2 text-ts-text-primary"
                style={{ fontSize: "18px", fontWeight: 600 }}
              >
                {f.title}
              </h3>

              {/* Beskriving */}
              <p
                className="text-ts-text-muted"
                style={{ fontSize: "14px", lineHeight: "1.65" }}
              >
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFeatures;
