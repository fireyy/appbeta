import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from 'next-themes'
import { GeistProvider, CssBaseline, useTheme, Themes } from '@geist-ui/core'
import { PropsWithChildren } from 'react'

function CustomProvider({ children }: PropsWithChildren<{}>) {
  const { resolvedTheme } = useNextTheme()

  return (
    <GeistProvider themeType={resolvedTheme}>
      <CssBaseline />
      {children}
    </GeistProvider>
  )
}

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  return (
    <NextThemeProvider disableTransitionOnChange>
      <CustomProvider>{children}</CustomProvider>
    </NextThemeProvider>
  )
}
