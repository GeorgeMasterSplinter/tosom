'use client';

import { use } from 'react';
import { ChatProvider } from '@/app/chat/context/ChatContext';
import { ChatContainer, DEV_CONVERSATION_ID } from '@/app/chat/components/ChatContainer';

interface ChatPageParams {
  id: string;
}

export default function ChatPage({ params }: { params: Promise<ChatPageParams> }) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;

  // Mock data
  const mockPartner = { name: 'Emma', age: 28 };
  const isDev = conversationId === DEV_CONVERSATION_ID;

  // I dev-mode: Bruk null conversationId for ChatProvider slik at han ikkje kallar API
  const providerConversationId = isDev ? null : conversationId;

  return (
    <ChatProvider
      conversationId={providerConversationId}
      partner={mockPartner}
      journeyDay={5}
      imageShareAllowed={false}
    >
      <ChatContainer
        conversationId={conversationId}
        partner={mockPartner}
        journeyDay={5}
        imageShareAllowed={false}
      />
    </ChatProvider>
  );
}
