import React from 'react'
import Router from 'next/router'
import { Avatar, Text, useTheme, Modal, useModal, Link, useToasts } from '@geist-ui/core'
import MoreVertical from '@geist-ui/icons/moreVertical'
import { AppItem } from 'lib/interfaces'
import { staticPath } from 'lib/contants'
import DeviceType from 'components/device-type'
import Skeleton from 'components/skeleton'
import { Dropdown, DropdownItem } from 'components/dropdown'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  isLoading: boolean
  data: AppItem
}

export type HeadingProps = Props

const ProjectInfo: React.FC<HeadingProps> = ({ isLoading = false, data }) => {
  const theme = useTheme()
  const { visible, setVisible, bindings } = useModal()
  const { setToast } = useToasts()
  const { t } = useTranslation('common')

  const destroy = async function (id: number): Promise<void> {
    await fetch(`/api/apps/${id}`, {
      method: 'DELETE',
    })
    setToast({
      text: 'Removed app successfully.',
      type: 'success',
    })
    await Router.push('/')
  }

  return (
    <>
      <div className="heading__wrapper">
        <div className="heading">
          <div className="heading__icon-avatar">
          {
            isLoading ? <Skeleton className="heading__avatar" height={40} width={40} /> : <>
            <Avatar alt={data?.name} className="heading__avatar" src={`${staticPath}${data?.icon}`} isSquare />
            <span className="tag"><DeviceType size={14} type={data?.deviceType} /></span>
          </>
          }
          </div>
          <div className="heading__name">
            <div className="heading__title">
              {
                isLoading ? <Skeleton width={350} height={26} boxHeight={37} /> : <Text h3 className="headding__user-name">
                <Link href={`/${data?.slug}?pid=${data?.lastPkgId || ''}`} target="_blank">{data?.name}</Link>
              </Text>
              }
              <div className="heading__actions">
                {
                  isLoading ? <Skeleton height={36} width={36} /> :
                  <Dropdown content={(
                    <>
                      <DropdownItem onClick={() => Router.push(`/apps/${data?.id}/packages/new`)}>
                        {t('New')}
                      </DropdownItem>
                      <DropdownItem onClick={() => Router.push(`/apps/new?id=${data?.id}`)}>
                        {t('Edit')}
                      </DropdownItem>
                      <DropdownItem onClick={() => setVisible(true)}>
                        {t('Delete')}
                      </DropdownItem>
                    </>
                  )}>
                    <MoreVertical />
                  </Dropdown>
                }
                <Modal {...bindings}>
                  <Modal.Content>
                    <p>{t('Are you sure you want to delete this item?')}</p>
                  </Modal.Content>
                  <Modal.Action passive onClick={() => setVisible(false)}>{t('Cancel')}</Modal.Action>
                  <Modal.Action onClick={() => destroy(data?.id)}>{t('OK')}</Modal.Action>
                </Modal>
              </div>
            </div>
            <div className="heading__integration">
              <Text className="heading__integration-title">{t('Description')}:</Text>
              <div className="heading__integration-inner">
                {
                  isLoading ? (
                    <>
                      <Skeleton boxHeight={24} />
                      <Skeleton boxHeight={24} />
                    </>
                  ) : (<span>{data?.description}</span>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .heading__wrapper {
        }
        .heading {
          display: flex;
          flex-direction: row;
          max-width: 100%;
          margin: 0 auto;
          padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
        .heading .heading__icon-avatar {
          position: relative;
        }
        .heading .heading__icon-avatar .tag {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0 6px;
          border-radius: 6px;
          color: ${theme.palette.background};
          background-color: ${theme.palette.foreground};
        }
        .heading :global(.heading__avatar) {
          height: 100px;
          width: 100px;
        }
        .heading__title {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex: 1;
        }
        .heading__name {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          margin-left: ${theme.layout.gap};
        }
        .heading__name :global(.headding__user-name) {
          line-height: 1;
        }
        .heading__name :global(.headding__user-role) {
          background: ${theme.palette.accents_1};
          border-color: ${theme.palette.accents_2};
          border-radius: 1rem;
          padding: 0.175rem 0.5rem;
          height: unset;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          margin-left: ${theme.layout.gapQuarter};
        }
        .heading__actions {
          margin-left: auto;
        }
        .heading__integration :global(.heading__integration-title) {
          color: ${theme.palette.accents_5} !important;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          margin: 0;
        }
        .heading__integration-inner {
          display: flex;
          flex-direction: column;
          align-items: left;
        }
        .heading__integration-inner :global(svg) {
          margin-right: ${theme.layout.gapQuarter};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .heading {
            padding: ${theme.layout.gap} 0;
          }
          .heading :global(.heading__avatar) {
            width: 80px !important;
            height: 80px !important;
          }
          .heading__name :global(.headding__user-name) {
            font-size: 1.5rem;
          }
          .heading__actions {
          }
        }
      `}</style>
    </>
  );
};

export default ProjectInfo
