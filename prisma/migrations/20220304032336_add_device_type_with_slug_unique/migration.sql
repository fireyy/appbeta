/*
  Warnings:

  - A unique constraint covering the columns `[slug,deviceType]` on the table `Apps` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Apps_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Apps_slug_deviceType_key" ON "Apps"("slug", "deviceType");
