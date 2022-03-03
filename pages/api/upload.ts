import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import parseApp from '../../lib/parse-app'

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseFile = async (file: string) => {
  console.log('file', file)
  const result: any = await parseApp(file)
  const base64Data = result.icon.replace(/^data:image\/png;base64,/, '')
  const name = crypto.createHash('md5').update(file).digest('hex') + '.png'
  fs.writeFile(path.join(process.env.ICON_PATH, name), base64Data, 'base64', function(err) {
    console.log(err)
  })
  result.icon = `/public/icons/${name}.png`
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
      uploadDir: process.env.UPLOAD_PATH,
      keepExtensions: true,
      filename (name, ext, part, form) {
        return `${name}_${Date.now()}${ext}`
      }
    })
    form.parse(req, async (err, fields, files) => {
      const result = await parseFile(files.file[0].filepath)
      res.json(result)
    })
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}