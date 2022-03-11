import React, { useEffect, useState, useRef } from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import { Input, Button, Text, Grid, Textarea, Display, Code, useInput } from '@geist-ui/core'
import Upload from '@geist-ui/icons/upload'
import { AppItem, PackageItem } from 'lib/interfaces'
import Title from 'components/title'
import NavLink from 'components/nav-link'

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
      const formData = new FormData()
      formData.append('file', i)
      const res = await fetch('/api/upload', {
        method: 'PUT',
        body: formData
      })
      const result = await res.json()
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
      <NavLink href={`/apps/${app.id}`} parent={app.name}>New Package</NavLink>
      <Grid.Container gap={2} justify="center">
        <Grid xs={24}>
          <Display caption={`Upload ${app.deviceType === 'ios' ? '.ipa' : '.apk'} file`}>
            <input type="file" ref={hiddenFileInput} onChange={handleFile} accept={app.deviceType === 'ios' ? '.ipa' : 'application/vnd.android.package-archive'} style={{ display: 'none' }} />
            <Button auto icon={<Upload />} onClick={() => hiddenFileInput.current.click()}>Upload</Button>
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
  const res = await fetch(`http://localhost:3000/api/apps/${context.params.id}`, {
    headers: {
      'cookie': context.req.headers.cookie,
    }
  })
  const data = await res.json()
  return { props: { app: data } }
}

export default PackageNewPage
