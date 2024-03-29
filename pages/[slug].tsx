import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Text, Grid, Display, Dot, useTheme, Tag, useMediaQuery, Link } from '@geist-ui/core'
import useSWR, { SWRConfig } from 'swr'
import type { SWRConfiguration } from 'swr'
import { AppItem, PackageItem } from 'lib/interfaces'
import Layout from 'components/layout'
import { bytesStr, formatDate } from 'lib/utils'
import QRCode from 'components/qrcode'
import NoItem from 'components/no-item'
import MaskLoading from 'components/mask-loading'
import { baseUrl, staticPath } from 'lib/contants'
import DeviceType from 'components/device-type'
import useTranslation from 'next-translate/useTranslation'

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
  const { t } = useTranslation('common')

  const isMobile = useMediaQuery('xs', { match: 'down' })
  const { pid, slug } = router.query as { pid: string; slug: string }
  const pathname = router.pathname
  const { data: { app, packages = [] }, error, isValidating } = useSWR<AppAndPackages>(`/api/app/${slug}?deviceType=${deviceType}`)

  const handleClick = (pid: number) => {
    router.push({
      pathname,
      query: { slug, pid }
    })
  }

  const currentPackage = packages.find(p => p.id === +pid)

  const downloadUrl = app.deviceType === 'ios' ? `itms-services://?action=download-manifest&url=${baseUrl}/api/app/plist/${pid}` : currentPackage ? `${staticPath}${currentPackage.file}` : ''

  return (
    <Layout title={app.name}>
      <div className="page__appget">
        <Grid.Container gap={2} marginTop={1} justify="flex-start">
          <Grid xs={24} md={12} direction="column" alignItems="center">
            <Text h3>{app.name} <Tag><DeviceType size={14} type={app.deviceType} /></Tag></Text>
            <div className="download-area">
              {downloadUrl && <Link block href={downloadUrl} download>Download</Link>}
            </div>
            <Display shadow caption={t('Scan the QR code with your mobile device.')}>
              {!downloadUrl && <MaskLoading loading={true} />}
              {downloadUrl && <QRCode value={downloadUrl} logoImage={`${staticPath}${app.icon}`} />}
            </Display>
          </Grid>
          <Grid xs={24} md={12} direction="column">
            <Text h5>{t('Package list')}:</Text>
            <MaskLoading loading={isValidating}>
              <div className="page__appget__packages">
              {
                packages && packages.map(item => {
                  return (
                    <Dot key={item.id} type={Number(pid) === item.id ? 'success' : 'default' } onClick={() => handleClick(item.id)}>{item.name} {item.version}({item.buildVersion}), {bytesStr(item.size)}, {formatDate(item.createdAt)}</Dot>
                  )
                })
              }
              </div>
            </MaskLoading>
            {
              (!packages || packages.length === 0) && (
                <NoItem message={t('Nothing to see here.')} />
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
          :global(#react-qrcode-logo) {
            display: block;
          }
          .download-area {
            display: none;
          }
          @media (max-width: ${theme.breakpoints.xs.max}) {
            .download-area {
              display: block;
            }
          }
        `}</style>
      </div>
    </Layout>
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
  console.log(deviceType, slug)
  const res = await fetch(`${baseUrl}/api/app/${slug}?deviceType=${deviceType}`, {
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
