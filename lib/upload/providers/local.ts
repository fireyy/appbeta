import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'

const { serverRuntimeConfig: { uploadDir } } = getConfig()

export default {
  provider: 'local',
  name: 'Local Storage',
  init() {
    return {
      upload(file) {
        //
      },
      delete(file) {
        const pathToRemove = path.join(uploadDir, file)
        if (fs.existsSync(pathToRemove)) {
          fs.unlinkSync(pathToRemove)
        }
      }
    }
  }
}
