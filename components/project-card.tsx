import React from 'react'
import {
  Avatar,
  Text,
  Card,
  Link,
  useTheme,
} from '@geist-ui/core'
import ExternalLink from '@geist-ui/icons/externalLink'
import Router from 'next/router'
import { AppItem } from 'lib/interfaces'
import { timeAgo, bytesStr } from 'lib/utils'
import { staticPath } from 'lib/contants'
import DeviceType from 'components/device-type'
import Skeleton from 'components/skeleton'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  isLoading: boolean
  data: AppItem
}

const ProjectCard: React.FC<Props> = ({
  isLoading = false,
  data
}) => {
  const theme = useTheme()
  const { t } =  useTranslation('common')

  return (
    <>
      <div className="project__wrapper">
        <Card className="project__card" onClick={() => Router.push(`/apps/${data.id}`)}>
          <div className="project-title__wrapper">
            {
              isLoading ? <Skeleton height={40} width={40} /> :
              <Avatar
                src={`${staticPath}${data.icon}`}
                height={1.5}
                width={1.5}
                isSquare
                className="project-icon"
              />
            }
            <div className="project-title__content">
              {
                isLoading ? (
                  <>
                    <Skeleton width={150} boxHeight={24} />
                    <Skeleton width={100} />
                  </>
                ) : (
                  <>
                    <Text
                      margin={0}
                      style={{ fontWeight: 500, lineHeight: '1.5rem' }}
                    >
                      {data.name} <DeviceType size={12} type={data.deviceType} />
                    </Text>
                    <Text
                      margin={0}
                      font="0.8rem"
                      style={{
                        color: theme.palette.accents_6,
                        lineHeight: '1.25rem',
                      }}
                    >
                      {t('Version')}: {data.lastVersion || '-'}, {t('Size')}: {bytesStr(data.lastPkgSize || 0)}
                    </Text>
                  </>
                )
              }
            </div>
          </div>
          <div className="project-description">
            {
              isLoading ? (
                <>
                  <Skeleton width={270} boxHeight={24} />
                  <Skeleton width={250} />
                </>
              ) : (
                <Text
                  margin={0}
                  style={{ color: theme.palette.accents_6, fontWeight: 500 }}
                >
                  {data.description}
                </Text>
              )
            }
          </div>
          {
            isLoading ? <Skeleton width={200} /> : <Text
            marginBottom={0}
            font="0.8rem"
            style={{ color: theme.palette.accents_5 }}
          >
            <span style={{ float: 'right' }}>{t('Update at ago', {
              ago: timeAgo(data.updatedAt)
            })}</span>
            {t('Packages')}: {data.packagesCount}
          </Text>
          }
          <Link className="external-link" href={`/app/${data.slug}?pid=${data.lastPkgId}`} target="_blank">
            <ExternalLink size={16} />
          </Link>
        </Card>
      </div>
      <style jsx>{`
        .project__wrapper {
          width: 100%;
        }
        .project__wrapper :global(.project__card) {
          cursor: pointer;
          position: relative;
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
          flex: 1;
          margin-left: ${theme.layout.gapHalf};
        }
        :global(.project__card .external-link) {
          position: absolute;
          right: 0;
          top: 0;
          opacity: 0;
          pointer-events: none;
          transform: translate(25%,-25%);
          display: block;
          width: 32px;
          height: 32px;
          text-align: center;
          border-radius: 100%;
          color: ${theme.palette.background};
          background-color: ${theme.palette.foreground};
          border: 1px solid ${theme.palette.foreground};
          transition: .15s ease;
          transition-property: opacity,transform;
        }
        :global(.project__card .external-link svg) {
          vertical-align: middle;
        }
        :global(.project__card .external-link:hover) {
          color: ${theme.palette.foreground};
          background-color: ${theme.palette.background};
        }
        :global(.project__card:hover .external-link) {
          opacity: 1;
          pointer-events: unset;
          transform: translate(25%,-40%);
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
