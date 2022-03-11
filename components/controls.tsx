import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  Button,
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
import { usePrefers } from 'lib/use-prefers'
import { getAutoTheme } from 'lib/utils'

const UserSettingsPop: React.FC = () => (
  <>
    <Popover.Item>
      <Button auto h="28px" type="abort" onClick={() => signOut()}>Logout</Button>
    </Popover.Item>
  </>
);

const Controls: React.FC<unknown> = React.memo(() => {
  const { data: session, status } = useSession()
  const [autoTheme, setAutoTheme] = useState('dark')
  const theme = useTheme()
  const { switchTheme, themeType } = usePrefers()
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
      <Select
        disableMatchWidth
        scale={0.5}
        h="28px"
        pure
        onChange={switchTheme}
        value={themeType}
        title={'Switch Themes'}>
        <Select.Option value="auto">
          <span className="select-content">
            {autoTheme === 'light' ? <SunIcon size={12} /> : <MoonIcon size={12} />} {'Auto'}
          </span>
        </Select.Option>
        <Select.Option value="light">
          <span className="select-content">
            <SunIcon size={12} /> {'Light'}
          </span>
        </Select.Option>
        <Select.Option value="dark">
          <span className="select-content">
            <MoonIcon size={12} /> {'Dark'}
          </span>
        </Select.Option>
      </Select>
      <Spacer w={0.75} />
      {
        status === 'loading' && <Loading />
      }
      <Popover content={<UserSettingsPop />} placement="bottomEnd" portalClassName="user-settings__popover">
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
        .wrapper :global(.select) {
          width: 20px;
          min-width: 20px;
        }
        .select-content {
          width: auto;
          height: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wrapper :global(.select .value .select-content) {
          font-size: 0;
        }
        .wrapper :global(.select .value) {
          margin-right: 0;
        }
        .select-content :global(svg) {
          margin: 0 2px;
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
      `}</style>
    </div>
  )
})

Controls.displayName = 'Controls'

export default Controls
