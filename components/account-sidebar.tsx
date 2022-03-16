import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Grid, Link, useTheme } from '@geist-ui/core'

const links = [
  {
    name: 'General',
    href: '/account',
  },
  {
    name: 'Login Connections',
    href: '/account/login-connections',
  },
  {
    name: 'System',
    href: '/account/system-management',
  }
]

const AccountSidebar: React.FC<unknown> = () => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <>
      <Grid xs={24} md={6} direction="column">
        <div className="page__sidebar">
        {
          links.map(({ name, href }) => {
            return (
              <NextLink href={href} key={name} passHref>
                <Link className={router.pathname === href ? 'active' : ''}>{name}</Link>
              </NextLink>
            )
          })
        }
        </div>
      </Grid>
      <style jsx>{`
        .page__sidebar {
          width: 100%;
          position: sticky;
          top: 80px;
        }
        .page__sidebar :global(a.link) {
          color: ${theme.palette.accents_5};
          text-decoration: none;
          display: block;
          padding: ${theme.layout.gapHalf} 0;
          font-size: 14px;
          transition: color .2s ease;
        }
        .page__sidebar :global(.link.active) {
          color: ${theme.palette.foreground};
          font-weight: 700;
        }
        .page__sidebar :global(.link:hover) {
          color: ${theme.palette.foreground};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .page__sidebar {
          }
          .page__sidebar :global(a.link) {
            display: inline-block;
            padding: ${theme.layout.gapHalf};
          }
          .page__sidebar :global(a.link.active) {
            border-bottom: 2px solid ${theme.palette.foreground};
          }
        }
      `}</style>
    </>
  )
}

export default AccountSidebar
