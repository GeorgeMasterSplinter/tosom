/**
 * ToSom — Chat Components (Barrel Export)
 * Importér alle chat-komponentar frå éin stad.
 */

export { MessageBubble } from '@/app/chat/components/MessageBubble';
export type { MessageData } from '@/app/chat/components/MessageBubble';

export { TaskBubble } from './TaskBubble';
export type { TaskChoice } from './TaskBubble';

export { ReflectionBubble } from './ReflectionBubble';

export { MilestoneBubble, MilestoneBubbleStyles } from './MilestoneBubble';

export { useConversationMood, getMoodFromConversation, determineMood } from './useConversationMood';
export type { ConversationMood, MoodConfig } from './useConversationMood';

export { useChatScroll } from './useChatScroll';
export type { ChatScrollResult } from './useChatScroll';

export { ChatScrollManager } from './useChatScroll';