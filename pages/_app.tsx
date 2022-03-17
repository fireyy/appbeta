import React, { useCallback, useEffect, useState, useMemo } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/core'
import { SWRConfig } from 'swr'
import { PrefersContext, themes, ThemeType } from '../lib/use-prefers'
import Menu from '../components/menu'
import Search from '../components/search'
import { getAutoTheme } from 'lib/utils'
import fetcher from 'lib/fetcher'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = useTheme()
  const [themeType, setThemeType] = useState<ThemeType>()
  const geistTheme = useMemo(() => getAutoTheme(themeType), [themeType])
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url, { shallow }) => {
      console.log(`Loading: ${url}, ${shallow}`)
    }
    const handleStop = (url, { shallow }) => {
      console.log(`Loaded: ${url}, ${shallow}`)
    }
    const handleError = (err, url, { shallow }) => {
      console.log(`error: ${err}, ${url}, ${shallow}`)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleError)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleError)
    }
  }, [router])

  useEffect(() => {
    document.documentElement.removeAttribute('style')
    document.body.removeAttribute('style')

    const theme = window.localStorage.getItem('theme') as ThemeType
    setThemeType(theme)
  }, [])

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme)
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('theme', theme)
  }, [])

  return (
    <SessionProvider session={session}>
      <GeistProvider themeType={geistTheme}>
        <CssBaseline />
        <PrefersContext.Provider value={{ themeType, switchTheme }}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          {
            !pageProps.isFront && (
              <>
                <Menu />
                <Search />
              </>
            )
          }
          <div className="layout">
            <SWRConfig
              value={{
                fetcher,
              }}
            >
              <Component {...pageProps} />
            </SWRConfig>
          </div>
        </PrefersContext.Provider>
        <style global jsx>{`
          html {
            --geist-page-nav-height: 64px;
            --accent-1: ${theme.palette.accents_1};
            --accent-2: ${theme.palette.accents_2};
          }
          body::-webkit-scrollbar {
            width: 0;
            background-color: ${theme.palette.accents_1};
          }
          body::-webkit-scrollbar-thumb {
            background-color: ${theme.palette.accents_2};
            border-radius: ${theme.layout.radius};
          }
          #__next {
            overflow: visible !important;
          }
          .layout {
            min-height: calc(100vh - 108px);
            max-width: ${theme.layout.pageWidthWithMargin};
            margin: 0 auto;
            padding: ${theme.layout.gap};
            box-sizing: border-box;
          }
          @media (max-width: ${theme.breakpoints.sm.max}) {
            .layout {
              padding: ${theme.layout.gapHalf};
            }
          }
        `}</style>
      </GeistProvider>
    </SessionProvider>
  )
}

export default MyApp
