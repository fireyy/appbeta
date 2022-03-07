export type AppItem = {
  name: string
  description: string
  deviceType: string
  slug: string
  icon?: string
  archived?: boolean
  createdAt: string
  updatedAt: string
  id: number
  lastPkgId?: string | null
  lastPkgSize?: string | null
  lastVersion?: string | null
  packagesCount?: number
  userId: number
}

export type AppInfo = {
  name?: string
  icon?: string
  bundleId?: string
  version?: string
  buildVersion?: string
  file?: string
  size?: string
}

export type PackageItem = {
  id: number
  appId: number
  name: string
  icon?: string
  bundleId?: string
  version?: string
  buildVersion?: string
  changelog?: string
  file?: string
  createdAt: string
  updatedAt: string
  size?: number
  userId: number
}

export type Seed = {
  name: string
  url: string
  icon: string
  group?: string
}

export type Seeds = Array<Seed>
