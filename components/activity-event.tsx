import React from 'react'
import { Avatar, Text, useTheme } from '@geist-ui/core'
import { timeAgo, getIconPath } from 'lib/utils'

interface Props {
  name: string
  icon: string
  createdAt: string
  children: string | React.ReactNode
}

export type ActivityEventProps = Props

const ActivityEvent: React.FC<ActivityEventProps> = ({
  name,
  icon,
  createdAt,
  children,
}) => {
  const theme = useTheme()

  return (
    <>
      <li className="activity-event">
        <Avatar
          className="activity-event__avatar"
          src={getIconPath(icon)}
          alt={name}
        />
        <Text className="activity-event__message">{children}</Text>
        <Text className="activity-event__created-at">{timeAgo(createdAt)}</Text>
      </li>
      <style jsx>{`
        .activity-event {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          padding: ${theme.layout.gapHalf} 0;
          margin-left: -1rem;
        }
        .activity-event:before {
          color: ${theme.palette.border};
        }
        .activity-event :global(.activity-event__avatar) {
          width: 2rem;
          height: 2rem;
          margin-right: ${theme.layout.gapHalf};
        }
        .activity-event :global(.activity-event__message) {
          flex: 1;
          margin: 0;
        }
        .activity-event :global(.activity-event__created-at) {
          color: ${theme.palette.accents_4};
          margin: 0 0 0 auto;
          padding-left: ${theme.layout.gapHalf};
          text-align: right;
        }
      `}</style>
    </>
  )
}

export default ActivityEvent
