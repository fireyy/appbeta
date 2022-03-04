import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id, pid } = req.query

  if (req.method === 'GET') {
    handleGET(pid, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(id, pid, res)
  } else if (req.method === 'PUT') {
    // TODO: mod data
    const { name, description, slug } = req.body
    handlePUT(pid, {
      name, description, slug
    }, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
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
