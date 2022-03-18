import React, { useCallback, useEffect, useState, useMemo } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { GeistProvider, CssBaseline, useTheme, Themes } from '@geist-ui/core'
import { SWRConfig } from 'swr'
import NProgress from 'nprogress'
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

  useEffect(() => {
    const theme = window.localStorage.getItem('theme') as ThemeType
    setThemeType(theme)
  }, [])

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', theme)
      document.documentElement.classList.remove('light-theme','dark-theme')
      document.documentElement.classList.add(`${getAutoTheme(theme)}-theme`)
    }
  }, [])

  const themes = Themes.getPresets()
  const lightPalette = themes.find(t => t.type === 'light').palette
  const darkPalette = themes.find(t => t.type === 'dark').palette

  return (
    <SessionProvider session={session}>
      <GeistProvider themeType={geistTheme}>
        <CssBaseline />
        <PrefersContext.Provider value={{ themeType, switchTheme }}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="var(--geist-background)" />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              !function(){try {var d=document.documentElement.classList;d.remove('light-theme','dark-theme');var e=localStorage.getItem('theme');if("auto"===e||(!e&&true)){var t="(prefers-color-scheme: dark)",m=window.matchMedia(t);m.media!==t||m.matches?d.add('dark-theme'):d.add('light-theme')}else if(e) var x={"light":"light-theme","dark":"dark-theme"};d.add(x[e])}catch(e){}}()
            `,
              }}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                body::before{content:'';display:block;position:fixed;width:100%;height:100%;top:0;left:0;background:var(--geist-background);z-index: 99999}.render body::before{display:none}
            `,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                document.documentElement.classList.add('render')
            `,
              }}
            />
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
          }
          html.light-theme {
            --accent-1: ${lightPalette.accents_1};
            --accent-2: ${lightPalette.accents_2};
            --geist-foreground: ${lightPalette.foreground};
            --geist-background: ${lightPalette.background};
          }
          html.dark-theme {
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
