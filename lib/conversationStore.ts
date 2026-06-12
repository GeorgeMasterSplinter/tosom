/* ------ In-memory conversation store ------ */

interface ConversationMessage {
  senderId: string;
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  userAId: string;
  userBId: string;
  messages: ConversationMessage[];
  createdAt: Date;
}

const conversations = new Map<string, Conversation>();

/* ------ Generer fake conversationId ------ */

function generateConversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/* ------ Opprett ny conversation ------ */

export function createConversation(userAId: string, userBId: string): { conversationId: string } {
  const id = generateConversationId();

  conversations.set(id, {
    id,
    userAId,
    userBId,
    messages: [],
    createdAt: new Date(),
  });

  return { conversationId: id };
}

/* ------ Hent conversation ------ */

export function getConversation(id: string): Conversation | undefined {
  return conversations.get(id);
}

/* ------ Hent alle conversations for ein brukar ------ */

export function getUserConversations(userId: string): Conversation[] {
  const result: Conversation[] = [];
  conversations.forEach((conv) => {
    if (conv.userAId === userId || conv.userBId === userId) {
      result.push(conv);
    }
  });
  return result;
}

/* ------ Legg til melding ------ */

export function addMessage(conversationId: string, senderId: string, content: string): boolean {
  const conv = conversations.get(conversationId);
  if (!conv) return false;

  conv.messages.push({
    senderId,
    content,
    createdAt: new Date(),
  });

  return true;
}
