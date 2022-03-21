import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default function middleware(req: NextRequest) {
  if (
    ['/api/app/', '/api/apk/', '/api/plist/'].some((path) => req.nextUrl.pathname.includes(path))
  ) {
    return NextResponse.next()
  } else {
    return withAuth(req, {
      callbacks: {
        authorized: ({ token }) => token?.role === "admin",
      },
    })
  }
}
