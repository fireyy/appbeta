import qiniu from 'qiniu'
import { PassThrough } from 'node:stream'

const {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET
} = process.env

var mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)

var options = {
  scope: QINIU_BUCKET,
}
var uploadToken = new qiniu.rs.PutPolicy(options).uploadToken(mac)

var config = new qiniu.conf.Config()
var formUploader = new qiniu.form_up.FormUploader(config)
var putExtra = new qiniu.form_up.PutExtra()

export default (file) => {
  const pass = new PassThrough()
  formUploader.putStream(uploadToken, file.newFilename, pass, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr
    }
    if (respInfo.statusCode == 200) {
      console.log(respBody)
    } else {
      console.log(respInfo.statusCode)
      console.log(respBody)
    }
  });

  return pass
}
