import type { NextPage } from 'next'
import { Button, Grid, Input, useTheme } from '@geist-ui/core'
import SearchIcon from '@geist-ui/icons/search'
import CreateTeamIcon from '@geist-ui/icons/userPlus'
import ProjectCard from '../components/project-card'

const Home: NextPage = () => {
  const theme = useTheme()

  return (
    <>
      <div className="page__content">
        <div className="actions-stack">
          <Input
            scale={1.25}
            width="100%"
            icon={<SearchIcon color={theme.palette.accents_5} />}
            placeholder="Search..."
          />
          <Button auto type="secondary" marginLeft={1}>
            New Project
          </Button>
          <Button iconRight={<CreateTeamIcon />} marginLeft={1} px={0} width="48px" />
        </div>
        <Grid.Container gap={2} marginTop={1} justify="flex-start">
          <Grid xs={24} sm={12} md={8}>
            <ProjectCard
              projectId="test-project"
              icon="https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg"
              changelog={'test'}
              updatedAt="4m"
            />
          </Grid>
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

export default Home
