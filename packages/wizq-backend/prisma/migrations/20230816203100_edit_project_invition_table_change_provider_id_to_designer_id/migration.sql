/*
  Warnings:

  - You are about to drop the column `providerId` on the `Contracts` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `ProjectInvitation` table. All the data in the column will be lost.
  - Added the required column `designerId` to the `Contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designerId` to the `ProjectInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contracts" DROP CONSTRAINT "Contracts_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvitation" DROP CONSTRAINT "ProjectInvitation_providerId_fkey";

-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "providerId",
ADD COLUMN     "designerId" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInvitation" DROP COLUMN "providerId",
ADD COLUMN     "designerId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "Designers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "Designers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
