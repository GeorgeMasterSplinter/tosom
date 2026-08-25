/**
 * PATCH /api/admin/users/[id]
 * 
 * Modereringshandlingar på ein bruker (admin).
 * Pakke 4.4.3 — User Flags & Moderation Tools
 * Pakke 5.1 — Zod-validering
 * 
 * Body actions: "flag", "unflag", "reset-onboarding", "reset-journey", "force-match-end"
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse } from '@/lib/api-validator'
import { recordAdminAction } from '@/lib/admin/audit'
import { hardDeleteUser } from '@/lib/admin/deleteUser'

export const dynamic = 'force-dynamic'

type AdminAction = 'flag' | 'unflag' | 'reset-onboarding' | 'reset-journey' | 'force-match-end'

/**
 * DELETE /api/admin/users/[id]
 *
 * Permanent sletting av én bruker + alt relasjonert innhold (testdata-rensing).
 * Destruktiv og uforandrerbar — krever ADMIN og forbyr sletting av seg selv.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)

    if (adminUser.role !== 'ADMIN') return errorResponse('Berre admin kan slette brukere', 403)

    const targetUserId = (await params).id
    if (targetUserId === adminUser.id) return errorResponse('Du kan ikke slette din eigen konto', 400)

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, role: true },
    })
    if (!targetUser) return errorResponse('Fant ingen bruker', 404)

    // Slett permanent (alt relasjonert innhold + bruker)
    const del = await hardDeleteUser(targetUserId)
    if (del.skipped === 'not_found') return errorResponse('Fant ingen bruker', 404)

    // Logg destruktiv admin-handling
    await recordAdminAction(adminUser.id, 'USER_DEACTIVATE', { targetUserId, email: targetUser.email, hardDelete: true })
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: `Brukar ${targetUser.email} blei slettet permanent av admin ${adminUser.id}`,
        module: 'admin/user-delete',
        metadata: { targetUserId, adminId: adminUser.id, deleted: del.deleted, imageObjects: del.imageObjects ?? 0 },
      },
    }).catch(() => { /* SystemLog-feil skal ikke blokkere */ })

    return successResponse({
      data: { userId: targetUserId, email: targetUser.email, deleted: del.deleted },
      message: `Brukar ${targetUser.email} er no slettet permanent.`,
    })
  } catch (error) {
    console.error('[DELETE /api/admin/users/[id]] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}

async function logSystemLog(message: string, module: string, adminId: string, metadata: Record<string, unknown>) {
  try {
    await prisma.systemLog.create({
      data: { level: 'INFO', message, module, metadata: JSON.stringify({ ...metadata, adminId }) },
    })
  } catch { /* SystemLog feil skal ikke krasje operasjonen */ }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)

    if (adminUser.role !== 'ADMIN') return errorResponse("Berre admin kan utføre modereringshandlingar", 403)

    const targetUserId = (await params).id
    let body: { action?: string; reason?: string }
    try { body = await req.json() } catch { return errorResponse('Ugyldig JSON', 400) }
    const { action, reason } = body

    // Valider action
    const validActions: AdminAction[] = ['flag', 'unflag', 'reset-onboarding', 'reset-journey', 'force-match-end']
    if (!validActions.includes(action as AdminAction)) {
      return errorResponse(`Ugyldig action. Gyldige: ${validActions.join(', ')}`, 400)
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, role: true, bannedAt: true, onboardingComplete: true, createdAt: true },
    })
    if (!targetUser) return errorResponse('Brukar ikke funnet', 404)
    if (targetUserId === adminUser.id) return errorResponse('Du kan ikke handle på eigne konto', 400)

    let updatedUser: any

    switch (action) {
      case 'flag':
        if (targetUser.bannedAt) return errorResponse('Brukar er allerede flagga/banna', 400)
        updatedUser = await prisma.user.update({ where: { id: targetUserId }, data: { bannedAt: new Date() }, select: { id: true, email: true, name: true, bannedAt: true } })
        await logSystemLog(`Brukar ${targetUser.email} blei flagga/banna av admin ${adminUser.id}`, 'admin/user-flag', adminUser.id, { targetUserId, reason })
        // STEG 9.2 FIX: Logg destruktiv admin-handling
        await recordAdminAction(adminUser.id, 'USER_BAN', { targetUserId, reason })
        return successResponse({ data: updatedUser, message: `Brukar ${targetUser.email} er no flagga/banna.` })

      case 'unflag':
        if (!targetUser.bannedAt) return errorResponse('Brukar er ikke flagga', 400)
        updatedUser = await prisma.user.update({ where: { id: targetUserId }, data: { bannedAt: null }, select: { id: true, email: true, name: true, bannedAt: true } })
        await logSystemLog(`Brukar ${targetUser.email} fekk flagga fjerna av admin ${adminUser.id}`, 'admin/user-unflag', adminUser.id, { targetUserId })
        // STEG 9.2 FIX: Logg destruktiv admin-handling
        await recordAdminAction(adminUser.id, 'USER_UNBAN', { targetUserId })
        return successResponse({ data: updatedUser, message: `Brukar ${targetUser.email} har no flagga fjerna.` })

      case 'reset-onboarding':
        const wasComplete = targetUser.onboardingComplete
        updatedUser = await prisma.user.update({ where: { id: targetUserId }, data: { onboardingStep: 1, onboardingComplete: false, deepProfileComplete: false }, select: { id: true, email: true, name: true, onboardingStep: true, onboardingComplete: true } })
        await logSystemLog(`Brukar ${targetUser.email} onboarding blei resatt av admin ${adminUser.id}`, 'admin/user-reset-onboarding', adminUser.id, { targetUserId, wasComplete })
        return successResponse({ data: updatedUser, message: `Brukar ${targetUser.email} onboarding blei resatt til steg 1.` })

      case 'reset-journey':
        // B4 — JourneyProgress er match-scoped (krever matchId), bare slett eksisterande
        await prisma.journeyProgress.deleteMany({ where: { userId: targetUserId } })
        // STEG 9.2 FIX: Logg destruktiv admin-handling
        await recordAdminAction(adminUser.id, 'JOURNEY_RESET', { targetUserId })
        return successResponse({ data: { userId: targetUserId, email: targetUser.email }, message: `Brukar ${targetUser.email} journey blei resatt til dag 1.` })

      case 'force-match-end':
        await prisma.$transaction(async (tx) => {
          const activeMatches = await tx.match.findMany({ where: { OR: [{ userAId: targetUserId }, { userBId: targetUserId }], status: 'active' }, select: { id: true } })
          for (const match of activeMatches) await tx.match.update({ where: { id: match.id }, data: { status: 'ended' } })
          const conversations = await tx.conversation.findMany({ where: { OR: [{ userAId: targetUserId }, { userBId: targetUserId }], endedAt: null }, select: { id: true } })
          for (const conv of conversations) await tx.conversation.update({ where: { id: conv.id }, data: { endedAt: new Date() } })
        })
        await logSystemLog(`Brukar ${targetUser.email} force match end blei utført av admin ${adminUser.id}`, 'admin/user-force-match-end', adminUser.id, { targetUserId })
        // STEG 9.2 FIX: Logg destruktiv admin-handling
        await recordAdminAction(adminUser.id, 'CONTENT_DELETE', { targetUserId, action: 'force-match-end' })
        return successResponse({ data: { userId: targetUserId, email: targetUser.email }, message: `Aktive matcher og conversations for ${targetUser.email} blei avsluttet.` })

      default:
        return errorResponse(`Ugyldig action`, 400)
    }
  } catch (error) {
    console.error('[PATCH /api/admin/users/[id]] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}