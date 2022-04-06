import React, { useState } from 'react'
import { Popover, PopoverProps, useClasses, useTheme, useMediaQuery, Drawer } from '@geist-ui/core'

export const DropdownItem = Popover.Item

export const Dropdown = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & PopoverProps &
    React.RefAttributes<HTMLDivElement>
>(function Dropdown({ children, className, portalClassName, content, ...props }, forwardedRef) {
  const theme = useTheme()
  const isMobile = useMediaQuery('xs', { match: 'down' })
  const [visible, setVisible] = useState(false)

  return (
    <>
      {
        isMobile && (
          <div className="drop-menu-box">
            <div className={useClasses('dropdown-button', className)} onClick={() => setVisible(true)}>{children}</div>
            <Drawer visible={visible} onClose={() => setVisible(false)} onContentClick={() => setVisible(false)} placement="bottom">
              <Drawer.Content>
                {content}
              </Drawer.Content>
            </Drawer>
          </div>
        )
      }
      {
        !isMobile && (
          <Popover ref={forwardedRef} placement="bottomEnd" content={content} portalClassName={useClasses('drop-menu-box', portalClassName)} {...props}>
            <div className={useClasses('dropdown-button', className)}>{children}</div>
          </Popover>
        )
      }
      <style jsx global>{`
      .tooltip-content.popover.drop-menu-box > .inner {
          padding: calc(${theme.layout.gapHalf} / 2);
          min-width: 120px;
        }
        .drop-menu-box .item:hover {
          background-color: ${theme.palette.accents_2};
        }
        .drop-menu-box .item.disabled {
          cursor: not-allowed;
          color: ${theme.palette.accents_1};
        }
        .drop-menu-box .item .tooltip {
          display: block;
          flex: 1;
          cursor: pointer;
        }
      `}</style>
    </>
  )
})
