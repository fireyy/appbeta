import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import NextLink from 'next/link'
import { Link, useTheme, Table, Spacer } from '@geist-ui/core'
import Edit from '@geist-ui/icons/edit'
import Trash2 from '@geist-ui/icons/trash2'
import { AppItem, PackageItem } from 'interfaces'
import ProjectInfo from 'components/project-info'
import NoItem from 'components/no-item'
import Title from 'components/title'

async function save(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/apps/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

type Props = {
  data: AppItem
}

const AppPage: React.FC<Props> = ({ data }) => {
  const theme = useTheme()
  const [packages, setPackages] = useState<PackageItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/apps/${data.id}/packages`)
      const result = await res.json()
      setPackages(result)
    }
    fetchData()
  }, [])

  const renderAction = (id: number, row: PackageItem) => {
    return (
      <>
        <NextLink href={`/apps/${row.appId}/packages/new?id=${id}`}>
          <Link><Edit size={14} /></Link>
        </NextLink>
        <Spacer inline w={0.5} />
        <NextLink href={`/apps/${id}/packages/new`}>
          <Link><Trash2 size={14} /></Link>
        </NextLink>
      </>
    )
  }

  return (
    <>
      <Title value={data.name} />
      <ProjectInfo data={data} />
      <div className="page__wrapper">
        <div className="page__content">
          <Table data={packages}>
            <Table.Column prop="name" label="name" />
            <Table.Column prop="bundleId" label="bundleId" />
            <Table.Column prop="version" label="version" />
            <Table.Column prop="buildVersion" label="buildVersion" />
            <Table.Column prop="updatedAt" label="updatedAt" />
            <Table.Column prop="id" label="action" render={renderAction} />
          </Table>
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
