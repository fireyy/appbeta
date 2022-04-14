import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query
  const session = await roleProtect(req, res)
  const packages = await prisma.packages.findMany({
    take: +limit,
    skip: (+page - 1) * +limit,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      app: {
        select: {
          name: true,
          deviceType: true,
        }
      },
    },
  })
  const result = packages.slice((+page - 1) * +limit, +page*+limit).map(item => (
    {
      ...item,
      url: `/apps/${item.appId}`,
      group: item.createdAt.toISOString().split('T')[0],
    }
  ))
  res.json(result)
}
