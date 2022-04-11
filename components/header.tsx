import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Controls from './controls'
import { useTheme, Tabs } from '@geist-ui/core'
import useTranslation from 'next-translate/useTranslation'

const Header: React.FC<unknown> = () => {
  const router = useRouter()
  const theme = useTheme()
  const { t } = useTranslation('common')

  const names = router.pathname.split('/').filter(r => !!r)
  const currentUrlTabValue = names[0] || ''
  console.log('currentUrlTabValue', currentUrlTabValue)

  const handleTabChange = useCallback(
    (tab: string) => {
      const shouldRedirectDefaultPage = currentUrlTabValue !== tab
      if (!shouldRedirectDefaultPage) return
      const defaultPath = `/${tab}`
      router.push(defaultPath)
    },
    [currentUrlTabValue],
  )

  return (
    <>
      <div className="header-wrapper">
        <nav className="header">
          <div className="content">
            <div className="logo">
              <NextLink href={`/`}>
                <a aria-label={t('Go Home')} title={t('AppBeta')}>
                  <svg aria-label="logo" height="20" viewBox="0 0 140 150" stroke={theme.palette.foreground} strokeWidth="20">
                    <path d="M85.0816 5L13.7609 140.636M57.3181 14.6834L127.318 145M0 94.9724H140" />
                  </svg>
                </a>
              </NextLink>
            </div>

            <div className="menu">
              <Tabs
                value={currentUrlTabValue}
                leftSpace={0}
                activeClassName="current"
                hideDivider
                onChange={handleTabChange}>
                <Tabs.Item font="14px" label={t('Overview')} value="" />
                <Tabs.Item font="14px" label={t('Apps')} value="apps" />
                <Tabs.Item font="14px" label={t('Activity')} value="activity" />
                <Tabs.Item font="14px" label={t('Settings')} value="account" />
              </Tabs>
            </div>

            <div className="controls">
              <Controls />
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .header-wrapper {
          height: var(--geist-page-nav-height);
        }
        .header {
          position: fixed;
          top: 0;
          height: var(--geist-page-nav-height);
          width: 100%;
          background-color: ${theme.palette.background};
          box-shadow: inset 0 -1px ${theme.palette.accents_2};
          z-index: 999;
        }
        nav .content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          height: 100%;
          margin: 0 auto;
          user-select: none;
          padding: 0 ${theme.layout.gap};
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .logo a {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          font-size: 1rem;
          font-weight: 500;
          color: inherit;
          height: 28px;
        }
        .logo svg {
          margin-right: 5px;
        }
        .menu {
          flex: 1 1;
          padding: 0 ${theme.layout.gap};
        }
        .menu :global(.content) {
          display: none;
        }
        .controls {
          flex: 1 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .controls :global(.menu-toggle) {
          display: flex;
          align-items: center;
          min-width: 40px;
          height: 40px;
          padding: 0;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .logo a {
            font-size: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Header
