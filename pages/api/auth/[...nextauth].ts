import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import prisma from '../../../lib/prisma'

const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token?.uid
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user?.id
      }
      return token
    },
  },
  theme: {
    colorScheme: "auto",
    logo: "/images/logo.png",
    brandColor: "#1786fb",
  },
}

export default NextAuth(options)
