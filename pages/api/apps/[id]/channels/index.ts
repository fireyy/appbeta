import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, deviceType, slug } = req.body
  const appId = Number(req.query.id)
  const session = await getSession({ req })
  const userId = session.user.id
  if (session) {
    if (req.method === 'GET') {
      handleGET(appId, res)
    } else if (req.method === 'PUT') {
      handlePUT({
        name,
        deviceType,
        slug,
        appId,
        userId,
      }, res)
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      )
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/apps/:id/channels
async function handleGET(id: number, res: NextApiResponse) {
  const post = await prisma.channels.findMany({
    where: { appId: id }
  })
  res.json(post)
}

// PUT /api/apps/:id/channels
// Required fields in body: name, slug, deviceType, appId
async function handlePUT(data, res: NextApiResponse) {
  const result = await prisma.channels.create({
    data,
  })
  await prisma.apps.update({
    where: { id: Number(data.appId) },
    data: {
      channelCount: {
        increment: 1
      },
    }
  })
  res.json(result)
}
