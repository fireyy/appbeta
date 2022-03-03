/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  env: {
    UPLOAD_PATH: path.resolve(__dirname, 'public', 'downloads'),
    ICON_PATH: path.resolve(__dirname, 'public', 'icons')
  }
}

module.exports = nextConfig
