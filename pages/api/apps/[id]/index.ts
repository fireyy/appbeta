import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  switch (method) {
    case 'GET':
      await handleGET(Number(id), res)
      break
    case 'PUT':
      await handlePUT(Number(id), data, res)
      break
    case 'DELETE':
      await handleDELETE(Number(id), res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// PUT /api/apps/:id
async function handlePUT(id: number, data, res: NextApiResponse) {
  const post = await prisma.apps.update({
    where: { id },
    data,
  })
  res.json(post)
}

// GET /api/apps/:id
async function handleGET(id: number, res: NextApiResponse) {
  const post = await prisma.apps.findUnique({
    where: { id },
  })
  if (post) {
    res.json(post)
  } else {
    res.json({})
  }
}

// DELETE /api/apps/:id
async function handleDELETE(id: number, res: NextApiResponse) {
  const post = await prisma.apps.delete({
    where: { id },
  })
  res.json(post)
}
