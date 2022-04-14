import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getServerSession } from 'next-auth/next'
import { getProviders, signIn } from 'next-auth/react'
import { Button, Avatar, Card } from '@geist-ui/core'
import { authOptions } from 'lib/auth'
import Layout from 'components/layout'

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Layout title='Sign In'>
        <div className="sign-in">
          <Avatar src="/images/logo.svg" width={5} height={5} mb={0.5} />
          <Card width={20}>
            {Object.values(providers!).map((provider) => (
              <div key={provider.name}>
                <Button
                  className="!h-12 !px-5 !text-lg"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          </Card>
        </div>
      </Layout>
      <style jsx>{`
        .sign-in {
          display: flex;
          height: 100vh;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context, authOptions)
  const providers = await getProviders()

  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: { providers },
    }
  }

  return {
    props: { providers },
  }
}

export default SignIn
