import React, { useState } from 'react'
import { Loading, Modal, useModal, Textarea, useInput, useToasts, Card, Grid, Text } from '@geist-ui/core'
import useSWR from 'swr'
import MoreVertical from '@geist-ui/icons/moreVertical'
import { PackageItem } from 'lib/interfaces'
import { bytesStr, timeAgo } from 'lib/utils'
import { Dropdown, DropdownItem } from 'components/dropdown'
import NoItem from 'components/no-item'

type Props = {
  slug: string
  appId: number
  lastPkgId: number
}

const PackageItems: React.FC<Props> = ({ slug, appId, lastPkgId }) => {
  const [editId, setEditId] = useState(0)
  const [action, setAction] = useState('edit')
  const { setVisible: setEditVisible, bindings: editBindings } = useModal()
  const {state: changelog, setState: setChangelog, bindings: changelogBindings} = useInput('')
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(lastPkgId)

  const { data: packages = [], isValidating, mutate } = useSWR<PackageItem[]>(appId && `/api/apps/${appId}/packages`)

  const setIdAndVisible = (id: number, row: PackageItem, type = 'edit') => {
    setEditId(id)
    type === 'edit' && setChangelog(row.changelog || '')
    setAction(type)
    setEditVisible(true)
  }
  const handleDelete = async () => {
    mutate(packages.filter((item) => item.id !== editId))
    await fetch(`/api/apps/${appId}/packages/${editId}`, {
      method: 'DELETE',
    })
    setToast({
      text: 'Removed package successfully.',
      type: 'success',
    })
  }
  const saveEdit = async (): Promise<void> => {
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
        <Dropdown content={(
          <>
            {
              current !== id && <DropdownItem onClick={() => handleCheck(row)}>
                {loading ? <Loading /> : 'Set Default'}
              </DropdownItem>
            }
            <DropdownItem onClick={() => window.open(`/${slug}?pid=${id}`)}>
              Preview
            </DropdownItem>
            <DropdownItem onClick={() => setIdAndVisible(id, row)}>
              Edit
            </DropdownItem>
            <DropdownItem onClick={() => setIdAndVisible(id, row, 'delete')}>
              Delete
            </DropdownItem>
          </>
        )}>
          <MoreVertical />
        </Dropdown>
      </>
    )
  }

  return (
    <>
      <div className="card-box">
        {
          packages.map(p => (
            <Card key={p.id}>
              <Grid.Container gap={2} alignItems="center">
                <Grid xs={12} direction="column">
                  <Text h6 my={0}>{p.name} {p.version}({p.buildVersion})</Text>
                  <Text span font="14px" style={{ color: 'var(--body-color)' }}>{bytesStr(p.size)}</Text>
                </Grid>
                <Grid xs={12} justify="flex-end">
                  <Text span font="14px" mr={0.5} style={{ color: 'var(--body-color)' }}>{timeAgo(p.updatedAt)}</Text>
                  {renderAction(p.id, p)}
                </Grid>
              </Grid.Container>
            </Card>
          ))
        }
      </div>
      <Modal {...editBindings}>
        <Modal.Title>{action === 'edit' ? 'Edit Changelog' : 'Confirm'}</Modal.Title>
        <Modal.Content>
          {
            action === 'edit' ? <Textarea placeholder="Text" width="100%" height="100%" {...changelogBindings} /> :
            'Are you sure you want to delete this item?'
          }
        </Modal.Content>
        <Modal.Action passive onClick={() => setEditVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={() => action === 'edit' ? saveEdit() : handleDelete()}>OK</Modal.Action>
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
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        .card-box :global(.card:last-child) {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      `}</style>
    </>
  )
}

export default PackageItems
