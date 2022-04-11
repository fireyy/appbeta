import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTheme } from '@geist-ui/core'
import useRequireAuth from 'lib/use-require-auth'
import Header from 'components/header'
import Search from 'components/search'
import LoadingDots from 'components/loading-dots'
import useTranslation from 'next-translate/useTranslation'

type WithChildren<T = {}> = T & PropsWithChildren<{}>;

interface LayoutProps extends WithChildren {
  title?: string
}

export default function Layout({ title, children }: LayoutProps) {
  const router = useRouter()
  const theme = useTheme()
  const isFront = router.pathname.startsWith('/[slug]')
  const { t } = useTranslation('common')

  if (!isFront) {
    const session = useRequireAuth()
    if (!session) return <LoadingDots />
  }

  return (
    <>
      <Head>
        <title>{`${title} - ${t('AppBeta')}`}</title>
      </Head>
      {
        !isFront && (
          <>
            <Header />
            <Search />
          </>
        )
      }
      <div className="layout">
        {children}
      </div>
      <style jsx>{`
        .layout {
          min-height: calc(100vh - var(--geist-page-nav-height));
          max-width: ${theme.layout.pageWidthWithMargin};
          margin: 0 auto;
          padding: ${theme.layout.gap};
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}
