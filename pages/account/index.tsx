import React from 'react'
import { useRouter } from 'next/router'
import type { NextPage, GetServerSideProps } from 'next'
import { Fieldset, Button, Grid, Link, useTheme, Input, Avatar } from '@geist-ui/core'
import { useSession } from 'next-auth/react'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import AccountSidebar from 'components/account-sidebar'

const AccountPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { data: session } = useSession()

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
              <Input value={session?.user.name} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck="true" maxLength={32} width="300px" />
              <Fieldset.Footer>
                Please use 32 characters at maximum.
                <Button type="secondary" auto scale={1/3}>Save</Button>
              </Fieldset.Footer>
            </Fieldset>
            <Fieldset width="100%" mb={2}>
              <Fieldset.Title>Your Email</Fieldset.Title>
              <Fieldset.Subtitle>Please enter the email address you want to use to log in with Vercel.</Fieldset.Subtitle>
              <Input value={session?.user.email} htmlType="email" autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck="true" width="300px" />
              <Fieldset.Footer>
                We will email you to verify the change.
                <Button type="secondary" auto scale={1/3}>Save</Button>
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
