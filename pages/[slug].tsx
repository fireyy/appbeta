import React, { useEffect, useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import Router, { useRouter } from 'next/router'
import { Text, Image, Grid, Display, Dot, useTheme } from '@geist-ui/core'
import { AppItem, PackageItem } from 'interfaces'
import Title from 'components/title'
import { getIconPath, getPkgPath, getItmsServices } from 'lib/utils'
import QRCode from 'components/qrcode'
import NoItem from 'components/no-item'
import bytesUtil from 'bytes-util'

type Props = {
  data: AppItem
}

const AppGetPage: NextPage<Props> = ({ data }) => {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const router = useRouter()
  const theme = useTheme()

  const { pid, slug } = router.query as { pid: string; slug: string }
  const pathname = router.pathname

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await fetch(`http://localhost:3000/api/apps/${data.id}/packages`)
      const result = await res.json()
      setPackages(result)
    }
    fetchPackages()
  }, [])

  const handleClick = (pid: number) => {
    router.push({
      pathname,
      query: { slug, pid }
    })
  }

  const downloadUrl = data.deviceType === 'ios' ? getItmsServices(pid) : getPkgPath(packages.find(item => item.id === +pid)?.file)

  return (
    <div className="page__appget">
      <Title value={data.name} />
      <Grid.Container gap={2} marginTop={1} justify="flex-start">
        <Grid xs={24} md={12} direction="column" alignItems="center">
          <Text h3>{data.name}</Text>
          <Display shadow caption="Scan the QR code with your mobile device.">
            <QRCode value={downloadUrl} logoImage={getIconPath(data.icon)} />
          </Display>
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h5>Packages:</Text>
          <div className="page__appget__packages">
          {
            packages && packages.map(item => {
              return (
                <Dot type={Number(pid) === item.id ? 'success' : 'default' } onClick={() => handleClick(item.id)}>{item.name} {item.version}({item.buildVersion}), {bytesUtil.stringify(item.size)}, {item.createdAt}</Dot>
              )
            })
          }
          </div>
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
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isIOS = context.req.headers['user-agent'].match(/iPhone|iPad|iPod/i)
  const deviceType = isIOS ? 'ios' : 'android'
  const slug = context.params.slug
  const res = await fetch(`http://localhost:3000/api/app/${slug}`, {
    method: 'GET',
    headers: {
      'xdevice': deviceType
    }
  })
  const data = await res.json()

  if (!data.name) {
    return {
      notFound: true,
    }
  }

  return { props: { data } }
}

export default AppGetPage
