import { useMemo } from 'react'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import { useTheme, Link, Button } from '@geist-ui/core'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import ActivityEvent from 'components/activity-event'
import { bytesStr } from 'lib/utils'
import Skeleton from 'components/skeleton'
import Layout from 'components/layout'

const groupResults = (data) => {
  return data.reduce((acc, item) => {
    const title = item.group || 'General'
    const group = acc.find(group => group.title === title)
    if (!group) {
      acc.push({ title, items: [item] })
    } else {
      group.items.push(item)
    }
    return acc
  }, []).sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime())
}

const PAGE_SIZE = 10

const ActivityPage: NextPage<unknown> = () => {
  const theme = useTheme()
  // const { data = [{},{},{},{},{},{},{},{}], isValidating } = useSWR('/api/activity')
  const { data, error, isValidating, size, setSize } = useSWRInfinite((index) =>
  `/api/activity?limit=${PAGE_SIZE}&page=${
    index + 1
  }`)
  const issues = data ? [].concat(...data) : [{},{},{},{},{},{},{},{}];
  const grouppedResults = useMemo(() => groupResults(issues), [issues])
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

  return (
    <Layout title="Activity">
      <div className="page__activity">
        <ul className="page__activity__list">
        {grouppedResults.map((group, i) => (
          <li role="presentation" key={group.title + i}>
            <div className="group-title">
              {
                isValidating && !group.title ? <Skeleton inline height={24} width={150} /> : <>{group.title}</>
              }
            </div>
            <ul role="group">
              {group.items.map((item, index) => (
                <ActivityEvent
                  isLoading={isValidating && !item.id}
                  key={index}
                  name={item.name}
                  icon={item.icon}
                  createdAt={item.createdAt}
                >
                  {
                    isValidating && !item.id ? <Skeleton width={150} /> : <NextLink href="/" passHref><Link>{item.name}, {item.bundleId}, {item.version}({item.buildVersion}), {bytesStr(item.size || 0)} by {item.userId}</Link></NextLink>
                  }
                </ActivityEvent>
              ))}
            </ul>
          </li>
        ))}
        </ul>
        <Button width="100%" onClick={() => setSize(size + 1)} loading={isLoadingMore} disabled={isReachingEnd}>{isReachingEnd
            ? 'no more'
            : 'load more'}</Button>
        <style jsx>{`
          .page__activity ul {
            padding: 0;
            margin: 0;
          }
          .page__activity__list > li:before {
            content: none;
          }
          .page__activity__list > li {
            display: flex;
            margin: 0;
          }
          .page__activity__list .group-title {
            width: 25%;
            font-size: 1.2rem;
            padding: calc(${theme.layout.gap} * 1.7) 0;
            color: ${theme.palette.accents_6};
            font-weight: 500;
          }
          .page__activity__list ul {
            border-left: 2px solid ${theme.palette.border};
            flex: 1;
            padding: ${theme.layout.gap} 0;
          }
          @media (max-width: ${theme.breakpoints.sm.max}) {
            .page__activity {
              padding: 0 ${theme.layout.gap};
            }
            .page__activity__list > li {
              flex-direction: column;
              justify-content: flex-start;
              align-items: stretch;
            }
            .page__activity__list .group-title {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default ActivityPage
