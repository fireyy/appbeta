import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const s = String(req.query.s)
  const apps = await prisma.apps.findMany({
    where: {
      name: {
        contains: s,
      }
    }
  })
  const result = apps.map(item => (
    {
      name: item.name,
      icon: item.icon,
      url: `/apps/${item.id}`,
      group: item.deviceType
    }
  ))
    .slice(0, 10)
    .sort(seed => {
      const startsWithName = seed.name.toLowerCase().startsWith(s)
      const startsWithGroup = seed.group?.toLowerCase().startsWith(s)
      if (startsWithName) return -1
      if (startsWithGroup) return 0
      return 1
    })
  res.json(result)
}
