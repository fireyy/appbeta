import React from 'react'
import {
  Avatar,
  Text,
  Card,
  useTheme,
  Badge,
} from '@geist-ui/core'
import Router from 'next/router'
import { AppItem } from 'lib/interfaces'
import { timeAgo, bytesStr } from 'lib/utils'
import { staticPath } from 'lib/contants'
import DeviceType from 'components/device-type'

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
            <Badge.Anchor placement="bottomRight">
              <Badge scale={0.5}>{data.packagesCount}</Badge>
              <Avatar
                src={`${staticPath}${data.icon}`}
                height={1.5}
                width={1.5}
                isSquare
                className="project-icon"
              />
            </Badge.Anchor>
            <div className="project-title__content">
              <Text
                margin={0}
                style={{ fontWeight: 500, lineHeight: '1.5rem' }}
              >
                {data.name} <DeviceType size={12} type={data.deviceType} />
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
            font="12px"
            style={{ color: theme.palette.accents_5 }}
          >
            Version: {data.lastVersion || '-'}, {bytesStr(data.lastPkgSize || 0)}, {timeAgo(data.updatedAt)} ago.
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
        .project-title__content {
          margin-left: ${theme.layout.gap};
        }
        .project-title__wrapper :global(.project-icon) {
          background: ${theme.palette.accents_2};
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
