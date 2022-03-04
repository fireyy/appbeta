import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, pid },
    method,
  } = req

  switch (method) {
    case 'GET':
      await handleGET(pid, res)
      break
    case 'PUT':
      // TODO: mod data
      const { name, description, slug } = req.body
      await handlePUT(pid, {
        name, description, slug
      }, res)
      break
    case 'DELETE':
      await handleDELETE(id, pid, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// PUT /api/apps/:id/packages/:pid
async function handlePUT(pid, data, res: NextApiResponse) {
  const post = await prisma.packages.update({
    where: { id: Number(pid) },
    data: data,
  })
  res.json(post)
}

// GET /api/apps/:id/packages/:pid
async function handleGET(pid, res: NextApiResponse) {
  const post = await prisma.packages.findUnique({
    where: { id: Number(pid) },
  })
  if (post) {
    res.json(post)
  } else {
    res.json({})
  }
}

// DELETE /api/apps/:id/packages/:pid
async function handleDELETE(id, pid, res: NextApiResponse) {
  const post = await prisma.packages.delete({
    where: { id: Number(pid) },
  })
  await prisma.apps.update({
    where: { id: Number(id) },
    data: {
      packagesCount: {
        decrement: 1
      },
    }
  })
  res.json(post)
}
