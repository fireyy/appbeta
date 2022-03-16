import * as React from 'react'

import { Normal, IContentLoaderProps } from '.'
import Svg from './svg'

const Skeleton: React.FC<IContentLoaderProps> = props =>
props.children ? <Svg {...props} /> : <Normal {...props} />

export default Skeleton
