import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getIconPath, getPkgPath } from 'lib/utils'

const genPlist = ({ name, file, size, icon, bundleId, version }) => `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>items</key>
	<array>
		<dict>
			<key>assets</key>
			<array>
				<dict>
					<key>kind</key>
					<string>software-package</string>
					<key>url</key>
          <string>${file}</string>
					<key>md5-size</key>
          <integer>${size}</integer>
				</dict>
				 <dict>
         <key>kind</key>
         <string>display-image</string>
         <!-- optional. indicates if icon needs shine effect applied. -->
         <key>needs-shine</key>
         <true/>
         <key>url</key>
         <string>${icon}</string>
        </dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>${bundleId}</string>
				<key>bundle-version</key>
				<string>${version}</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>${name}</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>
`

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { pid },
    method,
  } = req

  switch (method) {
    case 'GET':
      await handleGET(Number(pid), res)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// GET /api/app/plist/:pid
async function handleGET(pid: number, res: NextApiResponse) {
  const app = await prisma.packages.findUnique({
    where: {
      id: pid
    },
  })
  if (app) {
    const plistStr = genPlist({
      ...app,
      file: getPkgPath(app.file),
      icon: getIconPath(app.icon),
    })
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(plistStr)
  } else {
    res.json({})
  }
}
