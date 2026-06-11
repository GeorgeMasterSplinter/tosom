/** ToSom BrandDemo
 *  BR11 — Vis alle farger, typografi, knapper, ikon og eksempeltekst */

'use client';

import React from 'react';
import { useBrandColors } from './BrandProvider';
import { useBrandTypography } from './BrandProvider';
import { BrandButton } from './BrandButton';
import { BrandIcon } from './BrandIcon';
import { BrandTitle, BrandSubtitle, BrandText } from './BrandText';
import { iconNames } from '@/lib/branding/icons';

export function BrandDemo() {
  const c = useBrandColors();
  const t = useBrandTypography();

  const colorKeys = Object.keys(c) as (keyof typeof c)[];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12" style={{ fontFamily: t.fontFamily }}>
      {/* Farger */}
      <section>
        <BrandTitle variant="heading2" className="mb-4">Fargepalett</BrandTitle>
        <BrandSubtitle className="mb-6">ToSom sin visuelle identitet</BrandSubtitle>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {colorKeys.map((key) => {
            const val = c[key];
            const isObj = typeof val === 'object' && val !== null && !('toString' in val);
            const displayVal = isObj ? JSON.stringify(val, null, 2) : String(val);
            return (
              <div key={key} className="space-y-2">
                <div
                  className="w-full aspect-square rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: typeof val === 'string' ? val : '#ccc',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium">{String(key)}</p>
                  <p className="text-[10px] text-gray-500 break-all">{displayVal}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Typografi */}
      <section>
        <BrandTitle variant="heading2" className="mb-4">Typografi</BrandTitle>
        <BrandSubtitle className="mb-6">Inter — rolig, moden, lesbar</BrandSubtitle>
        <div className="space-y-4">
          <div>
            <BrandText variant="heading1">title — text-xl font-semibold</BrandText>
          </div>
          <div>
            <BrandText variant="heading2">heading2 — text-2xl font-semibold</BrandText>
          </div>
          <div>
            <BrandText variant="heading3">heading3 — text-xl font-semibold</BrandText>
          </div>
          <div>
            <BrandText variant="heading4">heading4 — text-lg font-semibold</BrandText>
          </div>
          <div>
            <BrandText variant="title">title — text-xl tracking-tight</BrandText>
          </div>
          <div>
            <BrandText variant="subtitle">subtitle — text-base text-gray-600</BrandText>
          </div>
          <div>
            <BrandText variant="bodyLarge">body-lg — text-[15px] leading-relaxed</BrandText>
          </div>
          <div>
            <BrandText variant="bodyMedium">body-md — text-sm leading-relaxed</BrandText>
          </div>
          <div>
            <BrandText variant="bodySmall">body-sm — text-xs leading-relaxed</BrandText>
          </div>
          <div>
            <BrandText variant="caption">caption — text-xs text-gray-500</BrandText>
          </div>
          <div>
            <BrandText variant="overline">overline — text-[11px] uppercase tracking-wider</BrandText>
          </div>
        </div>
      </section>

      {/* Knapper */}
      <section>
        <BrandTitle variant="heading2" className="mb-4">Knapper</BrandTitle>
        <BrandSubtitle className="mb-6">Primær, sekundær, tertiær, ghost, success</BrandSubtitle>
        <div className="flex flex-wrap gap-4">
          <BrandButton variant="primary">Primær</BrandButton>
          <BrandButton variant="secondary">Sekundær</BrandButton>
          <BrandButton variant="tertiary">Tertiær</BrandButton>
          <BrandButton variant="ghost">Ghost</BrandButton>
          <BrandButton variant="success">Success</BrandButton>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <BrandButton variant="primary" size="sm">Liten primær</BrandButton>
          <BrandButton variant="primary" size="md">Midtre primær</BrandButton>
          <BrandButton variant="primary" size="lg">Stor primær</BrandButton>
        </div>
      </section>

      {/* Ikon */}
      <section>
        <BrandTitle variant="heading2" className="mb-4">Ikon</BrandTitle>
        <BrandSubtitle className="mb-6">Outline-stil, 1.75px stroke, runde hjørner</BrandSubtitle>
        <div className="flex flex-wrap gap-6">
          {iconNames.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                <BrandIcon name={name} size={24} />
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tone of voice */}
      <section>
        <BrandTitle variant="heading2" className="mb-4">Tone of Voice</BrandTitle>
        <BrandSubtitle className="mb-6">Varm · Rolig · Moden · Kortfattet · Trygg</BrandSubtitle>
        <div className="space-y-3 p-6 rounded-xl bg-accent border border-beige">
          <BrandText variant="bodyLarge">
            Hei, jeg heter Kari og bor i Bergen. Jeg leter etter en som vil dele gode matkvelder og stille stunder.
          </BrandText>
          <BrandText variant="bodyLarge" className="text-secondary">
            Jeg trives best med en kopp kaffe og en god bok. Kanskje du også?
          </BrandText>
          <BrandText variant="bodyMedium" className="text-gray-500">
            Svar gjerne med hva som gjorde deg glad sist.
          </BrandText>
        </div>
      </section>
    </div>
  );
}
