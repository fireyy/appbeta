/*
  Warnings:

  - You are about to alter the column `appId` on the `Packages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Packages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appId" INTEGER,
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
