import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Link, useTheme, Spacer } from '@geist-ui/core'
import ChevronLeft from '@geist-ui/icons/chevronLeft'

type Props = {
  href?: string
}

const NavLink: React.FC<Props> = ({
  href = '',
  children,
}) => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <div className="nav-link-back">
      <NextLink href={href}>
        <Link><ChevronLeft size={16} /><Spacer w={0.2} />{children}</Link>
      </NextLink>
      <style jsx>{`
        .nav-link-back {
          color: ${theme.palette.accents_4};
        }
        .nav-link-back :global(.link) {
          display: flex;
          align-items: center;
        }
        .nav-link-back :global(.link:hover) {
          color: ${theme.palette.accents_6};
        }
        .nav-link-back :global(svg) {
          vertical-align: middle;
        }
      `}</style>
    </div>
  )
}

export default NavLink
