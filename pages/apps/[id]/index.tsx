import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import NextLink from 'next/link'
import { Text, Link, useTheme } from '@geist-ui/core'
import { AppItem, ChannelItem } from 'interfaces'
import ProjectInfo from 'components/project-info'
import EventListItem from 'components/activity-event'
import ChannelCard from 'components/channel-card'

async function save(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/apps/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

type Props = {
  data: AppItem
}

const AppPage: React.FC<Props> = ({ data }) => {
  const theme = useTheme()
  const [channels, setChannels] = useState<ChannelItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/apps/${data.id}/channels`)
      const result = await res.json()
      setChannels(result)
    }
    fetchData()
  }, [])

  return (
    <>
      <ProjectInfo data={data} />
      <div className="page__wrapper">
        <div className="page__content">
          <div className="channels">
            {
              channels && channels.length > 0 && channels.map((channel) => {
                return (
                  <ChannelCard
                    key={channel.id}
                    data={channel}
                  />
                )
              })
            }
          </div>
          <div className="recent-activity">
            <Text h2 className="recent-activity__title">
              Recent Activity
            </Text>
            <EventListItem username="fireyy" avatar="https://avatars.githubusercontent.com/u/66291?v=4" createdAt="4m">
              You deployed iOS to <b>production</b>
            </EventListItem>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page__wrapper {
        }
        .page__content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
        .channels {
          width: 540px;
          max-width: 100%;
          margin-right: calc(4 * ${theme.layout.gap});
        }
        .channels :global(.channel__wrapper):not(:last-of-type) {
          margin-bottom: calc(1.5 * ${theme.layout.gap});
        }
        .recent-activity {
          flex: 1;
        }
        .recent-activity :global(.recent-activity__title) {
          font-size: 0.875rem;
          font-weight: 700;
          margin: 0 0 calc(3 * ${theme.layout.gapHalf});
        }
        .page__content :global(.view-all) {
          font-size: 0.875rem;
          font-weight: 700;
          margin: calc(1.5 * ${theme.layout.gap}) 0;
          text-align: center;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
          }
          .channels {
            width: 100%;
            margin-right: unset;
          }
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/apps/${context.params.id}`)
  const data = await res.json()
  return { props: { data } }
}

export default AppPage
