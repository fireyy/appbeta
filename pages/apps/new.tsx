import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Input, Button, Text, Grid, Textarea, Radio, useInput } from '@geist-ui/core'
import Title from 'components/title'
import NavLink from 'components/nav-link'

const AppNewPage: React.FC<unknown> = () => {
  const [deviceType, setDeviceType] = useState('ios')
  const { state: name, setState: setName, bindings: nameBindings } = useInput('')
  const { state: slug, setState: setSlug, bindings: slugBindings } = useInput('')
  const { state: desc, setState: setDesc, bindings: descBindings } = useInput('')
  const [loading, setLoading] = useState(false)
  const { query: { id = 0 } } = useRouter()
  const isEdit = id !== 0

  const handleDeviceType = (val: string) => {
    setDeviceType(val)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/apps/${id}`)
      const result = await res.json()
      setName(result.name)
      setSlug(result.slug)
      setDesc(result.description)
      setDeviceType(result.deviceType)
    }
    isEdit && fetchData()
  }, [id])

  const handleSubmit = async () => {
    setLoading(true)
    let url = isEdit ? `/${id}` : ''
    await fetch('http://localhost:3000/api/apps' + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        description: desc,
        deviceType,
      }),
    })
    await Router.push(isEdit ? `/apps/${id}` : '/')
  }

  return (
    <>
      <Title value="New App" />
      {
        isEdit ? <NavLink href={`/apps/${id}`} parent={name}>Edit</NavLink> : <NavLink>New App</NavLink>
      }
      <Grid.Container gap={4} justify="center">
        <Grid xs={24} md={12} direction="column">
          <Text h6>Name:</Text>
          <Input placeholder="Text" width="100%" {...nameBindings} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>Slug:</Text>
          <Input placeholder="Text" width="100%" {...slugBindings} />
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>Device Type:</Text>
          <Radio.Group value={deviceType} useRow onChange={handleDeviceType}>
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
          <Textarea placeholder="Text" width="100%" {...descBindings} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>Submit</Button>
        </Grid>
      </Grid.Container>
    </>
  )
}

export default AppNewPage
