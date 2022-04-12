import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import type { NextPage, GetServerSideProps } from 'next'
import { Fieldset, Button, Grid, useToasts, useTheme, Input, Avatar, useInput } from '@geist-ui/core'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import AccountSidebar from 'components/account-sidebar'
import useTranslation from 'next-translate/useTranslation'

const AccountPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { t } = useTranslation('common')

  // const { data: user } = useSWR(session?.user.id && `/api/account/${session.user.id}`)

  const { state: name, setState: setName, bindings: bindName } = useInput(session?.user?.name)
  const { state: email, setState: setEmail, bindings: bindEmail } = useInput(session?.user?.email)

  useEffect(() => {
    if (session && session.user) {
      setName(session.user.name)
      setEmail(session.user.email)
    }
  }, [session])

  const handleSaveName = () => handleSave('name', name)

  const handleSaveEmail = () => handleSave('email', email)

  const handleSave = async (type, data) => {
    setLoading(true)
    await fetch(`/api/account/${session.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [type]: data
      })
    })
    setLoading(false)
    setToast({
      text: t('Updated successfully', {
        msg: `user ${type}`
      }),
      type: 'success',
    })
  }

  return (
    <Layout title="Settings">
      <NavLink>Settings</NavLink>
      <div className="page__content">
        <Grid.Container gap={2}>
          <AccountSidebar />
          <Grid xs={24} md={18} direction="column">
            <Fieldset width="100%" mb={2}>
              <Fieldset.Title>Your Name</Fieldset.Title>
              <Fieldset.Subtitle>Please enter your full name, or a display name you are comfortable with.</Fieldset.Subtitle>
              <Input autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck="true" maxLength={32} width="300px" {...bindName} />
              <Fieldset.Footer>
                Please use 32 characters at maximum.
                <Button type="secondary" loading={loading} auto scale={1/3} onClick={handleSaveName}>Save</Button>
              </Fieldset.Footer>
            </Fieldset>
            <Fieldset width="100%" mb={2}>
              <Fieldset.Title>Your Email</Fieldset.Title>
              <Fieldset.Subtitle>Please enter the email address you want to use to log in with Vercel.</Fieldset.Subtitle>
              <Input htmlType="email" autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck="true" width="300px" {...bindEmail} />
              <Fieldset.Footer>
                We will email you to verify the change.
                <Button type="secondary" loading={loading} auto scale={1/3} onClick={handleSaveEmail}>Save</Button>
              </Fieldset.Footer>
            </Fieldset>
            <Fieldset width="100%" mb={2}>
              <Fieldset.Content className="avatar-box">
                <Fieldset.Title>Your Avatar</Fieldset.Title>
                <Fieldset.Subtitle>This is your avatar.</Fieldset.Subtitle>
                <Fieldset.Subtitle>Click on the avatar to upload a custom one from your files.</Fieldset.Subtitle>
                <Avatar src={session?.user.image} width="80px" height="80px" />
              </Fieldset.Content>
              <Fieldset.Footer>
                An avatar is optional but strongly recommended.
              </Fieldset.Footer>
            </Fieldset>
          </Grid>
        </Grid.Container>
      </div>
      <style jsx>{`
        .page__content {
          padding: ${theme.layout.gap} 0;
        }
        :global(.avatar-box) {
          position: relative;
        }
        .page__content :global(.avatar-box .avatar) {
          cursor: pointer;
          position: absolute;
          right: 20px;
          top: 20px;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return { props: { } }
}

export default AccountPage
