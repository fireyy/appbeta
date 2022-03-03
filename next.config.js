/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  env: {
    UPLOAD_PATH: path.resolve(__dirname, 'downloads'),
    ICON_PATH: path.resolve(__dirname, 'public', 'icons')
  }
}

module.exports = nextConfig
