import React, { useEffect, useState, useRef } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import Script from 'next/script'
import { Input, Button, Text, Grid, Textarea, Display, Code, useInput, Avatar, useToasts } from '@geist-ui/core'
import Upload from '@geist-ui/icons/upload'
import { AppItem, PackageItem, AppInfo } from 'lib/interfaces'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import { baseUrl, staticPath } from 'lib/contants'
import parseApp from 'lib/parse-app'
import base64ToFile from 'lib/base64-file'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  app: AppItem
}

const PackageNewPage: React.FC<Props> = ({ app }) => {
  const [data, setData] = useState<PackageItem>(null)
  const [file, setFile] = useState(null)
  const {state: desc, setState: setDesc, bindings: descBindings} = useInput('')
  const [loading, setLoading] = useState(false)
  const hiddenFileInput = useRef(null)
  const { setToast } = useToasts()
  const { t } = useTranslation('common')

  const handleFile= async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      setFile(i)
      const result: any = await parseApp(i)
      event.target.value = ''
      setData(result)
    }
  }

  const handleSetAsCover = async () => {
    setLoading(true)
    const formData = new FormData()
    const base64Data = data.icon.replace(/^data:image\/png;base64,/, '')
    formData.append('file', base64ToFile(base64Data, app.slug + '.png', 'image/png'))
    const res = await fetch('/api/upload', {
      method: 'PUT',
      body: formData
    })
    const result = await res.json()
    setData({
      ...data,
      icon: result.name
    })
    await fetch(`/api/apps/${app.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        icon: result.name
      }),
    })
    setToast({
      text: t('Updated app icon successfully.'),
      type: 'success',
    })
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'PUT',
      body: formData
    })
    const result = await res.json()
    data.file = result.name
    data.size = result.size
    if(desc) data.changelog = desc
    await fetch(`/api/apps/${app.id}/packages`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setToast({
      text: t('Added new package successfully.'),
      type: 'success',
    })
    await Router.push(`/apps/${app.id}`)
  }

  return (
    <Layout title={t('New')}>
      <Script src="https://cdn.jsdelivr.net/npm/app-info-parser@1.1.3/dist/app-info-parser.min.js" />
      <NavLink href={`/apps/${app.id}`} parent={app.name}>{t('New')}</NavLink>
      <Grid.Container gap={2} justify="center" alignItems="center">
        <Grid xs={24} md={12}>
          <Display caption={t('upload ext file', {
            ext: app.deviceType === 'ios' ? '.ipa' : '.apk'
          })}>
            {
              data && data.icon && (
                <Grid.Container gap={2} justify="center" alignItems="center">
                  <Grid xs={12}>
                    <Avatar src={data.icon.includes('data:image/png;base64') ? data.icon : `${staticPath}${data.icon}`} width="100px" height="100px" alt="name" isSquare />
                  </Grid>
                  <Grid xs={12} direction="column" alignItems="flex-start">
                    <Button auto scale={1/4} onClick={handleSetAsCover} loading={loading}>{t('Set As Cover')}</Button>
                    <Button auto scale={1/4} onClick={() => setData(null)} mt={0.5}>{t('Reset File')}</Button>
                  </Grid>
                </Grid.Container>
              )
            }
            {
              !data && (
                <>
                  <input type="file" ref={hiddenFileInput} onChange={handleFile} accept={app.deviceType === 'ios' ? '.ipa' : 'application/vnd.android.package-archive'} style={{ display: 'none' }} />
                  <Button auto icon={<Upload />} onClick={() => hiddenFileInput.current.click()}>{t('Select File')}</Button>
                </>
              )
            }
          </Display>
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>{t('Data')}:</Text>
          <Code block my={0} height="210px">
            {JSON.stringify(data, null, 2)}
          </Code>
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>{t('Changelog')}:</Text>
          <Textarea placeholder="Text" width="100%" height="100%" {...descBindings} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>{t('Submit')}</Button>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

// TODO: 改用client端请求数据
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
