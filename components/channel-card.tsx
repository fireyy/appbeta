import React from 'react'
import NextLink from 'next/link'
import { Button, Text, Link, Card, Dot, Tag, useTheme } from '@geist-ui/core'
import { ChannelItem } from '../interfaces'

interface Props {
  data: ChannelItem
}

export type ChannelCardProps = Props

const ChannelCard: React.FC<ChannelCardProps> = ({ data }) => {
  const theme = useTheme()

  return (
    <>
      <div className="channel__wrapper">
        <Card className="channel__card" shadow>
          <div className="channel__title">
            <Text h3>{data.name} {data.deviceType}</Text>
            <NextLink href={`/channels/${data.id}`} passHref>
              <Button className="channel__visit-button" height={0.8} auto>
                Detail
              </Button>
            </NextLink>
          </div>
          <div>
            <Dot className="channel__deployment" type="success">
              <Link href="#">123</Link>
              <Tag className="channel__environment-tag" type="secondary">
                Production
              </Tag>
              <span className="channel__created-at">22</span>
            </Dot>
          </div>
          <Card.Footer className="channel__footer">
            <Text className="channel__repo">{data.updatedAt}</Text>
          </Card.Footer>
        </Card>
      </div>
      <style jsx>{`
        .channel__wrapper :global(.channel__card) {
          padding: 0 !important;
        }
        .channel__title {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: ${theme.layout.gap};
        }
        .channel__title :global(h3) {
          margin: 0;
        }
        .channel__wrapper :global(.channel__deployment) {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: ${theme.layout.gapQuarter};
        }
        .channel__wrapper :global(.channel__deployment) :global(.icon) {
          background-color: #50e3c2;
        }
        .channel__wrapper :global(.channel__deployment) :global(.label) {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          text-transform: unset;
        }
        .channel__wrapper :global(.channel__deployment) :global(a) {
          font-size: 0.875rem;
          font-weight: 500;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .channel__wrapper :global(.channel__environment-tag) {
          color: ${theme.palette.foreground};
          background: ${theme.palette.accents_1};
          border-color: ${theme.palette.accents_2};
          border-radius: 1rem;
          padding: 2px 6px;
          height: unset;
          font-size: 0.75rem;
          font-weight: 500;
          margin-left: ${theme.layout.gapHalf};
        }
        .channel__wrapper :global(.channel__created-at) {
          color: ${theme.palette.accents_4};
          font-size: 0.875rem;
          text-align: right;
          margin: 0 0 0 ${theme.layout.gapHalf};
        }
        .channel__wrapper :global(.channel__footer) {
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .channel__wrapper :global(.channel__repo) {
          font-size: 0.875rem;
          font-weight: 500;
          margin-left: ${theme.layout.gapQuarter};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .channel__wrapper :global(.channel__visit-button) {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default ChannelCard
