/**
 * Tosom UI 3.0 — Desktop Window Chrome Component
 *
 * Electron glass title bar with window controls.
 * Provides native-looking window chrome for desktop builds.
 *
 * Usage:
 *   <DesktopChrome title="Tosom" controls={true}>
 *     <AppContent />
 *   </DesktopChrome>
 */

import React from 'react';

export interface DesktopChromeProps {
  children: React.ReactNode;
  title?: string;
  controls?: boolean;
  transparent?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  titleStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const DesktopChrome: React.FC<DesktopChromeProps> = ({
  children,
  title = 'Tosom',
  controls = true,
  transparent = false,
  onMinimize,
  onMaximize,
  onClose,
  titleStyle,
  style,
}) => {
  const chromeBarStyle: React.CSSProperties = {
    backgroundColor: transparent
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(10,15,31,0.98)',
    backdropFilter: 'blur(6px)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    height: 40,
    ...style,
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Title bar */}
      {controls && (
        <div style={{
          ...chromeBarStyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {/* Left: icon */}
          <button
            onClick={onMinimize}
            style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ fontSize: 14, color: '#D4AF37' }}>◆</span>
          </button>

          {/* Center: title */}
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 500,
            letterSpacing: 0.3,
            ...titleStyle,
          }}>
            {title}
          </span>

          {/* Right: window controls */}
          <div style={{ flexDirection: 'row', gap: 0 }}>
            {[
              { label: '-', action: onMinimize, color: '#FBBF24' },
              { label: '□', action: onMaximize, color: '#60A5FA' },
              { label: '✕', action: onClose, color: '#FF4D4D' },
            ].map((ctrl, i) => (
              <button
                key={i}
                onClick={ctrl.action}
                style={{
                  width: 46,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftWidth: 1,
                  borderColor: 'rgba(255,255,255,0.04)',
                  backgroundColor: 'transparent',
                  borderRight: 'none',
                  borderTop: 'none',
                  borderBottom: 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 10, color: ctrl.color, fontWeight: 600 }}>
                  {ctrl.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

DesktopChrome.displayName = 'DesktopChrome';
export default DesktopChrome;