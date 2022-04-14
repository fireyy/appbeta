import type { NextApiRequest, NextApiResponse } from 'next'
import storage from 'lib/upload'
import roleProtect from 'lib/role-protect'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await roleProtect(req, res)
  if (req.method === 'PUT') {
    const result = await storage.upload(req)
    res.json(result)
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
