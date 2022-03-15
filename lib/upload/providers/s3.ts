import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { PassThrough } from 'stream'

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY,
  AWS_REGION,
  AWS_BUCKET,
  AWS_BASEURL,
} = process.env

if (
  AWS_ACCESS_KEY_ID === 'YOUR AK' ||
  AWS_SECRET_KEY === 'YOUR SK' ||
  AWS_REGION === 'YOUR REGION' ||
  AWS_BUCKET === 'YOUR BUCKET' ||
  AWS_BASEURL === 'YOUR URL'
  ) {
  throw new Error(
    ` AWS S3 config parameters has not define , please define the parameters in .env file in the project root path.`
  )
}

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
        } catch (err) {
          console.error(err)
        }
      },
      async delete(file) {
        const deleteCommand = new DeleteObjectCommand({
          Key: file,
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
