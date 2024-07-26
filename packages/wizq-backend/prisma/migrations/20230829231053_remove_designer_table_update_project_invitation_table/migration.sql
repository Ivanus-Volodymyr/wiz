/*
  Warnings:

  - You are about to drop the column `designerId` on the `ProjectInvitation` table. All the data in the column will be lost.
  - You are about to drop the `Designers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationOnDesigner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerId` to the `ProjectInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contracts" DROP CONSTRAINT "Contracts_designerId_fkey";

-- DropForeignKey
ALTER TABLE "LocationOnDesigner" DROP CONSTRAINT "LocationOnDesigner_designerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvitation" DROP CONSTRAINT "ProjectInvitation_designerId_fkey";

-- AlterTable
ALTER TABLE "ProjectInvitation" DROP COLUMN "designerId",
ADD COLUMN     "providerId" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "Designers";

-- DropTable
DROP TABLE "LocationOnDesigner";

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
