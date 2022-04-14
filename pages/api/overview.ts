import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await roleProtect(req, res)
  const apps = await prisma.apps.count()
  const packages = await prisma.packages.count()
  res.json({
    app: apps,
    package: packages,
  })
}
