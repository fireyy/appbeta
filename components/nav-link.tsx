import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTheme, Breadcrumbs } from '@geist-ui/core'
import Home from '@geist-ui/icons/home'

type Props = {
  href?: string
  parent?: string
}

const NavLink: React.FC<Props> = ({
  href = '',
  parent = '',
  children,
}) => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <div className="nav-breadcrumbs">
      <Breadcrumbs>
        <NextLink href="/" passHref>
          <Breadcrumbs.Item nextLink><Home /><span>Overview</span></Breadcrumbs.Item>
        </NextLink>
        {
          parent && (
            <NextLink href={href} passHref>
              <Breadcrumbs.Item nextLink className="ellipsis">{parent}</Breadcrumbs.Item>
            </NextLink>
          )
        }
        <Breadcrumbs.Item className="ellipsis">{children}</Breadcrumbs.Item>
      </Breadcrumbs>
      <style jsx>{`
        .nav-breadcrumbs {
          padding-bottom: ${theme.layout.gapHalf};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .nav-breadcrumbs :global(.breadcrumbs-item:first-child span) {
            font-size: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default NavLink
