import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/requireAuth'
import type { AuthenticatedUser } from '@/lib/auth/rbac'

export async function freezeConversation(conversationId: string, adminId: string): Promise<void> {
  await requireAdmin({ id: adminId, role: 'ADMIN' as const } as AuthenticatedUser)
  
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      frozenAt: new Date(),
      frozenBy: adminId,
    },
  })
}

export async function unfreezeConversation(conversationId: string, adminId: string): Promise<void> {
  await requireAdmin({ id: adminId, role: 'ADMIN' as const } as AuthenticatedUser)
  
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      frozenAt: null,
      frozenBy: null,
    },
  })
}

export async function isFrozen(conversationId: string): Promise<boolean> {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { frozenAt: true },
  })
  
  return !!conv?.frozenAt
}