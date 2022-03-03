import AppInfoParser from 'app-info-parser'
import { AppInfo } from '../interfaces'

export default function parseApp(path: string) {
  const parser = new AppInfoParser(path)

  return new Promise((resolve, reject) => {
    parser.parse().then(result => {
      const info: AppInfo = {}
      if (result.CFBundleIdentifier) { // iOS
        info.platform = 'ios'
        info.bundleId = result.CFBundleIdentifier
        info.bundleName = result.CFBundleName
        info.name = result.CFBundleDisplayName
        info.buildVersion = result.CFBundleShortVersionString
        info.version = result.CFBundleVersion
        info.icon = result.icon
        try {
          const environment = result.mobileProvision.Entitlements['aps-environment']
          const active = result.mobileProvision.Entitlements['beta-reports-active']
          if (environment == 'production') {
              info.appLevel = active ? 'appstore' : 'enterprise'
          } else {
              info.appLevel = 'develop'
          }
        } catch (e) {
          info.appLevel = 'develop'
        }
      } else if (result.package) { // Android
        let label

        if (result.application && result.application.label && result.application.label.length > 0) {
          label = Array.isArray(result.application.label) ? result.application.label[0] : result.application.label
        }

        if (label) {
            label = label.replace(/'/g, '')
        }
        const appName = (result['application-label'] || result['application-label-zh-CN'] || result['application-label-es-US'] ||
        result['application-label-zh_CN'] || result['application-label-es_US'] || label || 'unknown')

        info.platform = 'android'
        info.bundleId = result.package
        info.bundleName = result.package
        info.name = appName
        info.buildVersion = result.versionName
        info.version = result.versionCode
        info.icon = result.icon
      }
      resolve(info)
    })
  })
}
