"use client";

import { useEffect, useState, useRef } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import Skeleton from "@/components/ui/Skeleton";

const { H1, H2, BodyMd, BodySm } = Typography;

/* ------ Data-types ------ */

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
}

interface PartnerProfile {
  name: string;
  age?: number | null;
  imageUrl?: string | null;
}

/* ------ Props ------ */

interface ConversationViewProps {
  conversationId: string;
}

/* ------ Visning ------ */

export default function ConversationView({ conversationId }: ConversationViewProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Hent conversation-data */
  useEffect(() => {
    let cancelled = false;

    async function fetchConversation() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/conversation/${conversationId}`);
        if (!res.ok) {
          if (res.status === 401) throw new Error("Du er ikkje innlogga");
          throw new Error("Kunne ikkje hente samtale");
        }
        const json: Conversation = await res.json();
        if (!cancelled) {
          setConversation(json);
          setCurrentUserId(json.userAId); // Dummy — burde komme frå API
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchConversation();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* Hent partner-profil */
  useEffect(() => {
    if (!conversation) return;

    const partnerId =
      currentUserId === conversation.userAId
        ? conversation.userBId
        : conversation.userAId;

    // Dummy-profil — burde komma frå /api/profile/{id}
    setPartnerProfile({
      name: "Ukjent",
      age: 28,
      imageUrl: null,
    });
  }, [conversation, currentUserId]);

  /* Scroll ned når nye meldingar kjem */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  /* Send melding */
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`/api/conversation/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (res.ok) {
        // Oppdater local state
        const newMessage: Message = {
          senderId: currentUserId || "",
          content: input.trim(),
          createdAt: new Date(),
        };

        setConversation((prev) =>
          prev
            ? { ...prev, messages: [...prev.messages, newMessage] }
            : prev
        );
        setInput("");
      }
    } catch {
      // Feil-håtering kan leggjast til seinare
    }
  };

  /* Loading — skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Section className="space-y-16 py-12">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton width="w-12 h-12" rounded="rounded-full" />
            <div className="space-y-2">
              <Skeleton width="w-32" height="h-6" rounded="rounded-md" />
              <Skeleton width="w-20" height="h-4" rounded="rounded-md" />
            </div>
          </div>

          {/* Meldingar skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <Skeleton
                  width="w-64"
                  height="h-12"
                  rounded="rounded-2xl"
                  className={i % 2 === 0 ? "bg-gold/10" : "bg-white/5"}
                />
              </div>
            ))}
          </div>

          {/* Input skeleton */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/80 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto flex gap-4">
              <Skeleton width="w-full" height="h-12" rounded="rounded-xl" />
              <Skeleton width="w-24" height="h-12" rounded="rounded-xl" />
            </div>
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
          <PremiumButton variant="secondary" onClick={() => window.location.reload()}>
            Prøv igjen
          </PremiumButton>
        </div>
      </div>
    );
  }

  /* Ingenting å vise */
  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <BodyMd className="text-gray-400">Ingen samtale å vise.</BodyMd>
        </div>
      </div>
    );
  }

  /* Henta partner-ID */
  const partnerId =
    currentUserId === conversation.userAId
      ? conversation.userBId
      : conversation.userAId;

  const isMyMessage = (msg: Message): boolean => msg.senderId === currentUserId;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-sm border-b border-white/10">
        <Section className="space-y-16 py-4">
          <FadeIn>
            <div className="flex items-center gap-4">
              {/* Profilbilde */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 ring-2 ring-gold/30">
                {partnerProfile?.imageUrl ? (
                  <img
                    src={partnerProfile.imageUrl}
                    alt={partnerProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-lg font-light">
                    {partnerProfile?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <H2 className="text-white text-xl font-light">{partnerProfile?.name}</H2>
                {partnerProfile?.age && (
                  <BodySm className="text-gold">{partnerProfile.age} år</BodySm>
                )}
              </div>

              {/* Match-status */}
              <div className="bg-gold/10 border border-gold/20 rounded-full px-3 py-1">
                <BodySm className="text-gold">Matcha</BodySm>
              </div>
            </div>
          </FadeIn>
        </Section>
      </div>

      {/* Meldingar */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-16">
              <BodyMd className="text-gray-500">Ingen meldingar enno.</BodyMd>
              <BodySm className="text-gray-600 mt-2">Start samtalen!</BodySm>
            </div>
          ) : (
            conversation.messages.map((msg: Message, i: number) => {
              const mine = isMyMessage(msg);
              return (
                <FadeIn key={i}>
                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        mine
                          ? "bg-gold/20 border border-gold/30 text-gold"
                          : "bg-white/5 border border-white/10 text-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <BodySm className={`mt-1 ${mine ? "text-gold/60" : "text-gray-600"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString("nb-NO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </BodySm>
                    </div>
                  </div>
                </FadeIn>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input-felt */}
      <div className="sticky bottom-0 bg-gray-950/80 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Skriv ei melding..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-gold/50 transition"
          />
          <PremiumButton
            variant="primary"
            onClick={handleSend}
            className="transition-all duration-300 ease-out hover:scale-[1.02]"
          >
            Send
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
