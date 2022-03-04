import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id

  if (req.method === 'GET') {
    handleGET(id, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(id, res)
  } else if (req.method === 'PUT') {
    const { name, description, slug } = req.body
    handlePUT(id, {
      name, description, slug
    }, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// PUT /api/channels/:id
async function handlePUT(id, data, res: NextApiResponse) {
  const post = await prisma.channels.update({
    where: { id: Number(id) },
    data: data,
  })
  res.json(post)
}

// GET /api/channels/:id
async function handleGET(id, res: NextApiResponse) {
  const post = await prisma.channels.findUnique({
    where: { id: Number(id) },
  })
  if (post) {
    res.json(post)
  } else {
    res.json({})
  }
}

// DELETE /api/channels/:id
async function handleDELETE(id, res: NextApiResponse) {
  const post = await prisma.channels.delete({
    where: { id: Number(id) },
  })
  res.json(post)
}
