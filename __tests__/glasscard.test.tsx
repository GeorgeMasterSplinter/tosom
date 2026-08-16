/**
 * GlassCard — test for den delte kort-komponenten (ACT v10 steg 1.1).
 *
 * Rendes via react-dom/server (node-omgivelser, ingen DOM trengs) og
 * sjekker at klassene som genereres er de som designtokensystemet forutser.
 *
 * Sjekk 9 — testen skal kunne feile:
 *   Fjerner man f.eks. `xl`-oppføringen i paddingMap, faller "xl" og "glow"
 *   og "className"-testene. Fjerner man HOVER_GOLD, faller "interactive".
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import GlassCard, { GlassCardProps } from '@/components/ui/cards/GlassCard';

function render(props: Partial<GlassCardProps>): string {
  return renderToStaticMarkup(
    React.createElement(GlassCard, { ...props, children: React.createElement('span', null, 'innhold') }),
  );
}

describe('GlassCard — padding', () => {
  test('sm gir p-[var(--ts-spacing-sm)]', () => {
    expect(render({ padding: 'sm' })).toContain('p-[var(--ts-spacing-sm)]');
  });

  test('md gir p-[var(--ts-spacing-md)]', () => {
    expect(render({ padding: 'md' })).toContain('p-[var(--ts-spacing-md)]');
  });

  test('lg (standard) gir p-[var(--ts-spacing-xl)]', () => {
    expect(render({})).toContain('p-[var(--ts-spacing-xl)]');
  });

  test('xl gir p-[var(--ts-spacing-2xl)]', () => {
    expect(render({ padding: 'xl' })).toContain('p-[var(--ts-spacing-2xl)]');
  });
});

describe('GlassCard — base (alt alltid tilstede)', () => {
  test('har radius, glass-bakgrunn og blur', () => {
    const html = render({});
    expect(html).toContain('rounded-[var(--ts-radius-xl)]');
    expect(html).toContain('bg-[var(--ts-glass-bg)]');
    expect(html).toContain('backdrop-blur-[var(--ts-glass-blur)]');
  });

  test('standard er hvitkant, ikke gull', () => {
    const html = render({});
    expect(html).toContain('border-[var(--ts-glass-border)]');
    expect(html).not.toContain('border-[var(--ts-glass-border-gold)]');
  });

  test('ingen role/aria-label (fjernet som støy)', () => {
    const html = render({});
    expect(html).not.toContain('role=');
    expect(html).not.toContain('aria-label');
  });

  test('ingen inline-stil i utskriften', () => {
    const html = render({ padding: 'xl', gold: true, interactive: true, glow: true });
    expect(html).not.toContain('style=');
  });
});

describe('GlassCard — gold-variant', () => {
  test('gold legger til gullkant', () => {
    const html = render({ gold: true });
    expect(html).toContain('border-[var(--ts-glass-border-gold)]');
    expect(html).not.toContain('border-[var(--ts-glass-border)]');
  });
});

describe('GlassCard — interactive (hover)', () => {
  test('interactive legger til hover-løft og lysere kant (hvit)', () => {
    const html = render({ interactive: true });
    expect(html).toContain('hover:-translate-y-1');
    expect(html).toContain('hover:border-[var(--ts-glass-border-hover)]');
    expect(html).toContain('hover:shadow-[var(--ts-glass-shadow-hover)]');
    expect(html).toContain('hover:bg-[var(--ts-glass-bg-hover)]');
  });

  test('gold+interactive bruker gull-hover-kant', () => {
    const html = render({ interactive: true, gold: true });
    expect(html).toContain('hover:border-[var(--ts-glass-border-gold-hover)]');
  });

  test('uten interactive er det ingen hover-klasser', () => {
    const html = render({});
    expect(html).not.toContain('hover:');
  });
});

describe('GlassCard — glow', () => {
  test('glow legger til gullskygge i ro', () => {
    const html = render({ glow: true });
    expect(html).toContain('shadow-[var(--ts-shadow-gold)]');
    expect(html).not.toContain('shadow-[var(--ts-glass-shadow)]');
  });
});

describe('GlassCard — className', () => {
  test('className føyes til utskriften', () => {
    const html = render({ className: 'ts-mine-ekstra' });
    expect(html).toContain('ts-mine-ekstra');
  });
});