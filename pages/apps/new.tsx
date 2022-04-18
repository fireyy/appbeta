import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Input, Button, Text, Grid, Textarea, Radio, useInput, useToasts } from '@geist-ui/core'
import useSWR from 'swr'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import useTranslation from 'next-translate/useTranslation'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  slug: string
  description: string
  deviceType: string
}

const AppNewPage: React.FC<unknown> = () => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const { query: { id = 0 } } = useRouter()
  const isEdit = id !== 0
  const { setToast } = useToasts()
  const { t } = useTranslation('common')

  const { data: app, error } = useSWR(id && `/api/apps/${id}`)

  useEffect(() => {
    if (app) {
      setValue('name', app.name)
      setValue('slug', app.slug)
      setValue('description', app.description)
      setValue('deviceType', app.deviceType)
    }
  }, [app])

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    let url = isEdit ? `/${id}` : ''
    await fetch('/api/apps' + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setToast({
      text: t('Added new app Successfully.'),
      type: 'success',
    })
    await Router.push(isEdit ? `/apps/${id}` : '/')
  })

  return (
    <Layout title={t('New')}>
      {
        isEdit ? <NavLink href={`/apps/${id}`} parent={app?.name}>{t('Edit')}</NavLink> : <NavLink>{t('New')}</NavLink>
      }
      <form onSubmit={onSubmit}>
        <Grid.Container gap={4} justify="center">
          <Grid xs={24} md={12} direction="column">
            <Text h6>{t('Name')}:</Text>
            <Input placeholder="Text" width="100%" {...register('name')} />
          </Grid>
          <Grid xs={24} md={12} direction="column">
            <Text h6>{t('Slug')}:</Text>
            <Input placeholder="Text" width="100%" {...register('slug')} />
          </Grid>
          <Grid xs={24} direction="column">
            <Text h6>{t('Device Type')}:</Text>
            <Radio.Group value={app?.deviceType} useRow onChange={(val: string) => setValue('deviceType', val)}>
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
            <Textarea placeholder="Text" width="100%" {...register('description')} />
          </Grid>
          <Grid xs justify="flex-end">
            <Button type="secondary" htmlType="submit" loading={loading}>{t('Submit')}</Button>
          </Grid>
        </Grid.Container>
      </form>
    </Layout>
  )
}

export default AppNewPage
