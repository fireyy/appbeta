import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    method,
  } = req

  const session = await getSession({ req })
  switch (method) {
    case 'GET':
      handleGET(res)
      break
    case 'PUT':
      handlePUT({
        ...data,
        userId: session.user.id,
      }, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/apps
async function handleGET(res: NextApiResponse) {
  const post = await prisma.apps.findMany()
  res.json(post)
}

// PUT /api/apps
async function handlePUT(data, res: NextApiResponse) {
  const result = await prisma.apps.create({
    data,
  })
  res.json(result)
}
