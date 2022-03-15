import qiniu from 'qiniu'
import { PassThrough } from 'stream'

const {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET,
  QINIU_BASEURL
} = process.env

if (
  QINIU_ACCESS_KEY === 'YOUR QINIU AK' ||
  QINIU_SECRET_KEY === 'YOUR QINIU SK' ||
  QINIU_BUCKET === 'YOUR QINIU BUCKET' ||
  QINIU_BASEURL === 'YOUR QINIU URL'
  ) {
  throw new Error(
    ` Qiniu config parameters has not define , please define the parameters in .env file in the project root path.`
  )
}

const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
const conf = new qiniu.conf.Config()
const options = {
  scope: QINIU_BUCKET,
}

export default {
  provider: 'qiniu',
  name: '七牛对象存储Kodo',
  init() {
    return {
      upload(file) {
        const pass = new PassThrough()
        try {
          const putPolicy = new qiniu.rs.PutPolicy(options)
          const uploadToken = putPolicy.uploadToken(mac)

          const formUploader = new qiniu.form_up.FormUploader(conf)
          const putExtra = new qiniu.form_up.PutExtra()
          formUploader.putStream(
            uploadToken,
            file.newFilename,
            pass,
            putExtra,
            function (respErr, respBody, respInfo) {
              if (respErr) {
                console.error(respErr)
              } else {
                if (respInfo.statusCode === 200) {
                  file.url = QINIU_BASEURL + respBody.key
                }
              }
            }
          )
        } catch (err) {
          console.error(err)
        }
        return pass
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const bucketManager = new qiniu.rs.BucketManager(mac, conf)
          const key = file.url.replace(QINIU_BASEURL, '')
          bucketManager.delete(QINIU_BUCKET, key, function (err, respBody, respInfo) {
            if (err) {
              console.error(err)
              reject(undefined)
            } else {
              resolve(respInfo.statusCode === 200)
            }
          })
        })
      },
    }
  },
}
