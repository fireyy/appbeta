import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import parseApp from 'lib/parse-app'

export const config = {
  api: {
    bodyParser: false,
  },
}

const { serverRuntimeConfig: { pkgPath, iconPath } } = getConfig()

const parseFile = async (file) => {
  const { filepath, size } = file
  const result: any = await parseApp(filepath)
  const base64Data = result.icon.replace(/^data:image\/png;base64,/, '')
  const name = crypto.createHash('md5').update(filepath).digest('hex') + '.png'
  fs.writeFile(path.join(iconPath, name), base64Data, 'base64', function(err) {
    console.log(err)
  })
  result.icon = `${name}.png`
  result.file = path.basename(filepath)
  result.size = size
  return result
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const options = {
      filter: function ({name, originalFilename, mimetype}) {
        // TODO: keep only ipa and apk files
        // apk: application/vnd.android.package-archive
        return mimetype && mimetype.includes('')
      }
    }
    const form = formidable({
      uploadDir: pkgPath,
      keepExtensions: true,
      filename (name, ext, part, form) {
        return `${name}_${Date.now()}${ext}`
      }
    })
    form.parse(req, async (err, fields, files) => {
      const result = await parseFile(files.file[0])
      res.json(result)
    })
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}
