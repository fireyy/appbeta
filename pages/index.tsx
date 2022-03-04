import type { NextPage, GetServerSideProps } from 'next'
import Router from 'next/router'
import { Button, Grid, Input, useTheme } from '@geist-ui/core'
import SearchIcon from '@geist-ui/icons/search'
import CreateTeamIcon from '@geist-ui/icons/userPlus'
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
          <Input
            scale={1.25}
            width="100%"
            icon={<SearchIcon color={theme.palette.accents_5} />}
            placeholder="Search..."
          />
          <Button auto type="secondary" marginLeft={1} onClick={() => Router.push('/apps/new')}>
            New Project
          </Button>
          <Button iconRight={<CreateTeamIcon />} marginLeft={1} px={0} width="48px" />
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
          padding: calc(${theme.layout.unit} * 2) ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
        .actions-stack {
          display: flex;
          width: 100%;
        }
        .actions-stack :global(.input-wrapper) {
          background-color: ${theme.palette.background};
        }
        .actions-stack :global(input) {
          font-size: 14px;
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
