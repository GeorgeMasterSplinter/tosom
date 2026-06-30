/**
 * ToSom — AISuggestButton
 * 
 * Genbrukbar AI-knapp med:
 *   - glassmorphism
 *   - warmFlow-glow
 *   - ✨ emoji
 *   - hover: scale(1.03)
 * 
 * Bruk:
 *   <AISuggestButton onClick={() => doAISomething()} />
 */

'use client';

import { useState, useCallback } from 'react';

interface AISuggestButtonProps {
  /** Klikk-handling */
  onClick: () => void;
  /** Knapp-tekst */
  label?: string;
  /** Ikon */
  icon?: string;
  /** Small/normal size */
  size?: 'sm' | 'md';
  /** Disabled? */
  disabled?: boolean;
  /** Loading? */
  loading?: boolean;
  /** Ekstra className */
  className?: string;
}

export default function AISuggestButton({
  onClick,
  label = '✨ AI',
  icon = '✨',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
}: AISuggestButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glow, setGlow] = useState('');

  const handleClick = useCallback(() => {
    if (!disabled && !loading) {
      onClick();
    }
  }, [onClick, disabled, loading]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl
        transition-all duration-300
        ${!disabled && !loading ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-not-allowed opacity-50'}
        ${className}
      `}
      style={{
        background: isHovered
          ? 'rgba(212, 175, 55, 0.15)'
          : 'rgba(212, 175, 55, 0.08)',
        border: `1px solid ${isHovered ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.15)'}`,
        boxShadow: glow || '0 2px 12px rgba(212, 175, 55, 0.08)',
        backdropFilter: 'blur(10px)',
        transform: isHovered && !disabled && !loading ? 'scale(1.03)' : 'scale(1)',
        fontSize: size === 'sm' ? '12px' : '13px',
        color: isHovered ? '#E8C766' : 'rgba(212, 175, 55, 0.8)',
        fontWeight: 500,
      }}
      onMouseEnter={() => {
        if (!disabled && !loading) {
          setIsHovered(true);
          setGlow('0 4px 20px rgba(212, 175, 55, 0.2), 0 0 30px rgba(212, 175, 55, 0.1)');
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setGlow('');
      }}
    >
      {loading ? (
        <div
          className="w-3.5 h-3.5"
          style={{
            border: '1.5px solid rgba(212, 175, 55, 0.2)',
            borderTopColor: '#D4AF37',
            animation: 'tosom-spin 0.8s linear infinite',
            borderRadius: '50%',
          }}
        />
      ) : (
        <span>{icon}</span>
      )}
      <span>{label}</span>
    </button>
  );
}

// Global style for spinner
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes tosom-spin { to { transform: rotate(360deg); } }`;
if (!document.querySelector('[data-tosom-spinner]')) {
  styleTag.setAttribute('data-tosom-spinner', 'true');
  document.head.appendChild(styleTag);
}