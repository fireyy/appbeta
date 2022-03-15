export default function base64ToFile(base64, name = '', mime = '') {
  var sliceSize = 1024
  var byteChars = window.atob(base64)
  var byteArrays = []

  for (
    var offset = 0, len = byteChars.length;
    offset < len;
    offset += sliceSize
  ) {
    var slice = byteChars.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  return new File(byteArrays, name, { type: mime })
}
