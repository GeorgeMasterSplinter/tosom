"use client";

import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'gold' | 'red' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
}

export default function Button({ variant = 'default', size = 'md', children, onClick, href, target, className = '' }: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3"
  }[size];

  const baseClasses = `${sizeClasses} rounded-[12px] font-medium transition-all duration-300 focus:outline-none cursor-pointer`;

  let variantClasses = "";
  switch (variant) {
    case 'gold':
    case 'primary':
      variantClasses = "bg-[#D4AF37] text-black hover:bg-[#E8C766] shadow-[0_0_24px_rgba(212,175,55,0.3)] focus:ring-2 focus:ring-[#D4AF37]";
      break;
    case 'red':
      variantClasses = "bg-[#E53935] text-white hover:bg-[#D32F2F] focus:ring-2 focus:ring-[#E53935]";
      break;
    case 'secondary':
      variantClasses = "bg-transparent border border-white/10 text-white/90 hover:bg-white/5 focus:ring-2 focus:ring-white/20";
      break;
    case 'ghost':
      variantClasses = "bg-transparent text-white/60 hover:text-white/90 hover:bg-white/[0.03] focus:ring-2 focus:ring-white/10";
      break;
    default:
      variantClasses = "bg-white/[0.04] border border-white/10 hover:bg-white/[0.06] text-white focus:ring-2 focus:ring-[#D4AF37]/50 backdrop-blur-xl";
  }

  const finalClasses = `${baseClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={finalClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={finalClasses}>
      {children}
    </button>
  );
}