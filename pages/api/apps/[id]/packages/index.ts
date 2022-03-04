import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body
  const id = req.query.id
  const session = await getSession({ req })
  if (session) {
    if (req.method === 'GET') {
      handleGET(id, res)
    } else if (req.method === 'PUT') {
      handlePUT({...data, appId: id, userId: session.user.id}, res)
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      )
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/apps/:id/packages
async function handleGET(id, res: NextApiResponse) {
  const post = await prisma.packages.findMany({
    where: { appId: Number(id) }
  })
  res.json(post)
}

// PUT /api/apps/:id/packages
async function handlePUT(data, res: NextApiResponse) {
  const result = await prisma.packages.create({
    data,
  })
  await prisma.apps.update({
    where: { id: Number(data.appId) },
    data: {
      packagesCount: {
        increment: 1
      },
    }
  })
  res.json(result)
}
