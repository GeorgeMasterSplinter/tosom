/* eslint-disable react-hooks/exhaustive-deps */
/**
 * ToSom — BliKjentPanel (Premium Nordic Gold 2026) 🟡⭐
 * Premium panel for guidede spørsmål med glassmorphism-design.
 * 
 * Design:
 * - Fullskjerm glass-panel med backdrop-blur-xl
 * - Animer slide-down (300ms ease-out)
 * - Kategori-knappar med glow-effekt
 * - Spørsmåls-kort med djupne-indikatorar
 * - Premium "Send til partner"-knapp
 * 
 * Struktur:
 * 1. Kategori-visning (dersom ingen kategori er vald)
 * 2. Spørsmålsliste (dersom ein kategori er vald)
 * 3. "Send til partner"-flow (dersom eit spørsmål er vald)
 */

"use client";

import { useState, useEffect } from 'react';
import { useChat } from '@/app/chat/context/ChatContext';

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldDeep: "#C49F2F",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.3)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBgActive: "rgba(212,175,55,0.1)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  glassBgDark: "rgba(11,21,32,0.85)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
};

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface Question {
  id: string;
  content: string;
  depthLevel: number;
  order: number;
}

/* ═══════════════════════════════════════
   DEPTH CONFIG — Fargar og etikettar
   ═══════════════════════════════════════ */

const DEPTH = {
  1: { label: 'Overflatisk', color: '#4DFF88', bg: 'rgba(77,255,136,0.12)', glow: 'rgba(77,255,136,0.25)' },
  2: { label: 'Midtre', color: G.gold, bg: `${G.goldSoft}`, glow: G.goldMuted },
  3: { label: 'Djupt', color: '#FF6B8A', bg: 'rgba(255,107,138,0.12)', glow: 'rgba(255,107,138,0.25)' },
};

/* ═══════════════════════════════════════
   BLI KJENT PANEL — hovudkomponent
   ═══════════════════════════════════════ */

interface BliKjentPanelProps {
  onClose: () => void;
}

export function BliKjentPanel({ onClose }: BliKjentPanelProps) {
  const { sendMessage } = useChat();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Animer panel-open
  useEffect(() => {
    const timer = setTimeout(() => setPanelOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Hent kategoriar ved lasting
  useEffect(() => {
    fetchCategories();
  }, []);

  // Hent spørsmål når kategori er vald
  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions(selectedCategory.id);
    }
  }, [selectedCategory?.id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Feil ved lasting av kategorier:', err);
    }
  };

  const fetchQuestions = async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?categoryId=${categoryId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Feil ved lasting av spørsmål:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async () => {
    if (!selectedQuestion || sending) return;
    setSending(true);
    try {
      await sendMessage(selectedQuestion.content, 'text');
      // Reset og lukk med forsinkelse for animasjon
      setTimeout(() => onClose(), 200);
    } catch (err) {
      console.error('Feil ved sending av spørsmål:', err);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setQuestions([]);
  };

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(onClose, 300); // Vent på animasjon
  };

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-out"
      style={{
        maxHeight: panelOpen ? '480px' : '0px',
        opacity: panelOpen ? 1 : 0,
        background: `linear-gradient(180deg, ${G.glassBgDark} 0%, rgba(7,13,20,0.95) 100%)`,
        borderTop: `1px solid ${G.glassBorderGold}`,
        borderBottom: `1px solid ${G.glassBorderGold}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 16px ${G.goldSoft}`,
      }}
    >
      {/* ═══ HEADER — Med backdrop-blur ═══ */}
      <div 
        className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10"
        style={{ 
          borderBottom: `1px solid ${G.glassBorder}`,
          background: 'rgba(11,21,32,0.7)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <button
              onClick={handleBack}
              className="text-sm font-medium transition-all duration-200 hover:brightness-125 active:scale-95"
              style={{ color: G.gold }}
            >
              ← Tilbake
            </button>
          )}
          <div className="h-4 w-px" style={{ background: G.glassBorder }} />
          <h3 
            className="text-sm font-semibold tracking-wide"
            style={{ color: G.textPrimary }}
          >
            {selectedCategory ? (
              <span>
                <span style={{ color: selectedCategory.color }}>{selectedCategory.icon}</span>
                {' '}— {selectedCategory.name}
              </span>
            ) : 'Bli kjent med partneren'}
          </h3>
        </div>
        <button 
          onClick={handleClose}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90"
          style={{ color: G.textMuted, background: G.glassBg }}
        >
          ✕
        </button>
      </div>

      {/* ═══ BODY — Scrollbart ═══ */}
      <div className="overflow-y-auto max-h-[400px] p-5">
        
        {/* ═══ KATEGORIAR — Grid-layout ═══ */}
        {!selectedCategory && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}08, ${cat.color}15)`,
                  border: `1px solid ${cat.color}25`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Kategori-ikon med glow */}
                <div 
                  className="text-3xl transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    color: cat.color,
                    filter: `drop-shadow(0 0 8px ${cat.color}40)`,
                  }}
                >
                  {cat.icon}
                </div>
                
                {/* Kategori-namn */}
                <div className="text-center">
                  <p 
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: G.textPrimary }}
                  >
                    {cat.name}
                  </p>
                  <p 
                    className="text-[10px] mt-0.5 font-medium"
                    style={{ color: G.textSecondary }}
                  >
                    {cat.count} spørsmål
                  </p>
                </div>
                
                {/* Hover-glow overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${cat.color}15, transparent 70%)`,
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* ═══ SPØRSMÅL — Liste med kort ═══ */}
        {selectedCategory && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div 
                  className="w-8 h-8 rounded-full animate-spin"
                  style={{ 
                    border: `2px solid ${G.glassBorder}`,
                    borderTopColor: G.gold,
                  }}
                />
                <p className="text-xs font-medium" style={{ color: G.textSecondary }}>
                  Lastar spørsmål...
                </p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-medium" style={{ color: G.textSecondary }}>
                  Ingen spørsmål funnen for denne kategorien.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {questions.map((q, index) => {
                  const depth = DEPTH[q.depthLevel] || DEPTH[1];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestion(q)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        selectedQuestion?.id === q.id ? 'scale-[1.01]' : 'hover:scale-[1.005]'
                      }`}
                      style={{
                        background: selectedQuestion?.id === q.id
                          ? `${depth.color}15`
                          : `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`,
                        border: `1px solid ${selectedQuestion?.id === q.id ? depth.color + '40' : G.glassBorder}`,
                        boxShadow: selectedQuestion?.id === q.id 
                          ? `0 0 16px ${depth.color}20`
                          : '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Djupne-indikator — Animer prikk */}
                        <div 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 transition-all duration-300"
                          style={{ 
                            background: depth.color,
                            boxShadow: `0 0 8px ${depth.glow}`,
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          {/* Spørsmålstekst */}
                          <p 
                            className="text-sm leading-relaxed transition-colors duration-200"
                            style={{ 
                              color: selectedQuestion?.id === q.id 
                                ? G.textPrimary 
                                : 'rgba(255,255,255,0.75)',
                            }}
                          >
                            {q.content}
                          </p>
                          
                          {/* Djupne-etikett */}
                          <span
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all duration-200"
                            style={{
                              background: depth.bg,
                              color: depth.color,
                              border: `1px solid ${depth.color}20`,
                            }}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: depth.color }}
                            />
                            {depth.label} · Djupne {q.depthLevel}/3
                          </span>
                        </div>

                        {/* Peik-ikon ved hover */}
                        <span 
                          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: G.textMuted }}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══ SPØRSMÅL VALGT — Send-bekreftelse ═══ */}
        {selectedQuestion && !loading && (
          <div 
            className="mt-5 p-5 rounded-2xl transition-all duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${G.goldSoft}, rgba(212,175,55,0.12))`,
              border: `1px solid ${G.goldMuted}`,
              boxShadow: `0 4px 20px rgba(212,175,55,0.1), inset 0 0 24px rgba(212,175,55,0.03)`,
            }}
          >
            {/* Overskrift */}
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: G.gold,
                  boxShadow: `0 0 8px ${G.goldMuted}`,
                }}
              />
              <p 
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: G.goldLight }}
              >
                Send til partner?
              </p>
            </div>
            
            {/* Spørsmålstekst */}
            <p 
              className="text-base leading-relaxed mb-4 font-medium italic"
              style={{ color: G.textPrimary }}
            >
              "{selectedQuestion.content}"
            </p>
            
            {/* Djupne-indikator */}
            <div className="flex items-center gap-2 mb-4">
              {(DEPTH[selectedQuestion.depthLevel]) && (
                <span 
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: (DEPTH[selectedQuestion.depthLevel]).bg,
                    color: (DEPTH[selectedQuestion.depthLevel]).color,
                  }}
                >
                  {(DEPTH[selectedQuestion.depthLevel]).label} · Djupne {selectedQuestion.depthLevel}/3
                </span>
              )}
            </div>
            
            {/* Knappar */}
            <div className="flex gap-2.5">
              <button
                onClick={handleSendQuestion}
                disabled={sending}
                className="flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                  color: '#0B1520',
                  boxShadow: `0 4px 16px ${G.goldMuted}`,
                }}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full animate-spin inline-block"
                      style={{ 
                        border: `2px solid rgba(11,21,32,0.3)`,
                        borderTopColor: '#0B1520',
                      }}
                    />
                    Sender...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    ✨ Send spørsmål
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 hover:brightness-125 active:scale-[0.98]"
                style={{
                  background: G.glassBg,
                  border: `1px solid ${G.glassBorder}`,
                  color: G.textSecondary,
                }}
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PREMIUM CSS-ANIMASJONAR ═══ */}
      <style jsx>{`
        /* Scrollbar-styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212,175,55,0.35);
        }
      `}</style>
    </div>
  );
}

export default BliKjentPanel;