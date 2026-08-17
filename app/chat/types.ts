/**
 * Tosom Chat Types (Premium Nordic Gold 2026) 🟡
 */

export type SenderType = "me" | "partner" | "system";
export type MessageType = "text" | "image" | "task" | "choice" | "system";

export interface ChatMessage {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  metadata?: {
    imageUrl?: string;
    taskTitle?: string;
    choices?: Array<{ label: string; value: string }>;
    day?: number;
    phase?: string;
    timestamp?: Date;
    senderInfo?: {
      name: string;
      imageUrl?: string;
    };
  };
}

export interface PartnerInfo {
  name: string;
  age: number;
  imageUrl?: string;
  resonanceScore?: number;
  matchedAt?: string;
}

export interface ConversationState {
  conversationId: string | null;
  partner: PartnerInfo | null;
  messages: ChatMessage[];
  journeyDay: number;
  imageShareAllowed: boolean;
  loading: boolean;
  error: string | null;
}