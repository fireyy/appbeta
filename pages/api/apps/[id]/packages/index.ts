import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: data,
    method,
  } = req

  const session = await getSession({ req })
  // res.status(401).send({ message: 'Unauthorized' })
  switch (method) {
    case 'GET':
      await handleGET(id, res)
      break
    case 'PUT':
      await handlePUT({...data, appId: Number(id), userId: session.user.id}, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
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
