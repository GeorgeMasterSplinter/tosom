import prisma from '../../../lib/prisma'
import deepMatch from '../../../lib/deepMatch'
import resonance from '../../../lib/resonance'
import baseScore from '../../../lib/baseScore'

export default async function handler(req, res) {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Hent brukerens profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user || !user.profile) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    // Hent alle andre profiler
    const others = await prisma.user.findMany({
      where: {
        id: { not: userId },
        profile: { not: null },
      },
      include: { profile: true },
    })

    // Beregn matcher
    const matches = others.map((other) => {
      const score =
        baseScore(user.profile, other.profile) +
        deepMatch(user.profile, other.profile) +
        resonance(user.profile, other.profile)

      return {
        id: other.id,
        name: other.name || 'Ukjent',
        age: other.profile.age,
        score: Math.round(score),
      }
    })

    // Sorter etter score
    matches.sort((a, b) => b.score - a.score)

    return res.status(200).json({ matches })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
