import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Fieldset, Button, Grid, Link, useTheme } from '@geist-ui/core'
import Layout from 'components/layout'
import NavLink from 'components/nav-link'
import AccountSidebar from 'components/account-sidebar'

const SystemManagement: NextPage = () => {
  const theme = useTheme()

  return (
    <Layout title="System Management">
      <NavLink>System Management</NavLink>
      <div className="page__content">
        <Grid.Container gap={2}>
          <AccountSidebar />
          <Grid xs={24} md={18}>System Management</Grid>
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

export default SystemManagement
