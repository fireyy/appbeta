import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default function middleware(req: NextRequest) {
  if (
    ['/', '/activity', '/account'].some((path) => path === req.nextUrl.pathname)
  ) {
    return withAuth(req)
  }
}
