import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import {
  Button,
  Keyboard,
  useTheme,
  Loading,
  Popover,
  Avatar,
  Link,
} from '@geist-ui/core'
import MoonIcon from '@geist-ui/icons/moon'
import SunIcon from '@geist-ui/icons/sun'
import { usePrefers } from '../lib/use-prefers'

const UserSettingsPop: React.FC = () => (
  <>
    <Popover.Item title>
      <span>User Settings</span>
    </Popover.Item>
    <Popover.Item line />
    <Popover.Item>
      <Button auto type="abort" onClick={() => signOut()}>Logout</Button>
    </Popover.Item>
  </>
);

const Controls: React.FC<unknown> = React.memo(() => {
  const { data: session, status } = useSession()
  const theme = useTheme()
  const { switchTheme } = usePrefers()

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
      <Button
        aria-label="Toggle Dark mode"
        auto
        scale={0.5}
        px={0.6}
        h="28px"
        type="abort"
        onClick={() =>
          switchTheme(theme.type === 'dark' ? 'light' : 'dark')
        }
        iconRight={theme.type === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
      />
      {
        status === 'loading' && <Loading />
      }
      {
        !session && (
          <Link href="/api/auth/signin">Log in</Link>
        )
      }
      {
        session && (
          <Popover content={<UserSettingsPop />} placement="bottomEnd" portalClassName="user-settings__popover">
            <button className="user-settings__button">
              <Avatar text={session.user.name} />
            </button>
          </Popover>
        )
      }
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
      `}</style>
    </div>
  )
})

Controls.displayName = 'Controls'

export default Controls
