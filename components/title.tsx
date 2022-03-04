import React, { Children } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type Props = {
  value: string
}

const Title: React.FC<Props> = ({
  value,
  children,
}) => {
  const router = useRouter()
  const title = `${value} - AppBeta`
  return (
    <Head>
      <title>{title}</title>
      {children}
    </Head>
  )
}

export default Title
