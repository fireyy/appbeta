import React, { useEffect, useState, useRef } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import Script from 'next/script'
import { Input, Button, Text, Grid, Textarea, Display, Code, useInput, Avatar, Badge } from '@geist-ui/core'
import Upload from '@geist-ui/icons/upload'
import { AppItem, PackageItem, AppInfo } from 'lib/interfaces'
import Title from 'components/title'
import NavLink from 'components/nav-link'
import { baseUrl } from 'lib/contants'

function parseApp(path: string) {
  // dirty fix
  const parser = new (window as any).AppInfoParser(path)

  return new Promise((resolve, reject) => {
    parser.parse().then(result => {
      const info: AppInfo = {}
      if (result.CFBundleIdentifier) { // iOS
        // info.platform = 'ios'
        info.bundleId = result.CFBundleIdentifier
        // info.bundleName = result.CFBundleName
        info.name = result.CFBundleDisplayName
        info.buildVersion = result.CFBundleVersion
        info.version = result.CFBundleShortVersionString
        info.icon = result.icon
      } else if (result.package) { // Android
        let label

        if (result.application && result.application.label && result.application.label.length > 0) {
          label = Array.isArray(result.application.label) ? result.application.label[0] : result.application.label
        }

        if (label) {
            label = label.replace(/'/g, '')
        }
        const appName = (result['application-label'] || result['application-label-zh-CN'] || result['application-label-es-US'] ||
        result['application-label-zh_CN'] || result['application-label-es_US'] || label || 'unknown')

        // info.platform = 'android'
        info.bundleId = result.package
        // info.bundleName = result.package
        info.name = appName
        info.buildVersion = String(result.versionCode)
        info.version = result.versionName
        info.icon = result.icon
      }
      resolve(info)
    })
  })
}

type Props = {
  app: AppItem
}

const PackageNewPage: React.FC<Props> = ({ app }) => {
  const [data, setData] = useState<PackageItem>(null)
  const {state: desc, setState: setDesc, bindings: descBindings} = useInput('')
  const [loading, setLoading] = useState(false)
  const hiddenFileInput = useRef(null)

  const handleFile= async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      const result: any = await parseApp(i)
      // const formData = new FormData()
      // formData.append('file', i)
      // const res = await fetch('/api/upload', {
      //   method: 'PUT',
      //   body: formData
      // })
      // const result = await res.json()
      event.target.value = ''
      setData(result)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    if(desc) data.changelog = desc
    await fetch(`/api/apps/${app.id}/packages`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await Router.push(`/apps/${app.id}`)
  }

  return (
    <>
      <Title value="New Package" />
      <Script src="https://cdn.jsdelivr.net/npm/app-info-parser@1.1.3/dist/app-info-parser.min.js" />
      <NavLink href={`/apps/${app.id}`} parent={app.name}>New Package</NavLink>
      <Grid.Container gap={2} justify="center">
        <Grid xs={24}>
          <Display caption={`Upload ${app.deviceType === 'ios' ? '.ipa' : '.apk'} file`}>
            {
              data && data.icon && (
                <Badge.Anchor>
                  <Badge type="error" scale={0.5} onClick={() => setData(null)}>X</Badge>
                  <Avatar src={data.icon} width="86px" height="86px" alt="name" isSquare />
                </Badge.Anchor>
              )
            }
            {
              !data && (
                <>
                  <input type="file" ref={hiddenFileInput} onChange={handleFile} accept={app.deviceType === 'ios' ? '.ipa' : 'application/vnd.android.package-archive'} style={{ display: 'none' }} />
                  <Button auto icon={<Upload />} onClick={() => hiddenFileInput.current.click()}>Upload</Button>
                </>
              )
            }
          </Display>
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Changelog:</Text>
          <Textarea placeholder="Text" width="100%" height="100%" {...descBindings} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Data:</Text>
          <Code block my={0} height="210px">
            {JSON.stringify(data, null, 2)}
          </Code>
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>Submit</Button>
        </Grid>
      </Grid.Container>
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
  return { props: { app: data } }
}

export default PackageNewPage
