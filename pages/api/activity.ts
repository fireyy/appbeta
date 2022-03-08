import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: 分页
  const packages = await prisma.packages.findMany()
  const result = packages.map(item => (
    {
      ...item,
      url: `/apps/${item.appId}`,
      group: item.createdAt.toISOString().split('T')[0],
    }
  ))
  res.json(result)
}
