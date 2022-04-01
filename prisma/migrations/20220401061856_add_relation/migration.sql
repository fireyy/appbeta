/*
  Warnings:

  - Made the column `appId` on table `Packages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Packages" ALTER COLUMN "appId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Apps" ADD CONSTRAINT "Apps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
