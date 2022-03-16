import { SVGAttributes } from 'react'

import Skeleton from './skeleton'

export interface IContentLoaderProps extends SVGAttributes<SVGElement> {
  animate?: boolean
  animateBegin?: string
  backgroundColor?: string
  backgroundOpacity?: number
  baseUrl?: string
  foregroundColor?: string
  foregroundOpacity?: number
  gradientRatio?: number
  gradientDirection?: 'left-right' | 'top-bottom'
  interval?: number
  rtl?: boolean
  speed?: number
  title?: string
  uniqueKey?: string
  beforeMask?: JSX.Element
}

export { default as Normal } from './presets/normal'

export default Skeleton
