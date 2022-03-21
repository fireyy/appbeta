import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { staticPath } from 'lib/contants'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { pid },
    method,
  } = req

  switch (method) {
    case 'GET':
      await handleGET(Number(pid), res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/app/apk/:pid
async function handleGET(pid: number, res: NextApiResponse) {
  const app = await prisma.packages.findUnique({
    where: {
      id: pid
    },
  })
  if (app) {
    const apkUrl = staticPath + app.file
    // TODO：吐出真实下载地址，无需跳转
    res.redirect(apkUrl)
  } else {
    res.json({})
  }
}
