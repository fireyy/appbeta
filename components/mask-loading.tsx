import React from 'react'
import { Loading } from '@geist-ui/core'

type Props = {
  loading: boolean,
}

const MaskLoading: React.FC<Props> = ({ loading, children }) => {
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
        }
        .mask-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

export default MaskLoading
