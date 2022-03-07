import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'

const removeFile = (file: string, type = 'icons') => {
  const { serverRuntimeConfig: { pkgPath, iconPath } } = getConfig()
  const pathToRemove = path.join(`${type === 'icons' ? iconPath : pkgPath}`, file)
  if (fs.existsSync(pathToRemove)) {
    fs.unlinkSync(pathToRemove)
  }
}

export default removeFile
