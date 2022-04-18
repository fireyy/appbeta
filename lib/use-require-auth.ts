import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function useRequireAuth() {
  const { data: session } = useSession()

  const router = useRouter()
  // If session.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!session && typeof session != 'undefined') {
      router.push(`/sign-in`)
    } else if (session && session.user.role !== 'ADMIN') {
      // TODO: 告知权限不足
      router.push(`/sign-in`)
    }
  }, [session, router])

  return session
}

export default useRequireAuth
