/*
  Warnings:

  - A unique constraint covering the columns `[appId,slug,deviceType]` on the table `Channels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Channels_appId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Channels_appId_slug_deviceType_key" ON "Channels"("appId", "slug", "deviceType");
