import type { NextPage, GetServerSideProps } from 'next'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, Grid, useTheme, Select } from '@geist-ui/core'
import { AppItem } from '../interfaces'
import ProjectCard from '../components/project-card'
import Plus from '@geist-ui/icons/plus'
import NoItem from 'components/no-item'
import Title from 'components/title'
import MaskLoading from 'components/mask-loading'

type Props = {
  data: AppItem[]
  deviceType: string
}

const fetchAppsByDeviceType = async (val: string): Promise<AppItem[]> => {
  const data = val === 'all' ? {} : { body: JSON.stringify({deviceType: val}) }
  const res = await fetch(`http://localhost:3000/api/apps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...data,
  })

  return await res.json()
}

const Home: NextPage<Props> = ({ data, deviceType }) => {
  const theme = useTheme()
  const router = useRouter()
  const [apps, setApps] = useState<AppItem[]>(data)
  const [loading, setLoading] = useState(false)

  const handleChange = async (val: string) => {
    setLoading(true)
    const result = await fetchAppsByDeviceType(val)
    setApps(result)
    setLoading(false)
    router.push({
      pathname: '/',
      query: { deviceType: val },
    }, undefined, { shallow: true })
  }

  return (
    <>
      <Title value="Home" />
      <div className="page__content">
        <div className="actions-stack">
          <div>
            DeviceType:
            <Select placeholder="Choose one" value={deviceType} disabled={loading} width="150px" ml={0.5} disableMatchWidth onChange={handleChange}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="ios">iOS</Select.Option>
              <Select.Option value="android">Android</Select.Option>
            </Select>
          </div>
          <Button auto type="secondary" icon={<Plus />} onClick={() => router.push('/apps/new')}>
            New Project
          </Button>
        </div>
        <MaskLoading loading={loading}>
          <Grid.Container gap={2} marginTop={1} justify="flex-start">
            {
              (apps && apps.length > 0) && apps.map((item, index) => {
                return (
                  <Grid xs={24} sm={12} md={8} key={item.id}>
                    <ProjectCard
                      data={item}
                    />
                  </Grid>
                )
              })
            }
            {
              (!apps || apps.length === 0) && !loading && (
                <Grid xs={24}>
                  <NoItem link={'/apps/new'} />
                </Grid>
              )
            }
          </Grid.Container>
        </MaskLoading>
      </div>
      <style jsx>{`
        .page__content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: ${theme.layout.unit} ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
        .actions-stack {
          display: flex;
          width: 100%;
        }
        .actions-stack {
          display: flex;
          width: 100%;
          font-size: 14px;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const deviceType = String(context.query.deviceType || 'all')
  const data = await fetchAppsByDeviceType(deviceType)
  return { props: { data, deviceType } }
}

export default Home
