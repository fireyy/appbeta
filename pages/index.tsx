import type { NextPage } from 'next'
import { Divider, Grid, Card, Text } from '@geist-ui/core'
import useSWR from 'swr'
import Layout from 'components/layout'
import ActivityGroup from 'components/activity-group'
import useTranslation from 'next-translate/useTranslation'

type OverviewType = {
  app: number,
  package: number,
}

const Home: NextPage<unknown> = () => {
  const { t } = useTranslation('common')
  const { data = { app: 0, package: 0 }, isValidating } = useSWR<OverviewType>('/api/overview')

  return (
    <Layout title="Dashboard">
      <Grid.Container gap={2}>
        {
          Object.keys(data).map((d, index) => (
            <Grid xs={24} sm={12} md={6} key={index}>
              <Card width="100%">
                <Text h4 my={0} style={{ textTransform: 'uppercase' }}>{t(d)}</Text>
                <Text>{data?.[d]}</Text>
              </Card>
            </Grid>
          ))
        }
      </Grid.Container>
      <Divider my={5} />
      <Text h4>{t('Latest Activity')}</Text>
      <ActivityGroup />
    </Layout>
  )
}

export default Home
