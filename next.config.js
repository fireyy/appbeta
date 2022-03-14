/** @type {import('next').NextConfig} */
const path = require('path')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const nextConfig = async (phase, { defaultConfig }) => {
  const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
      pkgPath: phase === PHASE_DEVELOPMENT_SERVER ? path.resolve(__dirname, 'public', 'downloads') : path.resolve(__dirname, 'downloads'),
      iconPath: phase === PHASE_DEVELOPMENT_SERVER ? path.resolve(__dirname, 'public', 'icons') : path.resolve(__dirname, 'icons')
    },
    publicRuntimeConfig: {
      baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      staticFolder: '/'
    }
  }
  return nextConfig
}

module.exports = nextConfig
