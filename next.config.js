/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    pkgPath: path.resolve(__dirname, 'public', 'downloads'),
    iconPath: path.resolve(__dirname, 'public', 'icons')
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    staticFolder: '/'
  }
}

module.exports = nextConfig
