import React, { useCallback, useEffect, useState, useMemo } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { useTheme, Themes } from '@geist-ui/core'
import { ThemeProvider } from 'lib/theme-provider'
import { SWRConfig } from 'swr'
import NProgress from 'nprogress'
import fetcher from 'lib/fetcher'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = useTheme()
  const router = useRouter()

  useEffect(() => {
    let timer = null
    const handleStart = (url, { shallow }) => {
      console.log(`Loading: ${url}, ${shallow}`)
      timer = setTimeout(() => NProgress.start(), 300)
    }
    const handleStop = () => {
      clearTimeout(timer)
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      timer = null
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  const themes = Themes.getPresets()
  const lightPalette = themes.find(t => t.type === 'light').palette
  const darkPalette = themes.find(t => t.type === 'dark').palette
  const logo = '/favicon.ico'

  return (
    <SessionProvider session={session}>
      <Head>
      <link rel="icon" href={logo} />
      <link rel="shortcut icon" type="image/x-icon" href={logo} />
      <link rel="apple-touch-icon" sizes="180x180" href={logo} />
      <meta name="theme-color" content="var(--geist-background)" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider>
        <SWRConfig
          value={{
            fetcher,
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
        <style global jsx>{`
          :root {
            --geist-page-nav-height: 64px;
            --accent-1: ${lightPalette.accents_1};
            --accent-2: ${lightPalette.accents_2};
            --geist-foreground: ${lightPalette.foreground};
            --geist-background: ${lightPalette.background};
          }
          [data-theme='dark'] {
            --accent-1: ${darkPalette.accents_1};
            --accent-2: ${darkPalette.accents_2};
            --geist-foreground: ${darkPalette.foreground};
            --geist-background: ${darkPalette.background};
          }
          body, html {
            background-color: var(--geist-background);
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
          #nprogress {
            pointer-events:none;
          }
          #nprogress .bar {
            z-index:2000;
            background:var(--geist-foreground);
          }
          #nprogress .bar,
          #nprogress:after {
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:4px;
          }
          #nprogress:after {
            content:"";
            background:var(--accents-2);
          }
          #nprogress .peg{
            box-shadow:0 0 10px var(--geist-foreground),0 0 5px var(--geist-foreground);
          }

        `}</style>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
