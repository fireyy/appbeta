/*
  Warnings:

  - You are about to drop the column `platform` on the `Apps` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Packages` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Apps` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "lastVersion" TEXT,
    "lastPkgSize" INTEGER,
    "lastPkgId" INTEGER,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "channelCount" INTEGER DEFAULT 0,
    "packagesCount" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "deletedAt" DATETIME,
    "archived" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Apps" ("archived", "channelCount", "createdAt", "deletedAt", "description", "icon", "id", "lastPkgId", "lastPkgSize", "lastVersion", "name", "packagesCount", "updatedAt", "userId") SELECT "archived", "channelCount", "createdAt", "deletedAt", "description", "icon", "id", "lastPkgId", "lastPkgSize", "lastVersion", "name", "packagesCount", "updatedAt", "userId" FROM "Apps";
DROP TABLE "Apps";
ALTER TABLE "new_Apps" RENAME TO "Apps";
CREATE UNIQUE INDEX "Apps_slug_key" ON "Apps"("slug");
CREATE INDEX "index_apps_on_deleted_at" ON "Apps"("deletedAt");
CREATE TABLE "new_Packages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" BIGINT,
    "name" TEXT,
    "icon" TEXT,
    "channelId" INTEGER,
    "channelName" TEXT,
    "bundleId" TEXT,
    "version" TEXT,
    "buildVersion" TEXT,
    "changelog" TEXT,
    "file" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "size" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL
);
INSERT INTO "new_Packages" ("appId", "buildVersion", "bundleId", "changelog", "channelId", "channelName", "createdAt", "deletedAt", "file", "icon", "id", "name", "size", "updatedAt", "userId", "version") SELECT "appId", "buildVersion", "bundleId", "changelog", "channelId", "channelName", "createdAt", "deletedAt", "file", "icon", "id", "name", "size", "updatedAt", "userId", "version" FROM "Packages";
DROP TABLE "Packages";
ALTER TABLE "new_Packages" RENAME TO "Packages";
CREATE INDEX "index_packages_on_deleted_at" ON "Packages"("deletedAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
