import React, { useState } from 'react'
import Router from 'next/router'
import { Input, Button, Text, Grid, Textarea } from '@geist-ui/core'
import { AppItem } from '../../interfaces'

const AppNewPage: React.FC<unknown> = () => {
  const [data, setData] = useState<AppItem>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
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
        <Grid xs={24} md={12} direction="column">
          <Text h6>Name:</Text>
          <Input placeholder="Text" width="100%" name="name" onChange={handleChange} value={data?.name} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Slug:</Text>
          <Input placeholder="Text" width="100%" name="slug" onChange={handleChange} value={data?.slug} />
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
