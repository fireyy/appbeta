import React, { useMemo } from 'react'
import NextLink from 'next/link'
import { useTheme, Link, Button, Tag } from '@geist-ui/core'
import useSWRInfinite from 'swr/infinite'
import ActivityEvent from 'components/activity-event'
import { bytesStr } from 'lib/utils'
import Skeleton from 'components/skeleton'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  infinite?: boolean,
}

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

const ActivityGroup: React.FC<Props> = ({ infinite }) => {
  const theme = useTheme()
  const { t } = useTranslation('common')
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
    <>
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
                  isValidating && !item.id ? <Skeleton width={150} /> : <NextLink href={`/apps/${item.appId}`} passHref><Link>{t('activity-message', {
                    appName: item.app?.name,
                    version: item.version,
                    buildVersion: item.buildVersion,
                    size: bytesStr(item.size || 0)
                  })}<Tag scale={1/3} type="lite" ml={1}>{item.app?.deviceType}</Tag></Link></NextLink>
                }
              </ActivityEvent>
            ))}
          </ul>
        </li>
      ))}
      </ul>
      {
        infinite && <div className="loadmore-button">
        <Button width="100%" onClick={() => setSize(size + 1)} loading={isLoadingMore} disabled={isReachingEnd}>{isReachingEnd
          ? t('no more')
          : t('load more')}</Button>
      </div>
      }
      <style jsx>{`
        .page__activity__list {
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
          margin: 0;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__activity__list .group-title {
            padding: ${theme.layout.gapHalf} 0;
            margin-left: -${theme.layout.gap};
          }
          .page__activity__list > li {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
          }
          .page__activity__list .group-title {
            width: 100%;
          }
          .loadmore-button {
            margin-left: -${theme.layout.gap};
          }
        }
      `}</style>
    </>
  )
}

export default ActivityGroup
