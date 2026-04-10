import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, data } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Oppdater brukerprofilen
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        profile: {
          upsert: {
            create: data,
            update: data,
          },
        },
      },
      include: { profile: true },
    })

    return res.status(200).json({ success: true, user: updated })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
