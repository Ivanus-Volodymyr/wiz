/*
  Warnings:

  - You are about to drop the column `designerId` on the `Contracts` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "designerId",
ADD COLUMN     "providerId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
