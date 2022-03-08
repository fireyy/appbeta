import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Controls from './controls'
import { useTheme, Image, Tabs } from '@geist-ui/core'
import { addColorAlpha } from '../lib/utils'

const Menu: React.FC<unknown> = () => {
  const router = useRouter()
  const theme = useTheme()

  const names = router.pathname.split('/').filter(r => !!r)
  const currentUrlTabValue = names[0] || ''

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
      <div className="menu-wrapper">
        <nav className="menu">
          <div className="content">
            <div className="logo">
              <NextLink href={`/`}>
                <a aria-label="Go Home">
                  <Image
                    src="/images/logo.png"
                    width="20px"
                    height="20px"
                    mr={0.5}
                    draggable={false}
                    title="Logo"
                    alt="logo"
                  />
                  AppBeta
                </a>
              </NextLink>
            </div>

            <div className="tabs">
              <Tabs
                value={currentUrlTabValue}
                leftSpace={0}
                activeClassName="current"
                align="center"
                hideDivider
                hideBorder
                onChange={handleTabChange}>
                <Tabs.Item font="14px" label={'Home'} value="" />
                <Tabs.Item font="14px" label={'Activity'} value="activity" />
              </Tabs>
            </div>

            <div className="controls">
              <Controls />
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .menu-wrapper {
          height: var(--geist-page-nav-height);
        }
        .menu {
          position: fixed;
          top: 0;
          height: var(--geist-page-nav-height);
          width: 100%;
          backdrop-filter: saturate(180%) blur(5px);
          background-color: ${addColorAlpha(theme.palette.background, 0.8)};
          box-shadow: ${theme.type === 'dark'
            ? '0 0 0 1px #333'
            : '0 0 15px 0 rgba(0, 0, 0, 0.1)'};
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
          flex: 1 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .logo a {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          font-size: 1.125rem;
          font-weight: 500;
          color: inherit;
          height: 28px;
        }
        .logo :global(.image) {
          border: 1px solid ${theme.palette.border};
          border-radius: 2rem;
        }
        .tabs {
          flex: 1 1;
          padding: 0 ${theme.layout.gap};
        }
        .tabs :global(.content) {
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
      `}</style>
    </>
  )
}

export default Menu
