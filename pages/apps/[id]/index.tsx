import React from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@geist-ui/core'
import useSWR from 'swr'
import { AppItem } from 'lib/interfaces'
import ProjectInfo from 'components/project-info'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import PackageItems from 'components/package-items'
import Skeleton from 'components/skeleton'

const AppPage: React.FC<unknown> = () => {
  const theme = useTheme()
  const router = useRouter()

  const { data, isValidating: isLoading } = useSWR<AppItem>(`/api/apps/${router.query.id}`)

  return (
    <Layout title={data?.name || ''}>
      <NavLink>{data?.name || ''}</NavLink>
      <ProjectInfo data={data} isLoading={isLoading && !data} />
      <div className="page__wrapper">
        <div className="page__content">
          {
            !data ? <>
              <Skeleton boxHeight={32} />
              <Skeleton boxHeight={32} />
              <Skeleton boxHeight={32} />
            </> :
            <PackageItems slug={data.slug} appId={data.id} lastPkgId={data.lastPkgId} />
          }
        </div>
      </div>
      <style jsx>{`
        .page__content {
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          box-sizing: border-box;
          overflow-x: auto;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 0;
          }
        }
      `}</style>
    </Layout>
  )
}

export default AppPage
