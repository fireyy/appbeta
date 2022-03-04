import React from 'react'
import {
  Avatar,
  Text,
  Card,
  useTheme,
  Badge,
} from '@geist-ui/core'
import Router from 'next/router'
import { AppItem } from '../interfaces'
import { timeAgo } from '../lib/utils'

interface Props {
  data: AppItem
}

const ProjectCard: React.FC<Props> = ({
  data
}) => {
  const theme = useTheme()

  return (
    <>
      <div className="project__wrapper">
        <Card className="project__card" onClick={() => Router.push(`/apps/${data.id}`)}>
          <div className="project-title__wrapper">
            <Avatar
              src={data.icon}
              height={1.25}
              width={1.25}
              marginRight={0.75}
              className="project-icon"
            />
            <div className="project-title__content">
              <Text
                margin={0}
                style={{ fontWeight: 500, lineHeight: '1.5rem' }}
              >
                {data.name} <Badge scale={0.5}>{data.deviceType}</Badge>
              </Text>
              <Text
                margin={0}
                font="0.875rem"
                style={{
                  color: theme.palette.accents_6,
                  lineHeight: '1.25rem',
                }}
              >
                {data.slug}
              </Text>
            </div>
          </div>
          {data.description && (
            <div className="project-description">
              <Text
                margin={0}
                style={{ color: theme.palette.accents_6, fontWeight: 500 }}
              >
                {data.description}
              </Text>
            </div>
          )}
          <Text
            marginBottom={0}
            font="0.875rem"
            style={{ color: theme.palette.accents_5 }}
          >
            {timeAgo(data.updatedAt)}
          </Text>
        </Card>
      </div>
      <style jsx>{`
        .project__wrapper {
          width: 100%;
        }
        .project__wrapper :global(.project__card) {
          cursor: pointer;
        }
        .project__wrapper :global(.project__card):hover {
          border-color: ${theme.palette.foreground};
        }
        .project-title__wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .project-title__wrapper :global(.project-icon) {
          background: #fff;
          border-radius: 50%;
          border: ${theme.type === 'dark'
            ? `1px solid ${theme.palette.foreground}`
            : 'none'};
        }
        .project-description {
          min-height: 3rem;
          margin: 1rem 0;
          font-size: 0.875rem;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </>
  )
}

export default ProjectCard
