import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body
  const cid = req.query.id
  const session = await getSession({ req })
  if (session) {
    if (req.method === 'GET') {
      handleGET(cid, res)
    } else if (req.method === 'PUT') {
      handlePUT({...data, userId: session.user.id}, res)
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      )
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}

// GET /api/channels/:id/packages
async function handleGET(id, res: NextApiResponse) {
  const post = await prisma.packages.findMany({
    where: { channelId: Number(id) }
  })
  res.json(post)
}

// PUT /api/channels/:id/packages
async function handlePUT(data, res: NextApiResponse) {
  const channel = await prisma.channels.findUnique({
    where: { id: Number(data.channelId) },
  })
  const result = await prisma.packages.create({
    data: { ...data, channelName: channel.name, appId: channel.appId },
  })
  await prisma.channels.update({
    where: { id: Number(data.channelId) },
    data: {
      packagesCount: {
        increment: 1
      },
    }
  })
  await prisma.apps.update({
    where: { id: Number(channel.appId) },
    data: {
      packagesCount: {
        increment: 1
      },
    }
  })
  res.json(result)
}
