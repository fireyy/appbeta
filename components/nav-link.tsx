import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Link, useTheme, Breadcrumbs } from '@geist-ui/core'
import ChevronLeft from '@geist-ui/icons/chevronLeft'

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
          <Breadcrumbs.Item nextLink>Home</Breadcrumbs.Item>
        </NextLink>
        {
          parent && (
            <NextLink href={href} passHref>
              <Breadcrumbs.Item nextLink>{parent}</Breadcrumbs.Item>
            </NextLink>
          )
        }
        <Breadcrumbs.Item>{children}</Breadcrumbs.Item>
      </Breadcrumbs>
      <style jsx>{`
        .nav-breadcrumbs {
          padding-bottom: ${theme.layout.gapHalf};
        }
      `}</style>
    </div>
  )
}

export default NavLink
