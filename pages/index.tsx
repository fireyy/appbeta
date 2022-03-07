import type { NextPage, GetServerSideProps } from 'next'
import Router from 'next/router'
import { Button, Grid, useTheme } from '@geist-ui/core'
import { AppItem } from '../interfaces'
import ProjectCard from '../components/project-card'
import NoItem from 'components/no-item'
import Title from 'components/title'

type Props = {
  data: AppItem[]
}

const Home: NextPage<Props> = ({ data }) => {
  const theme = useTheme()

  return (
    <>
      <Title value="Home" />
      <div className="page__content">
        <div className="actions-stack">
          <Button auto type="secondary" onClick={() => Router.push('/apps/new')}>
            New Project
          </Button>
        </div>
        <Grid.Container gap={2} marginTop={1} justify="flex-start">
          {
            (data && data.length > 0) && data.map((item, index) => {
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
            (!data || data.length === 0) && (
              <Grid xs={24}>
                <NoItem link={'/apps/new'} />
              </Grid>
            )
          }
        </Grid.Container>
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
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/apps`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    }
  })
  const data = await res.json()
  return { props: { data } }
}

export default Home
