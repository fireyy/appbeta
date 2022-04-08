/** @type {import('next').NextConfig} */
const path = require('path')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const nextTranslate = require('next-translate')

const nextConfig = async (phase, { defaultConfig }) => {
  const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
      uploadDir: phase === PHASE_DEVELOPMENT_SERVER ? path.resolve(__dirname, 'public', 'uploads') : path.resolve(__dirname, 'uploads'),
    },
    publicRuntimeConfig: {
      baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      staticPath: process.env.STORAGE_PROVIDER === 'local' ? '/uploads/' : process.env.QINIU_BASEURL
    }
  }
  return nextTranslate(nextConfig)
}

module.exports = nextConfig
