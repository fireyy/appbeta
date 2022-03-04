-- CreateTable
CREATE TABLE "Apps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "lastVersion" TEXT,
    "lastPkgSize" INTEGER,
    "lastPkgId" INTEGER,
    "description" TEXT,
    "deviceType" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "packagesCount" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Packages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" INTEGER,
    "name" TEXT,
    "icon" TEXT,
    "bundleId" TEXT,
    "version" TEXT,
    "buildVersion" TEXT,
    "changelog" TEXT,
    "file" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "size" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL
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
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Apps_slug_key" ON "Apps"("slug");

-- CreateIndex
CREATE INDEX "index_settings_on_key" ON "Settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
