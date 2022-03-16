import getConfig from 'next/config'
import formidable from 'formidable'
import qiniu from './providers/qiniu'
import local from './providers/local'

const { serverRuntimeConfig: { uploadDir } } = getConfig()

const provider = process.env.STORAGE_PROVIDER
let config = {
  keepExtensions: true,
  filename (name, ext, part, form) {
    return `${name}_${Date.now()}${ext}`
  }
} as any
let uploadProvide

if (provider === 'local') {
  uploadProvide = local.init()
  config = {
    ...config,
    uploadDir
  }
} else {
  uploadProvide = qiniu.init()
  config = {
    ...config,
    fileWriteStreamHandler: uploadProvide.upload,
  }
}

export default {
  upload(req) {
    return new Promise((resolve, reject) => {
      const form = formidable(config)
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err)
          return
        }
        resolve({
          size: files.file[0].size,
          name: files.file[0].newFilename
        })
      })
    })
  },
  delete(file) {
    return uploadProvide.delete(file)
  }
}
