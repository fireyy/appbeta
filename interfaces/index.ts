export type AppItem = {
  name: string
  description: string
  slug: string
  icon?: string
  archived?: boolean
  channelCount?: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  id: number
  lastPkgId?: string | null
  lastPkgSize?: string | null
  lastVersion?: string | null
  packagesCount?: number
  userId: number
}

export type ChannelItem = {
  id: number
  name: string
  slug: string
  appId?: number
  packageName?: string
  packagesCount?: number
  bundleId?: string
  deviceType: string
  userId: number
  password?: string
  sort?: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type AppInfo = {
  name?: string
  icon?: string
  bundleId?: string
  version?: string
  buildVersion?: string
  file?: string
}

export type PackageItem = {
  id: number
  appId: number
  name: string
  icon?: string
  channelId: number
  channelName: string
  bundleId?: string
  version?: string
  buildVersion?: string
  changelog?: string
  file?: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  size?: number
  userId: number
}
