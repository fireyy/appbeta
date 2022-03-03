/*
  Warnings:

  - You are about to drop the column `created_at` on the `Channels` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Channels` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Channels` table without a default value. This is not possible if the table is not empty.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Channels" ("appId", "bundleId", "deletedAt", "deviceType", "id", "name", "packageName", "packagesCount", "password", "slug", "sort", "userId") SELECT "appId", "bundleId", "deletedAt", "deviceType", "id", "name", "packageName", "packagesCount", "password", "slug", "sort", "userId" FROM "Channels";
DROP TABLE "Channels";
ALTER TABLE "new_Channels" RENAME TO "Channels";
CREATE INDEX "index_channels_on_deleted_at" ON "Channels"("deletedAt");
CREATE UNIQUE INDEX "Channels_appId_slug_key" ON "Channels"("appId", "slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
