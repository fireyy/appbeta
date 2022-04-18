import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'lib/auth'

export default async function roleProtect(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res }, authOptions)
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' })
  }
  return session
}
