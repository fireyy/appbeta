import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Divider, Grid, useTheme, Card, Text } from '@geist-ui/core'
import useSWR from 'swr'
import Layout from 'components/layout'
import ActivityGroup from 'components/activity-group'

type OverviewType = {
  apps: number,
  packages: number,
}

const Home: NextPage<unknown> = () => {
  const theme = useTheme()
  const router = useRouter()
  const { data, isValidating } = useSWR<OverviewType>('/api/overview')

  return (
    <Layout title="Dashboard">
      <Grid.Container gap={2}>
        {
          Object.keys(data).map((d, index) => (
            <Grid xs={24} sm={12} md={6} key={index}>
              <Card width="100%">
                <Text h4 my={0} style={{ textTransform: 'uppercase' }}>{d}</Text>
                <Text>{data?.[d]}</Text>
              </Card>
            </Grid>
          ))
        }
      </Grid.Container>
      <Divider my={5} />
      <Text h4>Latest Activity</Text>
      <ActivityGroup />
    </Layout>
  )
}

export default Home
