import type { NextPage } from 'next'
import { useTheme } from '@geist-ui/core'
import Layout from 'components/layout'
import ActivityGroup from 'components/activity-group'

const ActivityPage: NextPage<unknown> = () => {
  const theme = useTheme()

  return (
    <Layout title="Activity">
      <div className="page__activity">
        <ActivityGroup infinite />
        <style jsx>{`
          @media (max-width: ${theme.breakpoints.sm.max}) {
            .page__activity {
              padding: 0 0 0 ${theme.layout.gap};
            }
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default ActivityPage
