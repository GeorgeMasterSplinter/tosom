/** Tosom-ikonkomponent
 *  BR9 — BrandIcon med outline-stil, 1.75px stroke, runde hjørner */

'use client';

import React from 'react';
import { useBrandColors } from './BrandProvider';
import { iconPath, type IconName } from '@/lib/branding/icons';

interface BrandIconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Ikonkomponent — rolig geometri, outline, 1.75px stroke */
export function BrandIcon({ name, size = 24, className = '', strokeWidth = 1.75 }: BrandIconProps) {
  const c = useBrandColors();
  const pathD = iconPath(name);
  if (!pathD) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`text-[${c.text}] ${className}`}
      style={{
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <path d={pathD} />
    </svg>
  );
}
