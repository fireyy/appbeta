import React from 'react'
import { Loading, useTheme } from '@geist-ui/core'
import { addColorAlpha } from 'lib/utils'

type Props = {
  loading: boolean,
}

const MaskLoading: React.FC<Props> = ({ loading, children }) => {
  const theme = useTheme()

  return (
    <div className="mask-loading-container">
      {
        loading && (
          <div className="mask-loading">
            <Loading />
          </div>
        )
      }
      <div className="mask-loading-content">
        {children}
      </div>
      <style jsx>{`
        .mask-loading-container {
          position: relative;
          width: 100%;
        }
        .mask-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${addColorAlpha(theme.palette.background, 0.8)};
        }
      `}</style>
    </div>
  )
}

export default MaskLoading
