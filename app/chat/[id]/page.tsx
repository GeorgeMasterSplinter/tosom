/**
 * ToSom — Chat Detail Page (MEGAMODUL)
 * 
 * Premium chat-vindu med:
 * - Pusher-sanntid for nye meldingar
 * - Typing-indikator
 * - AI-chatstarter
 * - Glassmorphism + gull UI
 * - Smooth auto-scroll
 * - Fade-in animasjonar
 */

'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useChatRealtime, useTypingIndicator } from '@/hooks/useChatRealtime';
import { useChatMessages, ChatMessage } from '@/hooks/useChatMessages';

interface StarterMessage {
  id: string;
  content: string;
  isSuggestion: boolean;
}

interface UserSession {
  id: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const conversationId = params?.id as string;

  // Session
  const [session, setSession] = useState<UserSession | null>(null);

  // Meldingar (hook)
  const { messages, loading, error: msgError, refresh: refreshMessages } = useChatMessages(conversationId, session?.id ?? null);

  // Input state
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

   // Typing-indikator
   const typingUsers = useTypingIndicator(conversationId, session?.id ?? null);
   const [showTyping, setShowTyping] = useState(false);

   // Track om brukar er i ferd med å skrive
   const [isUserTyping, setIsUserTyping] = useState(false);

  // AI-chatstarter
  const [starterOpen, setStarterOpen] = useState(false);
  const [starters, setStarters] = useState<StarterMessage[]>([]);
  const [loadingStarters, setLoadingStarters] = useState(false);

  // Pusher sanntid — nye meldingar
  const { init: initRealtime } = useChatRealtime({
    conversationId,
    userId: session?.id,
    onNewMessage: (message) => {
      // Legg til melding i lista utan double-duplikat
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message as unknown as ChatMessage];
      });
      setShowTyping(false);
    },
    onTyping: (data) => {
      if (data.isTyping) {
        setShowTyping(true);
        setTimeout(() => setShowTyping(false), 3000);
      } else {
        setShowTyping(false);
      }
    },
  });

  // Oppdater messages state (behovd for pusher)
  const setMessages = useCallback((updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    // Global state via event (simple)
    window.dispatchEvent(new CustomEvent('tosom-chat-updated', { detail: updater }));
  }, []);

  // Hent session
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/signin?json=true');
        if (res.ok) {
          const data = await res.json();
          setSession(data?.session ?? null);
        }
      } catch {
        // Use fallback
      }
    }
    fetchSession();
  }, []);

  // Init Pusher real-time
  useEffect(() => {
    if (conversationId && session?.id) {
      initRealtime();
    }
  }, [conversationId, session?.id, initRealtime]);

   // Scroll til botnen når nye meldingar kjem
   useEffect(() => {
     if (!messagesEndRef.current) return;
     messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
   }, [messages, showTyping]);

   // Send melding
   async function sendMessage() {
     if (!content.trim() || !conversationId || sending) return;

     setSending(true);
     const tempMsg: ChatMessage = {
       id: `temp-${Date.now()}`,
       content: content.trim(),
       createdAt: new Date().toISOString(),
       senderId: session?.id ?? '',
       sender: {
         id: session?.id ?? '',
         profile: { identityName: 'Deg' },
       },
     };

     // Optmistically add message
     setMessages((prev) => [...prev, tempMsg]);
     setContent('');

     try {
       const res = await fetch('/api/chat/messages', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ conversationId, content: content.trim() }),
       });

       if (!res.ok) {
         setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
         return;
       }

       const msg = await res.json();
       setMessages((prev) => prev.map((m) => m.id === tempMsg.id ? msg : m));
     } catch {
       setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
     } finally {
       setSending(false);
       inputRef.current?.focus();
     }
   }

  // AI-chatstarter
  async function fetchStarters() {
    setLoadingStarters(true);
    try {
      // Finn match for denne samtalen
      const res = await fetch(`/api/chat/conversations`);
      if (!res.ok) return;
      const convos = await res.json();
      const current = convos.find((c: { id: string }) => c.id === conversationId);
      if (!current) return;

      // Bruk ein fake matchId for starter-generering
      const matchId = current.id;
      const res2 = await fetch('/api/chat/starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });
      if (!res2.ok) return;
      const data = await res2.json();
      setStarters(data.starters);
      setStarterOpen(true);
    } finally {
      setLoadingStarters(false);
    }
  }

  function sendStarterMessage(content: string) {
    setContent(content);
    setStarterOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Lastar samtale...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

   const otherName = 'Din match';

   return (
     <div className="h-screen flex flex-col" style={{ background: '#0B0E11' }}>
       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6" style={{ scrollBehavior: 'smooth' }}>
         <div className="max-w-[720px] mx-auto space-y-[6px]">
           {/* Empty state */}
           {messages.length === 0 && !msgError && (
             <div className="text-center py-20 fade-in" style={{ animation: 'fadeInUp 0.4s ease-out both' }}>
               <div
                 className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
                 style={{
                   background: 'rgba(212, 175, 55, 0.08)',
                   border: '1px solid rgba(212, 175, 55, 0.18)',
                   boxShadow: '0 0 24px rgba(212,175,55,0.2), 0 0 48px rgba(212,175,55,0.1)',
                   animation: 'pulseGlow 2.5s infinite ease-in-out',
                 }}
               >
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                   <path d="M21 11.5C21 16.194 16.974 20.5 12 20.5C9.374 20.5 6.974 19.5 5 17.5C5 17.5 5 17.5 5 17.5C3.5 16 2.5 14 2.5 11.5C2.5 7.358 6.581 4 12 4C17.419 4 21.5 7.358 21.5 11.5" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
                 </svg>
               </div>
               <p className="text-lg font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                 Det er tomt her — men det blir ikkje det.
               </p>
               <p className="text-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                 Det første steget er alltid det viktigste. Bare sei hei.
               </p>

              {/* AI Starter Button */}
              <button
                onClick={fetchStarters}
                disabled={loadingStarters}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: loadingStarters
                    ? 'rgba(212, 175, 55, 0.2)'
                    : 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  color: loadingStarters ? 'rgba(212, 175, 55, 0.6)' : '#D4AF37',
                  cursor: loadingStarters ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!loadingStarters) {
                    (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.18)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingStarters) {
                    (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.1)';
                  }
                }}
              >
                {loadingStarters ? 'Genererer...' : '✨ Fi har ein startmelding til deg'}
              </button>

              <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 12px rgba(212,175,55,0.15); } 50% { box-shadow: 0 0 28px rgba(212,175,55,0.35); } }
              `}</style>
            </div>
          )}

           {/* Messages */}
           {messages.map((msg, i) => {
             const isMine = msg.senderId === session?.id;
             const bubbleRadius = isMine
               ? '18px 18px 4px 18px'
               : '18px 18px 18px 4px';

             return (
               <div
                 key={msg.id}
                 className={`flex ${isMine ? 'justify-end' : 'justify-start'} fade-in`}
                 style={{ animation: `fadeInUp 0.3s ease-out both`, animationDelay: `${i * 0.04}s` }}
               >
                 <div
                   className="max-w-[75%] md:max-w-[65%] px-4 py-3 transition-all duration-200 ease-out"
                   style={{
                     background: isMine
                       ? 'rgba(212, 175, 55, 0.12)'
                       : 'rgba(255, 255, 255, 0.06)',
                     backdropFilter: isMine ? 'blur(16px)' : 'blur(12px)',
                     border: isMine
                       ? '1px solid rgba(212, 175, 55, 0.25)'
                       : '1px solid rgba(255, 255, 255, 0.1)',
                     borderRadius: bubbleRadius,
                     color: isMine ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                     boxShadow: isMine
                       ? '0 2px 16px rgba(212,175,55,0.12), 0 0 8px rgba(212,175,55,0.08)'
                       : '0 2px 12px rgba(0,0,0,0.08)',
                   }}
                 >
                   <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                     {msg.content}
                   </p>
                   <p
                     className="text-[10px] mt-1.5 text-right"
                     style={{ color: isMine ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.3)' }}
                   >
                     {new Date(msg.createdAt).toLocaleTimeString('no-NO', {
                       hour: '2-digit',
                       minute: '2-digit',
                     })}
                   </p>
                 </div>
               </div>
             );
           })}

           {/* Typing indicator */}
           {showTyping && (
             <div className="flex justify-start fade-in" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
               <div
                 className="px-4 py-3 rounded-2xl rounded-bl-4xl"
                 style={{
                   background: 'rgba(212, 175, 55, 0.06)',
                   border: '1px solid rgba(212, 175, 55, 0.12)',
                   boxShadow: '0 0 12px rgba(212,175,55,0.15)',
                   backdropFilter: 'blur(16px)',
                 }}
               >
                 <div className="flex gap-1.5 items-center">
                   <div
                     className="w-2 h-2 rounded-full"
                     style={{
                       background: 'rgba(212, 175, 55, 0.7)',
                       animation: 'typingDot 1.2s infinite ease-in-out',
                     }}
                   />
                   <div
                     className="w-2 h-2 rounded-full"
                     style={{
                       background: 'rgba(212, 175, 55, 0.5)',
                       animation: 'typingDot 1.2s infinite ease-in-out 0.15s',
                     }}
                   />
                   <div
                     className="w-2 h-2 rounded-full"
                     style={{
                       background: 'rgba(212, 175, 55, 0.7)',
                       animation: 'typingDot 1.2s infinite ease-in-out 0.3s',
                     }}
                   />
                 </div>
               </div>
             </div>
           )}

          <div ref={messagesEndRef} />
        </div>
      </div>

       {/* Input Area - sticky på mobil */}
       <div
         className="px-4 py-4 border-t"
         style={{
           background: 'rgba(11, 14, 17, 0.95)',
           backdropFilter: 'blur(20px)',
           borderColor: 'rgba(255, 255, 255, 0.06)',
           position: 'sticky',
           bottom: 0,
           paddingBottom: 'env(safe-area-inset-bottom, 8px)',
         }}
       >
         <div className="max-w-[720px] mx-auto flex gap-3 items-center">
           <input
             ref={inputRef}
             type="text"
             value={content}
             onChange={(e) => setContent(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Skriv ei melding…"
             className="flex-1 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
             style={{
               background: 'rgba(255, 255, 255, 0.04)',
               border: '1px solid rgba(255, 255, 255, 0.12)',
               color: '#FFFFFF',
             }}
             onFocus={(e) => {
               e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
               e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15), 0 0 12px rgba(212,175,55,0.15)';
             }}
             onBlur={(e) => {
               e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
               e.target.style.boxShadow = 'none';
             }}
           />
           <button
             onClick={sendMessage}
             disabled={!content.trim() || sending}
             className="px-5 py-3 rounded-xl font-medium transition-all duration-200 flex-shrink-0 flex items-center gap-2 hover:scale-[1.04] active:scale-[0.98]"
             style={{
               background: content.trim()
                 ? 'linear-gradient(135deg, #D4AF37, #E8C766)'
                 : 'rgba(255, 255, 255, 0.06)',
               color: content.trim() ? '#0B0E11' : 'rgba(255, 255, 255, 0.2)',
               opacity: content.trim() ? 1 : 0.6,
               boxShadow: content.trim() ? '0 2px 16px rgba(212,175,55,0.25)' : 'none',
               cursor: content.trim() ? 'pointer' : 'not-allowed',
               transition: 'all 0.2s ease-out',
             }}
             onMouseEnter={(e) => {
               if (content.trim() && !sending) {
                 (e.target as HTMLElement).style.boxShadow = '0 4px 24px rgba(212,175,55,0.45)';
                 (e.target as HTMLElement).style.transform = 'scale(1.04)';
               }
             }}
             onMouseLeave={(e) => {
               if (content.trim()) {
                 (e.target as HTMLElement).style.boxShadow = '0 2px 16px rgba(212,175,55,0.25)';
                 (e.target as HTMLElement).style.transform = 'scale(1)';
               }
             }}
           >
             {sending ? (
               <div className="w-4 h-4" style={{
                 border: '2px solid rgba(11,14,17,0.2)',
                 borderTopColor: '#0B0E11',
                 animation: 'spin 0.8s linear infinite',
               }} />
             ) : (
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                 <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
             )}
           </button>
         </div>
       </div>

      {/* AI Starter Modal */}
      {starterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setStarterOpen(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl"
            style={{
              background: 'rgba(11, 14, 18, 0.95)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212,175,55,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#D4AF37' }}>
              ✨ Forslag til startmelding
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {starters.map((s) => (
                <button
                  key={s.id}
                  onClick={() => sendStarterMessage(s.content)}
                  className="w-full text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    color: 'rgba(255, 255, 255, 0.75)',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.15)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.08)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  }}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{s.content}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStarterOpen(false)}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

       <style>{`
         @keyframes bounce {
           0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
           40% { transform: scale(1); opacity: 1; }
         }
         @keyframes spin { to { transform: rotate(360deg); } }
         @keyframes fadeInUp {
           from { opacity: 0; transform: translateY(12px); }
           to { opacity: 1; transform: translateY(0); }
         }
         @keyframes pulseGlow {
           0%, 100% { box-shadow: 0 0 12px rgba(212,175,55,0.15); }
           50% { box-shadow: 0 0 28px rgba(212,175,55,0.35); }
         }
         @keyframes typingDot {
           0%, 60%, 100% { transform: scale(0.85); opacity: 0.4; }
           30% { transform: scale(1.05); opacity: 0.85; }
         }
         .fade-in { animation: fadeInUp 0.3s ease-out both; }
       `}</style>
    </div>
  );
}