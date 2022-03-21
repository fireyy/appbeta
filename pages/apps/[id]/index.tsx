import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTheme, Table, Button, Modal, useModal, Textarea, useInput, Link, useToasts } from '@geist-ui/core'
import useSWR from 'swr'
import Edit from '@geist-ui/icons/edit'
import Trash2 from '@geist-ui/icons/trash2'
import Checkbox from '@geist-ui/icons/checkbox'
import CheckboxFill from '@geist-ui/icons/checkboxFill'
import Download from '@geist-ui/icons/download'
import { AppItem, PackageItem } from 'lib/interfaces'
import ProjectInfo from 'components/project-info'
import NoItem from 'components/no-item'
import Title from 'components/title'
import PopConfirm, { usePopConfirm } from 'components/pop-confirm'
import NavLink from 'components/nav-link'
import { bytesStr } from 'lib/utils'
import MaskLoading from 'components/mask-loading'
import { baseUrl } from 'lib/contants'

type Props = {
  data: AppItem
}

const AppPage: React.FC<unknown> = () => {
  const theme = useTheme()
  const { bindings } = usePopConfirm()
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(0)
  const { setVisible: setEditVisible, bindings: editBindings } = useModal()
  const {state: changelog, setState: setChangelog, bindings: changelogBindings} = useInput('')
  const router = useRouter()
  const { setToast } = useToasts()

  const { data, isValidating: isLoading } = useSWR<AppItem>(`/api/apps/${router.query.id}`)

  const [current, setCurrent] = useState(data?.lastPkgId)

  const { data: packages = [], isValidating, mutate } = useSWR<PackageItem[]>(data?.id && `/api/apps/${data.id}/packages`)

  const saveEdit = async (e): Promise<void> => {
    setLoading(true)
    await fetch(`/api/apps/${data.id}/packages/${editId}`, {
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

  const setEditIdAndVisible = (id: number, row: PackageItem) => {
    setEditId(id)
    setChangelog(row.changelog || '')
    setEditVisible(true)
  }

  const handleDelete = async (pid: number) => {
    mutate(packages.filter((item) => item.id !== pid))
    await fetch(`/api/apps/${data.id}/packages/${pid}`, {
      method: 'DELETE',
    })
    setToast({
      text: 'Removed package successfully.',
      type: 'success',
    })
  }

  const handleCheck = async (row: PackageItem) => {
    setLoading(true)
    await fetch(`/api/apps/${data.id}`, {
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
        <Link href={`/${data.slug}?pid=${id}`} target="_blank" px={0.5}><Download size={14} /></Link>
        <Button type="abort" iconRight={<Edit size={14} />} auto scale={2/3} px={0.5} onClick={() => setEditIdAndVisible(id, row)} />
        <PopConfirm onConfirm={() => handleDelete(id)} {...bindings}>
          <Button type="abort" iconRight={<Trash2 size={14} />} auto scale={2/3} px={0.5} />
        </PopConfirm>
      </>
    )
  }

  return (
    <>
      <Title value={data?.name || ''} />
      <NavLink>{data?.name || ''}</NavLink>
      <ProjectInfo data={data} isLoading={isLoading && !data} />
      <div className="page__wrapper">
        <div className="page__content">
          <MaskLoading loading={isValidating && packages.length === 0}>
            <Table data={packages}>
              <Table.Column prop="icon" label="current" render={renderCurrent} />
              <Table.Column prop="version" label="version" render={(version, row: PackageItem) => (<>{version}({row.buildVersion})</>)} />
              <Table.Column prop="size" label="size" render={(size) => (<>{bytesStr(size)}</>)} />
              <Table.Column prop="updatedAt" label="updatedAt" />
              <Table.Column prop="id" label="action" render={renderAction} />
            </Table>
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
              <NoItem link={`/apps/${data?.id}/packages/new`} />
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
          overflow-x: auto;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .page__content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 0;
          }
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${baseUrl}/api/apps/${context.params.id}`, {
    headers: {
      'cookie': context.req.headers.cookie,
    }
  })
  const data = await res.json()
  return { props: { data } }
}

export default AppPage
