/**
 * ToSom — Enhetstest for chatSendMessageSchema (STEG 3.3)
 *
 * Bekrefter at schemaet (text/image-type + whitespace-validering) holder.
 * STEG 3.3: Rettet expectations — schemaet trimmer, lowercases IKKE.
 */

import { z } from 'zod';

// Import faktiske schema fra koden — ikke reprodusert versjon
import { chatSendMessageSchema } from '@/lib/api-validator';

describe('chatSendMessageSchema', () => {
  // Gyldig text-melding
  it('aksepterer type=text med gyldig innhold', () => {
    const result = chatSendMessageSchema.parse({
      conversationId: 'conv-123',
      content: 'Hei, hvordan går det?',
      type: 'text',
    });
    expect(result.content).toBe('Hei, hvordan går det?');
    expect(result.type).toBe('text');
  });

  // Whitespace-only avvises
  it('avviser whitespace-only innhold', () => {
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: '   ', type: 'text' })
    ).toThrow();
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: '\t\n', type: 'text' })
    ).toThrow();
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: '', type: 'text' })
    ).toThrow();
  });

  // Tom string avvises
  it('avviser tom content-string', () => {
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: '', type: 'text' })
    ).toThrow();
  });

  // Trim fjerner ledende/trailerende whitespace (men lowercases IKKE)
  it('trimmer innhold før validering', () => {
    const result = chatSendMessageSchema.parse({
      conversationId: 'conv-123',
      content: '  Hei der!  ',
      type: 'text',
    });
    expect(result.content).toBe('Hei der!');
  });

  // Ugyldig type avvises
  it('avviser ukjent meldingstype', () => {
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: 'Hei', type: 'video' })
    ).toThrow();
  });

  // Backend-kompatible typer godtas
  it('aksepterer user og continue_choice typer (backend-kompatibilitet)', () => {
    expect(() =>
      chatSendMessageSchema.parse({ conversationId: 'conv-123', content: 'velg', type: 'user' })
    ).not.toThrow();
    expect(() =>
      chatSendMessageSchema.parse({
        conversationId: 'conv-123',
        content: 'fortsett',
        type: 'continue_choice',
      })
    ).not.toThrow();
  });

  // Manglende conversationId avvises
  it('avviser manglende conversationId', () => {
    expect(() => chatSendMessageSchema.parse({ content: 'Hei', type: 'text' })).toThrow();
  });
});