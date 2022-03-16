import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid, useTheme, Select } from '@geist-ui/core'
import useSWR from 'swr'
import { AppItem } from 'lib/interfaces'
import ProjectCard from '../components/project-card'
import Plus from '@geist-ui/icons/plus'
import NoItem from 'components/no-item'
import Title from 'components/title'
import MaskLoading from 'components/mask-loading'

const Home: NextPage<unknown> = () => {
  const theme = useTheme()
  const router = useRouter()
  const [deviceType, setDeviceType] = useState<string>('all')
  const { data: apps = [], isValidating } = useSWR<AppItem[]>(`/api/apps`)

  const handleChange = async (val: string) => {
    setDeviceType(val)
  }

  return (
    <>
      <Title value="Home" />
      <div className="page__content">
        <div className="actions-stack">
          <div>
            <Select placeholder="Choose one" value={deviceType} disabled={isValidating} width="150px" ml={0.5} disableMatchWidth onChange={handleChange}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="ios">iOS</Select.Option>
              <Select.Option value="android">Android</Select.Option>
            </Select>
          </div>
          <Button auto type="secondary" icon={<Plus />} onClick={() => router.push('/apps/new')}>
            New Project
          </Button>
        </div>
        <MaskLoading loading={isValidating}>
          <Grid.Container gap={2} marginTop={1} justify="flex-start">
            {
              apps.length > 0 && apps.map((item, index) => {
                return (deviceType === 'all' || item.deviceType === deviceType) && (
                  <Grid xs={24} sm={12} md={8} key={item.id}>
                    <ProjectCard
                      data={item}
                    />
                  </Grid>
                )
              })
            }
            {
              apps.length === 0 && !isValidating && (
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
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            padding: ${theme.layout.unit};
          }
        }
      `}</style>
    </>
  )
}

export default Home
