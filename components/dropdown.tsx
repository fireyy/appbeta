import React from 'react'
import { Popover, PopoverProps, useClasses, useTheme } from '@geist-ui/core'

export const DropdownItem = Popover.Item

export const Dropdown = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & PopoverProps &
    React.RefAttributes<HTMLDivElement>
>(function Dropdown({ children, className, portalClassName, ...props }, forwardedRef) {
  const theme = useTheme()
  return (
    <>
      <Popover ref={forwardedRef} placement="bottomEnd" portalClassName={useClasses('drop-menu-box', portalClassName)} {...props}>
        <div className={useClasses('dropdown-button', className)}>{children}</div>
      </Popover>
      <style jsx global>{`
      .tooltip-content.popover.drop-menu-box > .inner {
          padding: calc(${theme.layout.gapHalf} / 2);
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
