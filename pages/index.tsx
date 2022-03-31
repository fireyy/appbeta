import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid, useTheme, Select } from '@geist-ui/core'
import useSWR from 'swr'
import Layout from 'components/layout'

const Home: NextPage<unknown> = () => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <Layout title="Dashboard">

    </Layout>
  )
}

export default Home
