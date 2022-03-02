import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const appId = req.query.id

  if (req.method === 'GET') {
    handleGET(appId, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(appId, res)
  } else if (req.method === 'PUT') {
    handlePUT(appId, {}, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// PUT /api/apps/:id
async function handlePUT(appId, data, res: NextApiResponse) {
  const post = await prisma.apps.update({
    where: { id: Number(appId) },
    data: data,
  })
  res.json(post)
}

// GET /api/apps/:id
async function handleGET(appId, res: NextApiResponse) {
  const post = await prisma.apps.findUnique({
    where: { id: Number(appId) },
  })
  res.json(post)
}

// DELETE /api/apps/:id
async function handleDELETE(appId, res: NextApiResponse) {
  const post = await prisma.apps.delete({
    where: { id: Number(appId) },
  })
  res.json(post)
}
