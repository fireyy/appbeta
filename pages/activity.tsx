import type { NextPage } from 'next'
import { useTheme } from '@geist-ui/core'
import Layout from 'components/layout'
import ActivityGroup from 'components/activity-group'
import useTranslation from 'next-translate/useTranslation'

const ActivityPage: NextPage<unknown> = () => {
  const theme = useTheme()
  const { t } = useTranslation('common')

  return (
    <Layout title={t('Activity')}>
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
