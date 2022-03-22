import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function useRequireAuth() {
  const { data: session } = useSession()

  const router = useRouter()
  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (router.pathname === '/[slug]') return
    if (!session && typeof session != 'undefined') {
      router.push(`/api/auth/signin`)
    } else if (session && session.user.role !== 'admin') {
      // TODO: 告知权限不足
      router.push(`/api/auth/signin`)
    }
  }, [session, router])

  return session
}

export default useRequireAuth
