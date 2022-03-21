import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Fieldset, Button, Grid, Link, useTheme, Text, Card, Popover, Spacer } from '@geist-ui/core'
import { useSession } from 'next-auth/react'
import Github from '@geist-ui/icons/github'
import MoreVertical from '@geist-ui/icons/moreVertical'
import useSWR from 'swr'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import AccountSidebar from 'components/account-sidebar'

const ProviderIcons = {
  'github': Github,
}

const LoginConnections: NextPage = () => {
  const theme = useTheme()
  const { data: session } = useSession()

  const { data: providers } = useSWR('/api/auth/providers')
  const { data: accounts } = useSWR(session?.user.id && `/api/account/${session.user.id}`)

  return (
    <Layout title="Login Connections">
      <NavLink>Login Connections</NavLink>
      <div className="page__content">
        <Grid.Container gap={2}>
          <AccountSidebar />
          <Grid xs={24} md={18} direction="column">
            <Text h3>Login Connections</Text>
            <Text p font="14px">Connect your Personal Account with a third-party service to use it for login. One Login Connection can be added per third-party service.</Text>
            <Fieldset width="100%" mb={2}>
              <Fieldset.Title>OAuth services</Fieldset.Title>
              <Fieldset.Subtitle>Please enter the email address you want to use to log in with Vercel.</Fieldset.Subtitle>
              {
                providers && Object.keys(providers).map(t => {
                  const name = providers[t].name
                  const ICON = ProviderIcons[providers[t].id]
                  return (
                    <Button key={name} type="success" icon={<ICON />} auto>{name}</Button>
                  )
                })
              }
              <Fieldset.Footer>
                We will email you to verify the change.
              </Fieldset.Footer>
            </Fieldset>
            {
              accounts && accounts.map(account => {
                const ICON = ProviderIcons[account.provider]
                return (
                  <Card width="100%" key={account.id}>
                    <Grid.Container gap={2}>
                      <Grid><ICON size={20} /></Grid>
                      <Grid xs>
                        <Text b style={{ textTransform: 'capitalize' }}>{account.provider}</Text>
                      </Grid>
                      <Grid>
                        <Popover placement="top" content={
                          <>
                            <Popover.Item>
                              <Link href="#">A hyperlink</Link>
                            </Popover.Item>
                            <Popover.Item>
                              <Link href="#">A hyperlink</Link>
                            </Popover.Item>
                          </>
                        }>
                          <MoreVertical size={20} />
                        </Popover>
                      </Grid>
                    </Grid.Container>
                  </Card>
                )
              })
            }
          </Grid>
        </Grid.Container>
      </div>
      <style jsx>{`
        .page__content {
          padding: ${theme.layout.gap} 0;
        }
      `}</style>
    </Layout>
  )
}

export default LoginConnections
