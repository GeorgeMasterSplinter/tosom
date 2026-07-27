/* ═══════════════════════════════════════════
   ToSom SettingsCard — Design System 1.1
   Glassmorphism kort for innstillinger.
   Bruk i dashboard og settings-sider.
   ═══════════════════════════════════════════ */

'use client';

import { HTMLProps, forwardRef } from 'react';

export interface SettingsCardProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'gold';
}

const variantClasses: Record<string, string> = {
  default:
    'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]',
  glass:
    'bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] shadow-lg',
  gold:
    'bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.20)] shadow-gold',
};

export const SettingsCard = forwardRef<HTMLDivElement, SettingsCardProps>(
  ({ title, description, icon, variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl p-6 transition-all duration-300
          hover:border-[rgba(255,255,255,0.16)]
          ${variantClasses[variant]}
          ${className}
        `.trim()}
        {...props}
      >
        {/* Hovudseksjon */}
        {(title || icon) && (
          <div className="flex items-start gap-4 mb-4">
            {icon && (
              <div
                className="text-2xl flex-shrink-0"
                style={{ color: '#D4AF37' }}
              >
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3
                  className="text-lg font-semibold mb-1"
                  style={{ color: '#FFFFFF' }}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Innhald */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);

SettingsCard.displayName = 'SettingsCard';

export default SettingsCard;