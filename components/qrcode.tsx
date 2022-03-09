import React from 'react'
import dynamic from 'next/dynamic'

const QRCodeDynamic: any = dynamic(() => import('react-qrcode-logo').then(m => m.QRCode), {
  ssr: false,
  loading: () => null,
})

type Props = {
  value: string
  logoImage?: string
  logoWidth?: number
  logoHeight?: number
  logoOpacity?: number
}

const QRCode: React.FC<Props> = (props) => {
  return (
    <QRCodeDynamic {...props} />
  )
}

export default QRCode
