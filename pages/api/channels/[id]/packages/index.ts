import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body
  const session = await getSession({ req })
  if (session) {
    if (req.method === 'GET') {
      handleGET(res)
    } else if (req.method === 'PUT') {
      handlePUT(data, res)
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
async function handleGET(res: NextApiResponse) {
  const post = await prisma.packages.findMany()
  res.json(post)
}

// PUT /api/channels/:id/packages
async function handlePUT(data, res: NextApiResponse) {
  const result = await prisma.packages.create({
    data,
  })
  res.json(result)
}
