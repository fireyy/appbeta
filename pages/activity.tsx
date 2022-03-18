import { useMemo } from 'react'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import { useTheme, Link } from '@geist-ui/core'
import useSWR from 'swr'
import ActivityEvent from 'components/activity-event'
import Title from 'components/title'
import { bytesStr } from 'lib/utils'
import Skeleton from 'components/skeleton'

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

const ActivityPage: NextPage<unknown> = () => {
  const theme = useTheme()
  const { data = [{},{},{},{},{},{},{},{}], isValidating } = useSWR('/api/activity')
  const grouppedResults = useMemo(() => groupResults(data), [data])

  return (
    <div className="page__activity">
      <Title value="Activity" />
      <ul className="page__activity__list">
      {grouppedResults.map((group) => (
        <li role="presentation" key={group.title}>
          <div className="group-title">
            {
              isValidating && !group.title ? <Skeleton inline height={24} width={150} /> : <>{group.title}</>
            }
          </div>
          <ul role="group">
            {group.items.map(item => (
              <ActivityEvent
                isLoading={isValidating && !item.id}
                key={item.id}
                name={item.name}
                icon={item.icon}
                createdAt={item.createdAt}
              >
                <NextLink href="/" passHref>
                  {
                    isValidating && !item.id ? <Skeleton width={150} /> : <Link>{item.name}, {item.bundleId}, {item.version}({item.buildVersion}), {bytesStr(item.size)} by {item.userId}</Link>
                  }
                </NextLink>
              </ActivityEvent>
            ))}
          </ul>
        </li>
      ))}
      </ul>
      <style jsx>{`
        .page__activity ul {
          padding: 0;
          margin: 0;
        }
        .page__activity__list > li:before {
          content: '';
        }
        .page__activity__list > li {
          display: flex;
          margin: 0;
        }
        .page__activity__list .group-title {
          width: 25%;
          font-size: 1.2rem;
          padding: calc(${theme.layout.gap} * 2) 0;
          color: ${theme.palette.accents_5};
        }
        .page__activity__list ul {
          border-left: 2px solid ${theme.palette.border};
          flex: 1;
          padding: ${theme.layout.gap} 0;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
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
  )
}

export default ActivityPage
