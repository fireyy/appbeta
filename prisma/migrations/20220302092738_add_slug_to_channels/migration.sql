/*
  Warnings:

  - Added the required column `slug` to the `Channels` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "appId" INTEGER,
    "packageName" TEXT,
    "packagesCount" INTEGER DEFAULT 0,
    "bundleId" TEXT,
    "deviceType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "password" TEXT,
    "sort" INTEGER DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Channels" ("appId", "bundleId", "created_at", "deletedAt", "deviceType", "id", "name", "packageName", "packagesCount", "password", "sort", "updated_at", "userId") SELECT "appId", "bundleId", "created_at", "deletedAt", "deviceType", "id", "name", "packageName", "packagesCount", "password", "sort", "updated_at", "userId" FROM "Channels";
DROP TABLE "Channels";
ALTER TABLE "new_Channels" RENAME TO "Channels";
CREATE INDEX "index_channels_on_deleted_at" ON "Channels"("deletedAt");
CREATE UNIQUE INDEX "Channels_appId_slug_key" ON "Channels"("appId", "slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
