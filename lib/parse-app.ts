import { AppInfo } from 'lib/interfaces'

export default function parseApp(path: string) {
  // dirty fix
  const parser = new (window as any).AppInfoParser(path)

  return new Promise((resolve, reject) => {
    parser.parse().then(result => {
      const info: AppInfo = {}
      if (result.CFBundleIdentifier) { // iOS
        // info.platform = 'ios'
        info.bundleId = result.CFBundleIdentifier
        // info.bundleName = result.CFBundleName
        info.name = result.CFBundleDisplayName
        info.buildVersion = result.CFBundleVersion
        info.version = result.CFBundleShortVersionString
        info.icon = result.icon
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

        // info.platform = 'android'
        info.bundleId = result.package
        // info.bundleName = result.package
        info.name = appName
        info.buildVersion = String(result.versionCode)
        info.version = result.versionName
        info.icon = result.icon
      }
      resolve(info)
    })
  })
}
