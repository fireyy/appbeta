import React, { CSSProperties } from 'react'
import { useTheme, useClasses } from '@geist-ui/core'
import px from 'lib/to-pixels'
import s from './skeleton.module.css'

interface SkeletonProps {
  show?: boolean
  inline?: boolean
  rounded?: boolean
  squared?: boolean
  className?: string
  style?: CSSProperties
  width?: string | number
  height?: string | number
  boxHeight?: string | number
}

const Skeleton: React.FC<SkeletonProps> = ({
  style,
  width,
  height,
  children,
  className,
  show = true,
  inline = false,
  rounded = false,
  squared = false,
  boxHeight = height,
}) => {
  // Automatically calculate the size if there are children
  // and no fixed sizes are specified
  const shouldAutoSize = !!children && !(width || height)

  // Defaults
  width = width || 20
  height = height || 20
  boxHeight = boxHeight || height

  return (
    <span
      className={useClasses(s.skeleton, className, {
        [s.show]: show,
        [s.wrapper]: shouldAutoSize,
        [s.loaded]: !shouldAutoSize && !!children,
        [s.inline]: inline,
        [s.squared]: squared,
        [s.rounded]: rounded,
      })}
      style={
        shouldAutoSize
          ? {}
          : {
              minWidth: px(width),
              minHeight: px(height),
              marginBottom: `calc(${px(boxHeight)} - ${px(height)})`,
              ...style,
            }
      }
    >
      {children}
    </span>
  )
}

export default Skeleton
