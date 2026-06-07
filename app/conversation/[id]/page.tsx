import ConversationView from "@/components/conversation/ConversationView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  return <ConversationView conversationId={id} />;
}
