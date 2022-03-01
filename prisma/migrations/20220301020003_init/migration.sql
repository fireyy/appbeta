-- CreateTable
CREATE TABLE "Apps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Apps_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" BIGINT NOT NULL,
    "appId" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Channels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schemeId" BIGINT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL DEFAULT '*',
    "deviceType" TEXT NOT NULL,
    "gitUrl" TEXT,
    "password" TEXT,
    "key" TEXT
);

-- CreateTable
CREATE TABLE "Releases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channelId" BIGINT,
    "bundleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "releaseVersion" TEXT NOT NULL,
    "buildVersion" TEXT NOT NULL,
    "releseType" TEXT,
    "source" TEXT,
    "branch" TEXT,
    "gitCommit" TEXT,
    "icon" TEXT,
    "ciUrl" TEXT,
    "changelog" TEXT,
    "file" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "deviceType" TEXT
);

-- CreateTable
CREATE TABLE "Schemes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" BIGINT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "index_apps_on_name" ON "Apps"("name");

-- CreateIndex
CREATE INDEX "index_apps_users_on_app_id_and_user_id" ON "Apps_users"("appId", "userId");

-- CreateIndex
CREATE INDEX "index_apps_users_on_user_id_and_app_id" ON "Apps_users"("userId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "Channels_slug_key" ON "Channels"("slug");

-- CreateIndex
CREATE INDEX "index_channels_on_bundle_id" ON "Channels"("bundleId");

-- CreateIndex
CREATE INDEX "index_channels_on_device_type" ON "Channels"("deviceType");

-- CreateIndex
CREATE INDEX "index_channels_on_name" ON "Channels"("name");

-- CreateIndex
CREATE INDEX "index_channels_on_scheme_id_and_device_type" ON "Channels"("schemeId", "deviceType");

-- CreateIndex
CREATE INDEX "index_channels_on_slug" ON "Channels"("slug");

-- CreateIndex
CREATE INDEX "index_releases_on_build_version" ON "Releases"("buildVersion");

-- CreateIndex
CREATE INDEX "index_releases_on_bundle_id" ON "Releases"("bundleId");

-- CreateIndex
CREATE INDEX "index_releases_on_channel_id_and_version" ON "Releases"("channelId", "version");

-- CreateIndex
CREATE INDEX "index_releases_on_release_type" ON "Releases"("releseType");

-- CreateIndex
CREATE INDEX "index_releases_on_release_version_and_build_version" ON "Releases"("releaseVersion", "buildVersion");

-- CreateIndex
CREATE INDEX "index_releases_on_source" ON "Releases"("source");

-- CreateIndex
CREATE INDEX "index_releases_on_version" ON "Releases"("version");

-- CreateIndex
CREATE INDEX "index_schemes_on_app_id" ON "Schemes"("appId");

-- CreateIndex
CREATE INDEX "index_schemes_on_name" ON "Schemes"("name");

-- CreateIndex
CREATE INDEX "index_settings_on_key" ON "Settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
