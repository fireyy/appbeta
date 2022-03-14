import AWS from 'aws-sdk'
import { PassThrough } from 'node:stream'

const s3Client = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
})

export default (file) => {
  const pass = new PassThrough()
  s3Client.upload(
    {
      Bucket: 'demo-bucket',
      Key: file.newFilename,
      Body: pass,
    },
    (err, data) => {
      console.log(err, data)
    },
  )

  return pass
}
