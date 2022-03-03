import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import NextLink from 'next/link'
import { Link, Table, useTheme, Spacer, Fieldset, Button, Text } from '@geist-ui/core'
import Edit from '@geist-ui/icons/edit'
import Trash2 from '@geist-ui/icons/trash2'
import { ChannelItem, PackageItem } from '../../../interfaces'

type Props = {
  data: ChannelItem
}

const AppPage: React.FC<Props> = ({ data }) => {
  const theme = useTheme()
  const [packages, setPackages] = useState<PackageItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/channels/${data.id}/packages`)
      const result = await res.json()
      setPackages(result)
    }
    fetchData()
  }, [])

  const renderAction = (id: number, row: ChannelItem) => {
    return (
      <>
        <NextLink href={`/apps/${row.appId}/channels/new?id=${id}`}>
          <Link><Edit size={14} /></Link>
        </NextLink>
        <Spacer inline w={0.5} />
        <NextLink href={`/apps/${id}/channels/new`}>
          <Link><Trash2 size={14} /></Link>
        </NextLink>
      </>
    )
  }

  return (
    <>
      <div className="page__wrapper">
        <div className="page__content">
          <Fieldset width="100%" mb={1}>
            <Fieldset.Title>{data.name} {data.deviceType}</Fieldset.Title>
            <Fieldset.Subtitle>{data.slug}</Fieldset.Subtitle>
            <Fieldset.Footer>
              <Text>{data.updatedAt}</Text>
              <NextLink href={`/channels/${data.id}/packages/new`} passHref>
                <Button type="secondary" auto scale={1/3} font="12px">New Package</Button>
              </NextLink>
            </Fieldset.Footer>
          </Fieldset>
          <Table data={packages}>
            <Table.Column prop="name" label="name" />
            <Table.Column prop="bundleId" label="bundleId" />
            <Table.Column prop="version" label="version" />
            <Table.Column prop="buildVersion" label="buildVersion" />
            <Table.Column prop="updatedAt" label="updatedAt" />
            <Table.Column prop="id" label="action" render={renderAction} />
          </Table>
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
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/channels/${context.params.id}`)
  const data = await res.json()
  return { props: { data } }
}

export default AppPage
