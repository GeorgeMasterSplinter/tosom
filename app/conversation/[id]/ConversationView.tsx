"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import Skeleton from "@/components/ui/Skeleton";
import { emitJourneyUpdated } from "@/lib/journeyEvents";

const { H1, H2, BodyMd, BodySm } = Typography;

interface Message {
  senderId: string;
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  userAId: string;
  userBId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
}

interface JourneyData {
  steps: JourneyStep[];
  currentStep: number;
  current: JourneyStep;
  updatedAt: string;
}

interface PartnerProfile {
  name: string;
  age?: number | null;
  imageUrl?: string | null;
}

interface ConversationViewProps {
  conversationId: string;
}

export default function ConversationView({ conversationId }: ConversationViewProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errorSending, setErrorSending] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [journey, setJourney] = useState<JourneyData | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [journeyError, setJourneyError] = useState<string | null>(null);
  const [journeyAdvancing, setJourneyAdvancing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const prevTypingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* Hent conversation-data */
  useEffect(() => {
    let cancelled = false;
    async function fetchConversation() {
      try {
        setLoading(true);
        setError(null);
        setErrorSending(null);
        const res = await fetch(`/api/conversation/${conversationId}`);
        if (!res.ok) {
          if (res.status === 401) throw new Error("Du er ikke logget inn");
          throw new Error("Kunne ikke hente samtale");
        }
        const json: Conversation = await res.json();
        if (!cancelled) {
          setConversation(json);
          setCurrentUserId(json.userAId);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchConversation();
    return () => { cancelled = true; };
  }, [conversationId]);

  /* Hent journey-data */
  useEffect(() => {
    let cancelled = false;
    async function fetchJourney() {
      try {
        setJourneyLoading(true);
        setJourneyError(null);
        const res = await fetch(`/api/journey/${conversationId}`);
        if (!res.ok) throw new Error("Kunne ikke hente journey");
        const json: JourneyData = await res.json();
        if (!cancelled) setJourney(json);
      } catch (err: unknown) {
        if (!cancelled) setJourneyError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setJourneyLoading(false);
      }
    }
    fetchJourney();
    return () => { cancelled = true; };
  }, [conversationId]);

  /* Polling for nye meldinger */
  useEffect(() => {
    if (!isPolling || loading) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/conversation/${conversationId}`);
        if (!res.ok) return;
        const json: Conversation = await res.json();
        if (json.messages.length > (conversation?.messages.length ?? 0)) {
          prevMessageCountRef.current = conversation?.messages.length ?? 0;
          setConversation(json);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } catch { /* silently fail */ }
    }, 2000);
    return () => { clearInterval(interval); setIsPolling(false); };
  }, [conversationId, isPolling, loading, conversation?.messages.length]);

  /* Polling typing-status */
  useEffect(() => {
    if (!isPolling || loading) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/conversation/${conversationId}/typing`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.isTyping === true && !prevTypingRef.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        setPartnerTyping(json.isTyping === true);
        prevTypingRef.current = json.isTyping === true;
      } catch { /* silently fail */ }
    }, 1000);
    return () => { clearInterval(interval); setIsPolling(false); };
  }, [conversationId, isPolling, loading]);

  /* Partner profil (dummy) */
  useEffect(() => {
    if (!conversation) return;
    setPartnerProfile({ name: "Ukjent", age: 28, imageUrl: null });
  }, [conversation]);

  /* Scroll on new messages */
  useEffect(() => {
    const count = conversation?.messages.length ?? 0;
    if (count !== prevMessageCountRef.current && count > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessageCountRef.current = count;
    }
  }, [conversation?.messages.length]);

  /* Handle typing debounce */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim()) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      fetch(`/api/conversation/${conversationId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTyping: true }),
      }).catch(() => {});
      typingTimeoutRef.current = setTimeout(() => {
        fetch(`/api/conversation/${conversationId}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isTyping: false }),
        }).catch(() => {});
      }, 300);
    } else {
      fetch(`/api/conversation/${conversationId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTyping: false }),
      }).catch(() => {});
    }
  }, [conversationId]);

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  /* Send message */
  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const messageText = input.trim();
    setSending(true);
    setErrorSending(null);
    try {
      const res = await fetch(`/api/conversation/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText }),
      });
      if (res.ok) {
        const newMessage: Message = { senderId: currentUserId || "", content: messageText, createdAt: new Date() };
        setConversation((prev) => prev ? { ...prev, messages: [...prev.messages, newMessage], updatedAt: new Date() } : prev);
        setInput("");
        fetch(`/api/conversation/${conversationId}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isTyping: false }),
        }).catch(() => {});
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        const json = await res.json();
        setErrorSending(json.error || "Kunne ikke sende melding");
      }
    } catch {
      setErrorSending("Kunne ikke sende melding");
    } finally {
      setSending(false);
    }
  };

  /* Fullfør journey-steg */
  const handleCompleteStep = async () => {
    if (!journey || journeyAdvancing) return;
    setJourneyAdvancing(true);
    try {
      const res = await fetch(`/api/journey/${conversationId}`, { method: "POST" });
      if (res.ok) {
        const json: JourneyData = await res.json();
        setJourney(json);
        emitJourneyUpdated();
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        setJourneyError("Kunne ikke fullføre steg");
      }
    } catch {
      setJourneyError("Kunne ikke fullføre steg");
    } finally {
      setJourneyAdvancing(false);
    }
  };

  /* Loading — skeleton */
   if (loading) {
     return (
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary">
         <Section className="space-y-2xl py-2xl">
           <div className="flex items-center gap-lg">
             <Skeleton width="w-12" height="h-12" rounded="full" />
             <div className="space-y-md">
               <Skeleton width="w-32" height="h-6" rounded="md" />
               <Skeleton width="w-20" height="h-4" rounded="md" />
             </div>
           </div>
           <div className="space-y-lg">
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                 <Skeleton width="w-64" height="h-12" rounded="lg" className={i % 2 === 0 ? "bg-ts-gold-soft" : "bg-ts-glass-bg"} />
               </div>
             ))}
           </div>
         </Section>
       </div>
     );
   }

   /* Error */
   if (error) {
     return (
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex items-center justify-center px-section">
         <div className="text-center space-y-lg max-w-md">
           <BodyMd className="text-ts-error">{error}</BodyMd>
           <PremiumButton variant="secondary" onClick={() => { setIsPolling(false); window.location.reload(); }}>Prøv igjen</PremiumButton>
         </div>
       </div>
     );
   }

   if (!conversation) {
     return (
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex items-center justify-center px-section">
         <div className="text-center space-y-lg">
           <BodyMd className="text-text-muted">Ingen samtale å vise.</BodyMd>
         </div>
       </div>
     );
   }

  const isMyMessage = (msg: Message): boolean => msg.senderId === currentUserId;

  return (
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex flex-col relative overflow-hidden">
      {/* UI 4.2: calm-gradient-blue subtle bg */}
      <div className="absolute inset-0 calm-gradient-blue opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-ts-bg-primary/50 pointer-events-none" />

      {/* Header — UI 4.2: ts-glass-strong + gold-glow */}
      <div className="sticky top-0 z-10 ts-glass-strong backdrop-blur-strong border-b-ts-gold/10">
        <Section className="space-y-lg py-md">
          <FadeIn>
            <div className="flex items-center gap-lg animate-headerFade">
              {/* Avatar — UI 4.2: gold ring + glow */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-ts-bg-surface ring-2 ring-ts-gold/30 relative">
                <div className="absolute inset-0 gold-glow-sm rounded-full" />
                {partnerProfile?.imageUrl ? (
                  <img src={partnerProfile.imageUrl} alt={partnerProfile.name} className="w-full h-full object-cover relative z-10" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ts-gold text-lg font-light relative z-10">
                    {partnerProfile?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <H2 className="text-text-primary text-xl font-light">{partnerProfile?.name}</H2>
                {partnerProfile?.age && <BodySm className="text-ts-gold">{partnerProfile.age} år</BodySm>}
              </div>
              {/* Match badge — UI 4.2: gold-soft bg */}
              <div className="bg-ts-gold-soft border border-ts-gold/20 rounded-full px-md py-sm flex items-center gap-xs">
                <span className="w-1.5 h-1.5 bg-ts-gold rounded-full animate-pulse"></span>
                <BodySm className="text-ts-gold">Matcha</BodySm>
              </div>
            </div>
          </FadeIn>
        </Section>
      </div>

      {/* Meldingar + Journey */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative z-10 px-section py-2xl" style={{ scrollBehavior: "smooth" }}>
        <div className="max-w-2xl mx-auto space-y-xl">
          {/* Journey Card — UI 4.2: ts-glass-strong + gold border */}
          {journeyLoading ? (
            <FadeIn>
              <div className="mx-auto max-w-md ts-glass rounded-[var(--ts-radius-xl)] p-xl space-y-lg">
                <Skeleton width="w-3/4" height="h-6" rounded="md" />
                <Skeleton width="w-full" height="h-4" rounded="md" />
                <Skeleton width="w-3/4" height="h-4" rounded="md" />
                <Skeleton width="w-1/2" height="h-10" rounded="xl" />
              </div>
            </FadeIn>
          ) : journeyError ? (
            <FadeIn>
              <div className="mx-auto max-w-md rounded-[var(--ts-radius-xl)] bg-ts-glass-bg/50 border border-ts-error/30 p-xl text-center space-y-lg">
                <BodyMd className="text-ts-error">{journeyError}</BodyMd>
                <PremiumButton variant="secondary" onClick={() => setJourneyError(null)}>Prøv igjen</PremiumButton>
              </div>
            </FadeIn>
          ) : journey ? (
            <FadeIn>
              <div className="mx-auto max-w-md ts-glass-strong rounded-[var(--ts-radius-xl)] p-xl shadow-lg space-y-lg">
                <div className="flex items-center justify-between">
                  <BodySm className="text-ts-gold">Steg {journey.currentStep + 1} av {journey.steps.length}</BodySm>
                  <div className="flex gap-1">
                    {journey.steps.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= journey.currentStep ? "bg-ts-gold" : "bg-text-subtle/20"}`}></div>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-ts-gold">{journey.current.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{journey.current.description}</p>
                {journey.currentStep < journey.steps.length - 1 ? (
                  <PremiumButton variant="primary" onClick={handleCompleteStep} disabled={journeyAdvancing}>
                    {journeyAdvancing ? "Fullfører…" : "Fullfør steg"}
                  </PremiumButton>
                ) : (
                  <div className="text-center text-ts-gold font-semibold">🎉 Reisen er fullført!</div>
                )}
              </div>
            </FadeIn>
          ) : null}

          {/* Meldingar — UI 4.2: gold-glow chat bubbles */}
          {conversation.messages.length === 0 ? (
            <div className="text-center py-2xl">
              <BodyMd className="text-text-muted">Ingen meldinger ennå.</BodyMd>
              <BodySm className="text-text-subtle mt-sm">Start samtalen!</BodySm>
            </div>
          ) : (
            conversation.messages.map((msg: Message, i: number) => {
              const mine = isMyMessage(msg);
              return (
                <FadeIn key={i}>
                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    {mine ? (
                      /* Egne meldinger — UI 4.2: gold-soft bg + gold-border-right */
                      <div className="max-w-md px-lg py-md rounded-[var(--ts-radius-xl)] bg-ts-gold-soft/80 border border-ts-gold/20 shadow-soft">
                        <p className="text-sm leading-relaxed text-text-primary">{msg.content}</p>
                        <BodySm className="mt-xs text-ts-gold/60">
                          {new Date(msg.createdAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                        </BodySm>
                      </div>
                    ) : (
                      /* Mottatte meldinger — UI 4.2: ts-glass + gold-border-left */
                      <div className="max-w-md px-lg py-md rounded-[var(--ts-radius-xl)] bg-ts-glass border-ts-gold/10 shadow-soft">
                        <p className="text-sm leading-relaxed text-text-primary">{msg.content}</p>
                        <BodySm className="mt-xs text-text-subtle">
                          {new Date(msg.createdAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                        </BodySm>
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })
          )}

          {/* Typing indicator — UI 4.2: gold-glow-text */}
          {partnerTyping && (
            <FadeIn>
              <div className="flex justify-start mt-lg">
                <div className="ts-glass rounded-[var(--ts-radius-xl)] px-lg py-md shadow-soft">
                  <div className="flex gap-xs">
                    <span className="w-2 h-2 bg-text-subtle/40 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-text-subtle/40 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-text-subtle/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input-felt — UI 4.2: ts-glass-strong + gold glow on focus */}
      <div className="sticky bottom-0 ts-glass-strong backdrop-blur-strong border-t-ts-gold/10 p-xl relative z-10">
        <div className="max-w-2xl mx-auto space-y-lg">
          {errorSending && <BodySm className="text-ts-error">{errorSending}</BodySm>}
          <div className="flex gap-lg">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Skriv en melding..."
              className="flex-1 bg-transparent border border-ts-gold/10 rounded-[var(--ts-radius-md)] px-lg py-md text-ts-primary placeholder-text-subtle outline-none focus:border-ts-gold transition-all duration-[var(--ts-transition-normal)] shadow-[0_0_0_3px_rgba(212,175,55,0.2)]"
            />
            <PremiumButton
              variant="primary"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
            >
              {sending ? "Sender…" : "Send"}
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
}
