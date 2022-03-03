import React, { useEffect, useState, useRef } from 'react'
import Router, { useRouter } from 'next/router'
import { Input, Button, Text, Grid, Textarea, Display } from '@geist-ui/core'
import Upload from '@geist-ui/icons/upload'
import { PackageItem } from '../../../../interfaces'

const PackageNewPage: React.FC<unknown> = () => {
  const [data, setData] = useState<PackageItem>(null)
  const [loading, setLoading] = useState(false)
  const hiddenFileInput = useRef(null)

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleFile= async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      const formData = new FormData()
      formData.append('file', i)
      const res = await fetch('http://localhost:3000/api/upload', {
        method: 'PUT',
        body: formData
      })
      const result = res.json()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    await fetch('http://localhost:3000/api/apps', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await Router.push('/')
  }

  return (
    <>
      <Grid.Container gap={2} justify="center">
        <Grid xs={24}>
          <Display caption="Upload ipa or apk">
            <input type="file" ref={hiddenFileInput} onChange={handleFile} accept="*/*" style={{ display: 'none' }} />
            <Button auto icon={<Upload />} onClick={() => hiddenFileInput.current.click()}>Upload</Button>
          </Display>
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Name:</Text>
          <Input placeholder="Text" width="100%" name="name" onChange={handleChange} value={data?.name} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>File:</Text>
          <Input placeholder="Text" width="100%" name="file" onChange={handleChange} value={data?.file} />
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>Changelog:</Text>
          <Textarea placeholder="Text" width="100%" name="changelog" onChange={handleChange} value={data?.changelog} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>Submit</Button>
        </Grid>
      </Grid.Container>
    </>
  )
}

export default PackageNewPage
