import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import roleProtect from 'lib/role-protect'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req

  const session = await roleProtect(req, res)

  switch (method) {
    case 'GET':
      await handleGET(res)
      break
    case 'PUT':
      await handlePUT(data, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/settings
async function handleGET(res: NextApiResponse) {
  const post = await prisma.settings.findMany()
  res.json(post)
}

// PUT /api/settings
async function handlePUT(data, res: NextApiResponse) {
  const result = await prisma.settings.create({
    data,
  })
  res.json(result)
}
