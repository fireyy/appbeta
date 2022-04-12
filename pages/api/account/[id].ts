import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: data,
    query: { id },
    method,
  } = req

  const session = await getSession({ req })

  switch (method) {
    case 'GET':
      await handleGET(Number(id), res)
      break
    case 'PUT':
      await handlePUT(Number(id), data, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// PUT /api/account/:id
// TODO: 权限控制
async function handlePUT(id:number, data, res: NextApiResponse) {
  const result = await prisma.user.update({
    where: {
      id
    },
    data,
  })
  res.json(result)
}

// GET /api/account/:id
async function handleGET(id: number, res: NextApiResponse) {
  const accounts = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      accounts: true,
    },
  })
  res.json(accounts)
}
