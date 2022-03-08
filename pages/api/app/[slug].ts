import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
    method,
  } = req

  switch (method) {
    case 'GET':
      const deviceType = req.headers['xdevice']
      await handleGET(String(slug), String(deviceType), res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/app/:slug
async function handleGET(slug: string, deviceType: string, res: NextApiResponse) {
  const app = await prisma.apps.findUnique({
    where: {
      'slug_device_type_unique': {
        slug,
        deviceType,
      }
    },
  })
  if (app) {
    res.json(app)
  } else {
    res.json({})
  }
}
