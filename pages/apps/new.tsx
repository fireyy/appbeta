import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Input, Button, Text, Grid, Textarea, Radio } from '@geist-ui/core'
import { AppItem } from 'interfaces'

const AppNewPage: React.FC<unknown> = () => {
  const [data, setData] = useState<AppItem>(null)
  const [deviceType, setDeviceType] = useState('ios')
  const [loading, setLoading] = useState(false)
  const { query: { id = 0 } } = useRouter()
  const isEdit = id !== 0

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleDeviceType = (val: string) => {
    setDeviceType(val)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/apps/${id}`)
      const result = await res.json()
      setData(result)
    }
    isEdit && fetchData()
  }, [id])

  const handleSubmit = async () => {
    setLoading(true)
    let url = isEdit ? `/${id}` : ''
    await fetch('http://localhost:3000/api/apps' + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await Router.push(isEdit ? `/apps/${id}` : '/')
  }

  return (
    <>
      <Grid.Container gap={2} justify="center">
        <Grid xs={24} md={12} direction="column">
          <Text h6>Name:</Text>
          <Input placeholder="Text" width="100%" name="name" onChange={handleChange} value={data?.name} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Slug:</Text>
          <Input placeholder="Text" width="100%" name="slug" onChange={handleChange} value={data?.slug} />
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>Device Type:</Text>
          <Radio.Group value={data?.deviceType} useRow onChange={handleDeviceType}>
            <Radio value="ios">
              iOS
              <Radio.Desc>For iPhone, iPad and iPod touch</Radio.Desc>
            </Radio>
            <Radio value="android">
              Android
              <Radio.Desc>For Android device</Radio.Desc>
            </Radio>
          </Radio.Group>
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>Description:</Text>
          <Textarea placeholder="Text" width="100%" name="description" onChange={handleChange} value={data?.description} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>Submit</Button>
        </Grid>
      </Grid.Container>
    </>
  )
}

export default AppNewPage
