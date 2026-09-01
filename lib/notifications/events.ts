import { NotificationType } from '@prisma/client'
import { dispatchEvent } from './dispatcher'

export async function eventMatchCreated(matchId: string, userId: string): Promise<void> {
  await dispatchEvent(
    NotificationType.MATCH,
    userId,
    'Du har et nytt match!',
    { matchId },
  )
}

export async function eventMessageReceived(conversationId: string, messageId: string, userId: string): Promise<void> {
  await dispatchEvent(
    NotificationType.MESSAGE,
    userId,
    'Du har fått ei ny melding',
    { conversationId, messageId },
  )
}

export async function eventJourneyMilestone(userId: string, day: number): Promise<void> {
  await dispatchEvent(
    NotificationType.JOURNEY,
    userId,
    `Du har nådd dag ${day} i reisa di!`,
    { day },
  )
}

export async function eventAdminAction(adminId: string, targetUserId: string, action: string): Promise<void> {
  await dispatchEvent(
    NotificationType.ADMIN,
    targetUserId,
    `Handling utført av admin: ${action}`,
    { adminId, action },
  )
}
