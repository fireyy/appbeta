import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { s = '' } = req.query
  const apps = await prisma.apps.findMany({
    where: {
      name: {
        contains: String(s),
      }
    }
  })
  res.json(apps)
}
