import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apps = await prisma.apps.count()
  const packages = await prisma.packages.count()
  res.json({
    app: apps,
    package: packages,
  })
}
