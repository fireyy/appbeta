import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, slug } = req.body
  const session = await getSession({ req })
  if (session) {
    if (req.method === 'GET') {
      handleGET(res)
    } else if (req.method === 'PUT') {
      handlePUT({
        name,
        description,
        slug,
        userId: session.user.id,
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

// GET /api/apps
async function handleGET(res: NextApiResponse) {
  const post = await prisma.apps.findMany()
  res.json(post)
}

// PUT /api/apps
// Required fields in body: name, slug
// Optional fields in body: description
async function handlePUT(data, res: NextApiResponse) {
  const { name, description, slug, userId } = data
  const result = await prisma.apps.create({
    data: {
      name,
      slug,
      description,
      userId,
    },
  })
  res.json(result)
}
