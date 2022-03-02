import React, { useCallback, useState } from 'react'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { Input, Button, Text, Grid, Radio } from '@geist-ui/core'
import { ChannelItem } from '../../../../interfaces'

type Props = {
  id: number
}

const AppNewPage: React.FC<Props> = ({ id }) => {
  const [data, setData] = useState<ChannelItem>(null)
  const [deviceType, setDeviceType] = useState('ios')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleDeviceType = (val: string) => {
    setDeviceType(val)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await fetch(`http://localhost:3000/api/apps/${id}/channels`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, deviceType: deviceType }),
    })
    await Router.push(`/apps/${id}`)
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
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>Submit</Button>
        </Grid>
      </Grid.Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: { id: params?.id },
  }
}

export default AppNewPage
