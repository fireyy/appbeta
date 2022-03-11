import React, { useEffect, useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import Router, { useRouter } from 'next/router'
import { Text, Image, Grid, Display, Dot, useTheme } from '@geist-ui/core'
import useSWR, { SWRConfig } from 'swr'
import type { SWRConfiguration } from 'swr'
import { AppItem, PackageItem } from 'lib/interfaces'
import Title from 'components/title'
import { getIconPath, getPkgPath, getItmsServices, bytesStr, getApkDownload } from 'lib/utils'
import QRCode from 'components/qrcode'
import NoItem from 'components/no-item'
import MaskLoading from 'components/mask-loading'

type AppAndPackages = {
  app: AppItem,
  packages: PackageItem[]
}

type AppDetailProps = {
  deviceType: string,
}

type AppGetPageProps = {
  fallback: SWRConfiguration,
  deviceType: string,
  isFront: boolean,
}

const AppDetail: React.FC<AppDetailProps> = ({ deviceType }) => {
  const router = useRouter()
  const theme = useTheme()

  const { pid, slug } = router.query as { pid: string; slug: string }
  const pathname = router.pathname
  const { data: { app, packages }, error, isValidating } = useSWR<AppAndPackages>(`/api/app/${slug}?deviceType=${deviceType}`)

  const handleClick = (pid: number) => {
    router.push({
      pathname,
      query: { slug, pid }
    })
  }

  const downloadUrl = app.deviceType === 'ios' ? getItmsServices(pid) : getApkDownload(pid)

  return (
    <div className="page__appget">
      <Title value={app.name} />
      <Grid.Container gap={2} marginTop={1} justify="flex-start">
        <Grid xs={24} md={12} direction="column" alignItems="center">
          <Text h3>{app.name}</Text>
          <Display shadow caption="Scan the QR code with your mobile device.">
            <QRCode value={downloadUrl} logoImage={getIconPath(app.icon)} />
          </Display>
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h5>Packages:</Text>
          <MaskLoading loading={isValidating}>
            <div className="page__appget__packages">
            {
              packages && packages.map(item => {
                return (
                  <Dot key={item.id} type={Number(pid) === item.id ? 'success' : 'default' } onClick={() => handleClick(item.id)}>{item.name} {item.version}({item.buildVersion}), {bytesStr(item.size)}, {item.createdAt}</Dot>
                )
              })
            }
            </div>
          </MaskLoading>
          {
            (!packages || packages.length === 0) && (
              <NoItem message="Nothing to see here." />
            )
          }
        </Grid>
      </Grid.Container>
      <style jsx>{`
        .page__appget {}
        .page__appget__packages :global(.dot) {
          cursor: pointer;
          padding: ${theme.layout.gapHalf};
        }
        .page__appget__packages :global(.dot:hover) {
          background-color: ${theme.palette.accents_2};
        }
        #react-qrcode-logo {
          display: block;
        }
      `}</style>
    </div>
  )
}

const AppGetPage: NextPage<AppGetPageProps> = ({ fallback, isFront, deviceType }) => {

  return (
    <SWRConfig value={{ fallback }}>
      <AppDetail deviceType={deviceType} />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isIOS = context.req.headers['user-agent'].match(/iPhone|iPad|iPod/i)
  const deviceType = isIOS ? 'ios' : 'android'
  const slug = context.params.slug
  const res = await fetch(`http://localhost:3000/api/app/${slug}?deviceType=${deviceType}`, {
    method: 'GET'
  })
  const data = await res.json()

  if (!data.app) {
    return {
      notFound: true,
    }
  }

  return { props: { fallback: { [`/api/app/${slug}?deviceType=${deviceType}`]: data }, deviceType, isFront: true } }
}

export default AppGetPage
