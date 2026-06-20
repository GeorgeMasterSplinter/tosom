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
      <div className="min-h-screen bg-gray-950 text-white">
        <Section className="space-y-16 py-12">
          <div className="flex items-center gap-4">
            <Skeleton width="w-12" height="h-12" rounded="rounded-full" />
            <div className="space-y-2">
              <Skeleton width="w-32" height="h-6" rounded="rounded-md" />
              <Skeleton width="w-20" height="h-4" rounded="rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <Skeleton width="w-64" height="h-12" rounded="rounded-2xl" className={i % 2 === 0 ? "bg-gold/10" : "bg-white/5"} />
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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <BodyMd className="text-red-400">{error}</BodyMd>
          <PremiumButton variant="secondary" onClick={() => { setIsPolling(false); window.location.reload(); }}>Prøv igjen</PremiumButton>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <BodyMd className="text-gray-400">Ingen samtale å vise.</BodyMd>
        </div>
      </div>
    );
  }

  const isMyMessage = (msg: Message): boolean => msg.senderId === currentUserId;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-sm border-b border-white/10">
        <Section className="space-y-16 py-4">
          <FadeIn>
            <div className="flex items-center gap-4 animate-headerFade">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 ring-2 ring-gold/30">
                {partnerProfile?.imageUrl ? (
                  <img src={partnerProfile.imageUrl} alt={partnerProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-lg font-light">
                    {partnerProfile?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <H2 className="text-white text-xl font-light">{partnerProfile?.name}</H2>
                {partnerProfile?.age && <BodySm className="text-gold">{partnerProfile.age} år</BodySm>}
              </div>
              <div className="bg-gold/10 border border-gold/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></span>
                <BodySm className="text-gold">Matcha</BodySm>
              </div>
            </div>
          </FadeIn>
        </Section>
      </div>

      {/* Meldingar + Journey */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-8" style={{ scrollBehavior: "smooth" }}>
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Journey Card */}
          {journeyLoading ? (
            <FadeIn>
              <div className="mx-auto max-w-md bg-white/5 border border-gold/20 rounded-2xl p-6 space-y-3">
                <Skeleton width="w-3/4" height="h-6" rounded="rounded-md" />
                <Skeleton width="w-full" height="h-4" rounded="rounded-md" />
                <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
                <Skeleton width="w-1/2" height="h-10" rounded="rounded-xl" />
              </div>
            </FadeIn>
          ) : journeyError ? (
            <FadeIn>
              <div className="mx-auto max-w-md bg-white/5 border border-red-400/30 rounded-2xl p-6 text-center space-y-3">
                <BodyMd className="text-red-400">{journeyError}</BodyMd>
                <PremiumButton variant="secondary" onClick={() => setJourneyError(null)}>Prøv igjen</PremiumButton>
              </div>
            </FadeIn>
          ) : journey ? (
            <FadeIn>
              <div className="mx-auto max-w-md bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-6 space-y-3 animate-[fadeInUp_0.25s_ease-out]">
                <div className="flex items-center justify-between">
                  <BodySm className="text-gold">Steg {journey.currentStep + 1} av {journey.steps.length}</BodySm>
                  <div className="flex gap-1">
                    {journey.steps.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= journey.currentStep ? "bg-gold" : "bg-white/20"}`}></div>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gold">{journey.current.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{journey.current.description}</p>
                {journey.currentStep < journey.steps.length - 1 ? (
                  <PremiumButton variant="primary" onClick={handleCompleteStep} disabled={journeyAdvancing}>
                    {journeyAdvancing ? "Fullfører…" : "Fullfør steg"}
                  </PremiumButton>
                ) : (
                  <div className="text-center text-gold font-semibold">🎉 Reisen er fullført!</div>
                )}
              </div>
            </FadeIn>
          ) : null}

          {/* Meldingar */}
          {conversation.messages.length === 0 ? (
            <div className="text-center py-16">
              <BodyMd className="text-gray-500">Ingen meldinger ennå.</BodyMd>
              <BodySm className="text-gray-600 mt-2">Start samtalen!</BodySm>
            </div>
          ) : (
            conversation.messages.map((msg: Message, i: number) => {
              const mine = isMyMessage(msg);
              return (
                <FadeIn key={i}>
                  <div className={`flex ${mine ? "justify-end" : "justify-start"} animate-fadeInUp`}>
                    <div className={`max-w-md px-4 py-3 rounded-2xl ${mine ? "bg-gold/20 border border-gold/30 text-gold" : "bg-white/5 border border-white/10 text-gray-200"}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <BodySm className={`mt-1 ${mine ? "text-gold/60" : "text-gray-600"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                      </BodySm>
                    </div>
                  </div>
                </FadeIn>
              );
            })
          )}

          {/* Typing indicator */}
          {partnerTyping && (
            <FadeIn>
              <div className="flex justify-start mt-2 animate-[scaleIn_0.2s_ease-out]">
                <div className="max-w-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-2 animate-pulse text-white/70">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/40 rounded-full"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full"></span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input-felt */}
      <div className="sticky bottom-0 bg-gray-950/80 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {errorSending && <BodySm className="text-red-400">{errorSending}</BodySm>}
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Skriv en melding..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-gold/50 transition-all duration-200"
            />
            <PremiumButton
              variant="primary"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              {sending ? "Sender…" : "Send"}
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
}