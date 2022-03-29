import React, { useState } from 'react'
import { useTheme, Loading, Modal, useModal, Textarea, useInput, useToasts, Card, Grid, Text, Popover } from '@geist-ui/core'
import useSWR from 'swr'
import MoreVertical from '@geist-ui/icons/moreVertical'
import { PackageItem } from 'lib/interfaces'
import { bytesStr, formatDate, timeAgo } from 'lib/utils'
import MaskLoading from 'components/mask-loading'
import NoItem from 'components/no-item'
import PopConfirm, { usePopConfirm } from 'components/pop-confirm'

type Props = {
  slug: string
  appId: number
  lastPkgId: number
}

const PackageItems: React.FC<Props> = ({ slug, appId, lastPkgId }) => {
  const theme = useTheme()
  const [editId, setEditId] = useState(0)
  const { bindings } = usePopConfirm()
  const { setVisible: setEditVisible, bindings: editBindings } = useModal()
  const {state: changelog, setState: setChangelog, bindings: changelogBindings} = useInput('')
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(lastPkgId)

  const { data: packages = [], isValidating, mutate } = useSWR<PackageItem[]>(appId && `/api/apps/${appId}/packages`)

  const setEditIdAndVisible = (id: number, row: PackageItem) => {
    setEditId(id)
    setChangelog(row.changelog || '')
    setEditVisible(true)
  }
  const handleDelete = async (pid: number) => {
    mutate(packages.filter((item) => item.id !== pid))
    await fetch(`/api/apps/${appId}/packages/${pid}`, {
      method: 'DELETE',
    })
    setToast({
      text: 'Removed package successfully.',
      type: 'success',
    })
  }
  const saveEdit = async (e): Promise<void> => {
    setLoading(true)
    await fetch(`/api/apps/${appId}/packages/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changelog
      })
    })
    setEditVisible(false)
    setLoading(false)
    mutate((mate) => {
      const index = mate.findIndex((item) => item.id === editId)
      mate[index].changelog = changelog
      return mate
    })
    setToast({
      text: 'Updated package changelog successfully.',
      type: 'success',
    })
  }
  const handleCheck = async (row: PackageItem) => {
    setLoading(true)
    await fetch(`/api/apps/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastPkgId: row.id,
        lastPkgSize: row.size,
        lastVersion: row.version,
      })
    })
    setCurrent(row.id)
    setLoading(false)
  }

  const renderAction = (id: number, row: PackageItem) => {
    return (
      <>
        <Popover placement="bottomEnd" portalClassName="drop-menu-box" content={(
          <>
            {
              current !== id && <Popover.Item onClick={() => handleCheck(row)}>
                {loading ? <Loading /> : 'Set Default'}
              </Popover.Item>
            }
            <Popover.Item onClick={() => window.open(`/${slug}?pid=${id}`)}>
              Preview
            </Popover.Item>
            <Popover.Item onClick={() => setEditIdAndVisible(id, row)}>
              Edit
            </Popover.Item>
            <Popover.Item disableAutoClose>
              <PopConfirm onConfirm={() => handleDelete(id)} {...bindings}>
                Delete
              </PopConfirm>
            </Popover.Item>
          </>
        )}>
          <MoreVertical />
        </Popover>
      </>
    )
  }

  return (
    <>
      <MaskLoading loading={isValidating && packages.length === 0}>
        <div className="card-box">
          {
            packages.map(p => (
              <Card key={p.id}>
                <Grid.Container gap={2} alignItems="center">
                  <Grid xs={12} direction="column">
                    <Text h6 my={0}>{p.name} {p.version}({p.buildVersion})</Text>
                    <Text span font="14px">{bytesStr(p.size)}</Text>
                  </Grid>
                  <Grid xs={12} justify="flex-end">
                    <Text span font="14px" mr={0.5}>{timeAgo(p.updatedAt)}</Text>
                    {renderAction(p.id, p)}
                  </Grid>
                </Grid.Container>
              </Card>
            ))
          }
        </div>
      </MaskLoading>
      <Modal {...editBindings}>
        <Modal.Title>Edit Changelog</Modal.Title>
        <Modal.Content>
          <Textarea placeholder="Text" width="100%" height="100%" {...changelogBindings} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setEditVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={saveEdit}>OK</Modal.Action>
      </Modal>
      {
        packages.length === 0 && !isValidating && (
          <NoItem link={`/apps/${appId}/packages/new`} />
        )
      }
      <style jsx>{`
        .card-box :global(.card) {
          border-radius: 0;
        }
        .card-box :global(.card + .card) {
          border-top: 0;
        }
        .card-box :global(.card:first-child) {
          border-radius: 6px 6px 0 0;
        }
        .card-box :global(.card:last-child) {
          border-radius: 0 0 6px 6px;
        }
        :global(.drop-menu-box .item:hover) {
          background-color: ${theme.palette.accents_2};
        }
        :global(.drop-menu-box .item.disabled) {
          cursor: not-allowed;
          color: ${theme.palette.accents_1};
        }
        :global(.drop-menu-box .item .tooltip) {
          display: block;
          flex: 1;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default PackageItems
