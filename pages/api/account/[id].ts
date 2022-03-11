import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  const session = await getSession({ req })

  switch (method) {
    case 'GET':
      await handleGET(Number(id), res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/accounts/:id
async function handleGET(id: number, res: NextApiResponse) {
  const accounts = await prisma.account.findMany({
    where: {
      userId: id
    }
  })
  res.json(accounts)
}
