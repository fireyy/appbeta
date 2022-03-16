import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, deviceType },
    method,
  } = req

  switch (method) {
    case 'GET':
      await handleGET(String(slug), String(deviceType), res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/app/:slug
async function handleGET(slug: string, deviceType: string, res: NextApiResponse) {
  const result = await prisma.apps.findMany({
    where: {
      slug,
    },
  })
  if (result && result.length > 0) {
    const app = result.find(r => r.deviceType === deviceType) || result[0]
    const packages = await prisma.packages.findMany({
      where: { appId: Number(app.id) }
    })
    res.json({
      app,
      packages
    })
  } else {
    res.json({})
  }
}
