import React from 'react'
import NextLink from 'next/link'
import Router from 'next/router'
import { Avatar, Button, Tag, Text, useTheme, Modal, useModal } from '@geist-ui/core'
import Edit from '@geist-ui/icons/edit'
import Trash2 from '@geist-ui/icons/trash2'
import { AppItem } from 'interfaces'
import { getIconPath } from 'lib/utils'
import DeviceType from 'components/device-type'

interface Props {
  data: AppItem
}

export type HeadingProps = Props;

async function destroy(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/apps/${id}`, {
    method: 'DELETE',
  })
  await Router.push('/')
}

const ProjectInfo: React.FC<HeadingProps> = ({ data }) => {
  const theme = useTheme()
  const { visible, setVisible, bindings } = useModal()

  return (
    <>
      <div className="heading__wrapper">
        <div className="heading">
          <Avatar alt={data?.name} className="heading__user-avatar" src={getIconPath(data?.icon)} isSquare />
          <div className="heading__name">
            <div className="heading__title">
              <Text h2 className="headding__user-name">
                {data?.name}
              </Text>
              <Tag className="headding__user-role"><DeviceType size={14} type={data.deviceType} /></Tag>

              <div className="heading__actions">
                <NextLink href={`/apps/${data.id}/packages/new`}>
                  <Button type="secondary" auto scale={2/3}>
                    Add Packages
                  </Button>
                </NextLink>
                <NextLink href={`/apps/new?id=${data.id}`}>
                  <Button iconRight={<Edit />} auto scale={2/3} px={0.6} ml={1} />
                </NextLink>
                <Button type="error" iconRight={<Trash2 />} auto scale={2/3} px={0.6} ml={1} onClick={() => setVisible(true)} />
                <Modal {...bindings}>
                  <Modal.Content>
                    <p>Are you sure you want to delete this item?</p>
                  </Modal.Content>
                  <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
                  <Modal.Action onClick={() => destroy(data.id)}>OK</Modal.Action>
                </Modal>
              </div>
            </div>

            {data?.description && (
              <div className="heading__integration">
                <Text className="heading__integration-title">Description:</Text>
                <div className="heading__integration-inner">
                  <span>{data.description}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .heading__wrapper {
        }
        .heading {
          display: flex;
          flex-direction: row;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
        .heading :global(.heading__user-avatar) {
          height: 100px;
          width: 100px;
          margin-right: ${theme.layout.gap};
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
          flex-direction: row;
          align-items: center;
        }
        .heading__integration-inner :global(svg) {
          margin-right: ${theme.layout.gapQuarter};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .heading :global(.heading__user-avatar) {
            width: 80px !important;
            height: 80px !important;
          }
          .heading__name :global(.headding__user-name) {
            font-size: 1.5rem;
          }
          .heading__actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectInfo
