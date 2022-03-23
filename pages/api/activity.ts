import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, limit } = req.query
  const packages = await prisma.packages.findMany({
    take: +limit,
    skip: (+page - 1) * +limit,
    orderBy: {
      createdAt: 'desc'
    }
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
