import getConfig from 'next/config'

const hexToRgb = (color: string): [number, number, number] => {
  const fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const full = color.replace(
    fullReg,
    (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`
  )
  const values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full)
  if (!values) {
    throw new Error(`Geist UI: Unsupported ${color} color.`)
  }
  return [
    Number.parseInt(values[1], 16),
    Number.parseInt(values[2], 16),
    Number.parseInt(values[3], 16),
  ]
}

export const colorToRgbValues = (color: string) => {
  if (color.charAt(0) === '#') return hexToRgb(color)

  const safeColor = color.replace(/ /g, '')
  const colorType = color.substr(0, 4)

  const regArray = safeColor.match(/\((.+)\)/)
  if (!colorType.startsWith('rgb') || !regArray) {
    console.log(color)
    throw new Error(`Geist UI: Only support ["RGB", "RGBA", "HEX"] color.`)
  }

  return regArray[1].split(',').map((str) => Number.parseFloat(str))
}

export const addColorAlpha = (color: string, alpha: number) => {
  if (!/^#|rgb|RGB/.test(color)) return color
  const [r, g, b] = colorToRgbValues(color)
  const safeAlpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`
}

export function timeAgo (time: string) {
  const between = (Date.now() - new Date(time).getTime()) / 1000
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize (time: number, label: string) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export const getStatic = (file: string = 'default.svg', type = 'icons') => {
  const { publicRuntimeConfig: { staticFolder, baseUrl } } = getConfig()
  return `${baseUrl}${staticFolder}${type}/${file || 'default.svg'}`
}

export const getIconPath = (file: string) => getStatic(file, 'icons')
export const getPkgPath = (file: string) => getStatic(file, 'downloads')

export const getAutoTheme = t => t === 'auto' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light' : t

export const getBaseUrl = () => {
  const { publicRuntimeConfig: { baseUrl } } = getConfig()
  return baseUrl
}

export const getItmsServices = (pid: string) => {
  const { publicRuntimeConfig: { baseUrl } } = getConfig()
  return `itms-services://?action=download-manifest&url=${baseUrl}/api/plist/${pid}`
}
