import bytesUtil from 'bytes-util'
import Router from 'next/router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

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
  dayjs.extend(relativeTime)
  return dayjs(time).locale(Router.locale).fromNow()
}

export function formatDate (time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export const bytesStr = bytesUtil.stringify
