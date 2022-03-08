import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'

type Props = {
  data: any
}

const AppGetPage: NextPage<Props> = ({ data }) => {
  return (
    <>
      {data.name}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isIOS = context.req.headers['user-agent'].match(/iPhone|iPad|iPod/i)
  const deviceType = isIOS ? 'ios' : 'android'
  const slug = context.params.slug
  const res = await fetch(`http://localhost:3000/api/app/${slug}`, {
    method: 'GET',
    headers: {
      'xdevice': deviceType
    }
  })
  const data = await res.json()

  if (!data.name) {
    return {
      notFound: true,
    }
  }

  return { props: { data } }
}

export default AppGetPage
