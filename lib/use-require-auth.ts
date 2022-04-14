import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { baseUrl } from 'lib/contants'

function useRequireAuth() {
  const { data: session } = useSession()

  const router = useRouter()
  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (router.pathname === '/[slug]') return
    if (!session && typeof session != 'undefined') {
      router.push(`/sign-in?callbackUrl=${baseUrl}${router.asPath}`)
    } else if (session && session.user.role !== 'ADMIN') {
      // TODO: 告知权限不足
      router.push(`/sign-in?callbackUrl=${baseUrl}${router.asPath}`)
    }
  }, [session, router])

  return session
}

export default useRequireAuth
