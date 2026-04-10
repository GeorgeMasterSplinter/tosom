import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, data } = req.body

  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        upsert: {
          create: data,
          update: data,
        },
      },
    },
    include: { profile: true },
  })

  return res.status(200).json({ user: updated })
}
