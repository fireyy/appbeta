import React, { useCallback, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/core'
import { PrefersContext, themes, ThemeType } from '../lib/use-prefers'
import Menu from '../components/menu'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = useTheme()
  const [themeType, setThemeType] = useState<ThemeType>('dark')

  useEffect(() => {
    document.documentElement.removeAttribute('style')
    document.body.removeAttribute('style')

    const theme = window.localStorage.getItem('theme') as ThemeType
    if (themes.includes(theme)) setThemeType(theme)
  }, [])

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme)
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('theme', theme)
  }, [])

  return (
    <SessionProvider session={session}>
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <PrefersContext.Provider value={{ themeType, switchTheme }}>
          <Menu />
          <div className="layout">
            <Component {...pageProps} />
          </div>
        </PrefersContext.Provider>
        <style global jsx>{`
          html {
            --geist-page-nav-height: 64px;
          }
          body::-webkit-scrollbar {
            width: 0;
            background-color: ${theme.palette.accents_1};
          }
          body::-webkit-scrollbar-thumb {
            background-color: ${theme.palette.accents_2};
            border-radius: ${theme.layout.radius};
          }
          .layout {
            min-height: calc(100vh - 108px);
            max-width: ${theme.layout.pageWidthWithMargin};
            margin: 0 auto;
            padding: ${theme.layout.gap};
            box-sizing: border-box;
          }
        `}</style>
      </GeistProvider>
    </SessionProvider>
  )
}

export default MyApp
