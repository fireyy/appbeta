import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Input, Button, Text, Grid, Textarea, Radio, useInput, useToasts } from '@geist-ui/core'
import useSWR from 'swr'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import useTranslation from 'next-translate/useTranslation'

const AppNewPage: React.FC<unknown> = () => {
  const [deviceType, setDeviceType] = useState('ios')
  const { state: name, setState: setName, bindings: nameBindings } = useInput('')
  const { state: slug, setState: setSlug, bindings: slugBindings } = useInput('')
  const { state: desc, setState: setDesc, bindings: descBindings } = useInput('')
  const [loading, setLoading] = useState(false)
  const { query: { id = 0 } } = useRouter()
  const isEdit = id !== 0
  const { setToast } = useToasts()
  const { t } = useTranslation('common')

  const handleDeviceType = (val: string) => {
    setDeviceType(val)
  }

  const { data: app, error } = useSWR(id && `/api/apps/${id}`)

  useEffect(() => {
    if (app) {
      setName(app.name)
      setSlug(app.slug)
      setDesc(app.description)
      setDeviceType(app.deviceType)
    }
  }, [app])

  const handleSubmit = async () => {
    setLoading(true)
    let url = isEdit ? `/${id}` : ''
    await fetch('/api/apps' + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        description: desc,
        deviceType,
      }),
    })
    setToast({
      text: t('Added new app Successfully.'),
      type: 'success',
    })
    await Router.push(isEdit ? `/apps/${id}` : '/')
  }

  return (
    <Layout title={t('New')}>
      {
        isEdit ? <NavLink href={`/apps/${id}`} parent={name}>{t('Edit')}</NavLink> : <NavLink>{t('New')}</NavLink>
      }
      <Grid.Container gap={4} justify="center">
        <Grid xs={24} md={12} direction="column">
          <Text h6>{t('Name')}:</Text>
          <Input placeholder="Text" width="100%" {...nameBindings} />
        </Grid>
        <Grid xs={24} md={12} direction="column">
          <Text h6>{t('Slug')}:</Text>
          <Input placeholder="Text" width="100%" {...slugBindings} />
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>{t('Device Type')}:</Text>
          <Radio.Group value={deviceType} useRow onChange={handleDeviceType}>
            <Radio value="ios">
              {t('ios')}
              <Radio.Desc>{t('For iPhone, iPad and iPod touch')}</Radio.Desc>
            </Radio>
            <Radio value="android">
              {t('android')}
              <Radio.Desc>{t('For Android device')}</Radio.Desc>
            </Radio>
          </Radio.Group>
        </Grid>
        <Grid xs={24} direction="column">
          <Text h6>{t('Description')}:</Text>
          <Textarea placeholder="Text" width="100%" {...descBindings} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button type="secondary" onClick={handleSubmit} loading={loading}>{t('Submit')}</Button>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export default AppNewPage
