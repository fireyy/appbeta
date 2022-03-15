import type { NextApiRequest, NextApiResponse } from 'next'
import storage from 'lib/upload'

export const config = {
  api: {
    bodyParser: false,
  },
}

// const parseFile = async (file) => {
//   const { filepath, size } = file
//   const result: any = await parseApp(filepath)
//   const base64Data = result.icon.replace(/^data:image\/png;base64,/, '')
//   const name = crypto.createHash('md5').update(filepath).digest('hex') + '.png'
//   fs.writeFile(path.join(iconPath, name), base64Data, 'base64', function(err) {
//     console.log(err)
//   })
//   result.icon = name
//   result.file = path.basename(filepath)
//   result.size = size
//   return result
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const result = await storage.upload(req)
    res.json(result)
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
