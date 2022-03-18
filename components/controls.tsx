import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'
import {
  Link,
  Keyboard,
  useTheme,
  Loading,
  Popover,
  Avatar,
  Spacer,
  Select,
} from '@geist-ui/core'
import MoonIcon from '@geist-ui/icons/moon'
import SunIcon from '@geist-ui/icons/sun'
import Display from '@geist-ui/icons/display'
import { usePrefers } from 'lib/use-prefers'
import { getAutoTheme } from 'lib/utils'

type UserSettingsProp = {
  autoTheme: string
}

const UserSettingsPop: React.FC<UserSettingsProp> = ({ autoTheme }) => {
  const { switchTheme, themeType } = usePrefers()

  return (
    <>
      <Popover.Item>
        <NextLink href="/account" passHref>
          <Link>Settings</Link>
        </NextLink>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        Theme
        <Select
          disableMatchWidth
          onChange={switchTheme}
          value={themeType}
          title={'Switch Themes'}
          ml={0.5}
          style={{ minWidth: '7em' }}>
          <Select.Option value="auto">
            <Display size={12} /> {'Auto'}
          </Select.Option>
          <Select.Option value="light">
            <SunIcon size={12} /> {'Light'}
          </Select.Option>
          <Select.Option value="dark">
            <MoonIcon size={12} /> {'Dark'}
          </Select.Option>
        </Select>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <NextLink href="/api/auth/signout" passHref>
          <Link>Logout</Link>
        </NextLink>
      </Popover.Item>
    </>
  )
}

const Controls: React.FC<unknown> = React.memo(() => {
  const { data: session, status } = useSession()
  const [autoTheme, setAutoTheme] = useState('dark')
  const theme = useTheme()
  useEffect(() => {
    setAutoTheme(getAutoTheme('auto'))
  }, [])

  return (
    <div className="wrapper">
      <Keyboard
        h="28px"
        command
        font="12px"
        className="shortcuts"
        title="Command + K to search.">
        K
      </Keyboard>
      <Spacer w={0.75} />
      {
        status === 'loading' && <Loading />
      }
      <Popover content={<UserSettingsPop autoTheme={autoTheme} />} placement="bottomEnd" portalClassName="user-settings__popover">
        {
          (!session && status !== 'loading') && (
            <button className="user-settings__button" onClick={() => signIn()}>
              <Avatar text="Log in" />
            </button>
          )
        }
        { session && (
          <button className="user-settings__button">
            <Avatar src={session.user.image} text={session.user.name} />
          </button>
        )}
      </Popover>
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
        }
        .wrapper :global(kbd.shortcuts) {
          line-height: 28px !important;
          cursor: help;
          opacity: 0.75;
          border: none;
        }
        .user-settings__button {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          appearance: none;
          cursor: pointer;
        }
        :global(.user-settings__popover) {
          width: 180px !important;
        }
        :global(.user-settings__popover .link) {
          display: block;
          width: 100%;
          padding: ${theme.layout.gapHalf};
          margin: -8px -12px;
          box-sizing: content-box;
        }
        :global(.user-settings__popover .link:hover) {
          background-color: ${theme.palette.accents_1};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .wrapper :global(kbd.shortcuts) {
            display: none;
          }
        }
      `}</style>
    </div>
  )
})

Controls.displayName = 'Controls'

export default Controls
