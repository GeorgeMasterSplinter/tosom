import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const { userId } = req.query

  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user) return res.status(404).json({ error: 'User not found' })

  return res.status(200).json({ user })
}
