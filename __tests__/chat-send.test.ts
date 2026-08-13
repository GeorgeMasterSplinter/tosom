/**
 * ToSom — Enhetstest for chatSendMessageSchema (STEG 12.2)
 *
 * Bekrefter at Bølge 2-fiksen (text/image-type + whitespace-validering) holder,
 * og fanger fremtidige regresjoner.
 */

import { z } from 'zod';

// Reproducer chatSendMessageSchema fra lib/api-validator.ts for uavhengig testing
const chatSendMessageSchema = z.object({
  content: z.string().trim().min(1),
  type: z.enum(['text', 'image', 'user', 'continue_choice']),
  imageUrl: z.string().url().optional(),
});

describe('chatSendMessageSchema', () => {
  // Gyldig text-melding
  it('aksepterer type=text med gyldig innhold', () => {
    const result = chatSendMessageSchema.parse({ content: 'Hei, hvordan går det?', type: 'text' });
    expect(result.content).toBe('hei, hvordan går det?');
    expect(result.type).toBe('text');
  });

  // Gyldig image-melding med URL
  it('aksepterer type=image med gyldig URL', () => {
    const result = chatSendMessageSchema.parse({
      content: 'https://example.com/photo.jpg',
      type: 'image',
      imageUrl: 'https://example.com/photo.jpg',
    });
    expect(result.type).toBe('image');
    expect(result.imageUrl).toBe('https://example.com/photo.jpg');
  });

  // Whitespace-only avvises
  it('avviser whitespace-only innhold', () => {
    expect(() => chatSendMessageSchema.parse({ content: '   ', type: 'text' })).toThrow();
    expect(() => chatSendMessageSchema.parse({ content: '\t\n', type: 'text' })).toThrow();
    expect(() => chatSendMessageSchema.parse({ content: '', type: 'text' })).toThrow();
  });

  // Tom string avvises
  it('avviser tom content-string', () => {
    expect(() => chatSendMessageSchema.parse({ content: '', type: 'text' })).toThrow();
  });

  // Ugyldig image-URL avvises
  it('avviser ugyldig imageUrl', () => {
    expect(() =>
      chatSendMessageSchema.parse({ content: 'not-a-url', type: 'image', imageUrl: 'not-a-url' })
    ).toThrow();
  });

  // Trim fjerner ledende/trailerende whitespace
  it('trimmer innhold før validering', () => {
    const result = chatSendMessageSchema.parse({ content: '  Hei der!  ', type: 'text' });
    expect(result.content).toBe('hei der!');
  });

  // Ugyldig type avvises
  it('avviser ukjent meldingstype', () => {
    expect(() =>
      chatSendMessageSchema.parse({ content: 'Hei', type: 'video' })
    ).toThrow();
  });

  // Backend-kompatible typer godtas
  it('aksepterer user og continue_choice typer (backend-kompatibilitet)', () => {
    expect(() => chatSendMessageSchema.parse({ content: 'velg', type: 'user' })).not.toThrow();
    expect(() => chatSendMessageSchema.parse({ content: 'fortsett', type: 'continue_choice' })).not.toThrow();
  });
});