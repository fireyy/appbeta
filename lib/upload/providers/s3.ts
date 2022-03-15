import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { PassThrough } from 'stream'

const conf = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
}

const bucketName = process.env.AWS_BUCKET

export default {
  provider: 'aws',
  name: 'AWS S3',
  init(config) {
    const S3 = new S3Client(conf)
    return {
      async upload(file, customParams = {}) {
        const pass = new PassThrough()
        const keyName = file.newFilename

        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: keyName,
          Body: pass,
        })

        try {
          await S3.send(uploadCommand)

          file.url = `https://${bucketName}.s3.${conf.region}.amazonaws.com/${keyName}`
        } catch (err) {
          console.error(err)
        }
      },
      async delete(file) {
        const path = file.path ? `${file.path}/` : ''
        const keyName = `${path}${file.hash}${file.ext}`

        const deleteCommand = new DeleteObjectCommand({
          Key: keyName,
          Bucket: bucketName
        })

        try {
          await S3.send(deleteCommand)
        } catch (err) {
          console.error(err)
        }
      },
    }
  },
}
