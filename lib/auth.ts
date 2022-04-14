import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import prisma from 'lib/prisma'
import { Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'database',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  theme: {
    colorScheme: "auto",
    logo: "/images/logo.svg",
    brandColor: "#000000",
  },
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}
