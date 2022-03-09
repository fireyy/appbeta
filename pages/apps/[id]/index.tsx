import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useTheme, Table, Button, Modal, useModal, Textarea, useInput, Radio } from '@geist-ui/core'
import Edit from '@geist-ui/icons/edit'
import Trash2 from '@geist-ui/icons/trash2'
import Checkbox from '@geist-ui/icons/checkbox'
import CheckboxFill from '@geist-ui/icons/checkboxFill'
import { AppItem, PackageItem } from 'interfaces'
import ProjectInfo from 'components/project-info'
import NoItem from 'components/no-item'
import Title from 'components/title'
import PopConfirm, { usePopConfirm } from 'components/pop-confirm'
import NavLink from 'components/nav-link'
import { bytesStr } from 'lib/utils'

type Props = {
  data: AppItem
}

const AppPage: React.FC<Props> = ({ data }) => {
  const theme = useTheme()
  const [packages, setPackages] = useState<PackageItem[]>([])
  const { bindings } = usePopConfirm()
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(0)
  const { setVisible: setEditVisible, bindings: editBindings } = useModal()
  const {state: changelog, setState: setChangelog, bindings: changelogBindings} = useInput('')
  const [current, setCurrent] = useState(data.lastPkgId)

  const fetchPackages = async () => {
    const res = await fetch(`http://localhost:3000/api/apps/${data.id}/packages`)
    const result = await res.json()
    setPackages(result)
  }

  const saveEdit = async (e): Promise<void> => {
    setLoading(true)
    await fetch(`http://localhost:3000/api/apps/${data.id}/packages/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changelog
      })
    })
    setEditVisible(false)
    setLoading(false)
    await fetchPackages()
  }

  const setEditIdAndVisible = (id: number, row: PackageItem) => {
    setEditId(id)
    setChangelog(row.changelog || '')
    setEditVisible(true)
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleDelete = async (pid: number) => {
    await fetch(`http://localhost:3000/api/apps/${data.id}/packages/${pid}`, {
      method: 'DELETE',
    })
    fetchPackages()
  }

  const handleCheck = async (row: PackageItem) => {
    setLoading(true)
    await fetch(`http://localhost:3000/api/apps/${data.id}`, {
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

  const renderCurrent = (icon: string, row: PackageItem) => {
    return (
      <Button type="abort" iconRight={current === row.id ? <CheckboxFill size={14} /> : <Checkbox size={14} />} auto loading={loading} onClick={() => handleCheck(row)} />
    )
  }

  const renderAction = (id: number, row: PackageItem) => {
    return (
      <>
        <Button type="abort" iconRight={<Edit size={14} />} auto scale={2/3} px={0.5} onClick={() => setEditIdAndVisible(id, row)} />
        <PopConfirm onConfirm={() => handleDelete(id)} {...bindings}>
          <Button type="abort" iconRight={<Trash2 size={14} />} auto scale={2/3} px={0.5} />
        </PopConfirm>
      </>
    )
  }

  return (
    <>
      <Title value={data.name} />
      <NavLink>{data.name}</NavLink>
      <ProjectInfo data={data} />
      <div className="page__wrapper">
        <div className="page__content">
          <Table data={packages}>
            <Table.Column prop="icon" label="current" render={renderCurrent} />
            <Table.Column prop="name" label="name" />
            <Table.Column prop="version" label="version" />
            <Table.Column prop="buildVersion" label="buildVersion" />
            <Table.Column prop="size" label="size" render={(size) => (<>{bytesStr(size)}</>)} />
            <Table.Column prop="updatedAt" label="updatedAt" />
            <Table.Column prop="id" label="action" render={renderAction} />
          </Table>
          <Modal {...editBindings}>
            <Modal.Title>Edit Changelog</Modal.Title>
            <Modal.Content>
              <Textarea placeholder="Text" width="100%" height="100%" {...changelogBindings} />
            </Modal.Content>
            <Modal.Action passive onClick={() => setEditVisible(false)}>Cancel</Modal.Action>
            <Modal.Action loading={loading} onClick={saveEdit}>OK</Modal.Action>
          </Modal>
          {
            (!packages || packages.length === 0) && (
              <NoItem link={`/apps/${data.id}/packages/new`} />
            )
          }
        </div>
      </div>
      <style jsx>{`
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
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
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
