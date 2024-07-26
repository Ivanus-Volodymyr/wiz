-- DropForeignKey
ALTER TABLE "ContractsFile" DROP CONSTRAINT "ContractsFile_contractId_fkey";

-- DropForeignKey
ALTER TABLE "MilestonesOnContracts" DROP CONSTRAINT "MilestonesOnContracts_contractId_fkey";

-- AddForeignKey
ALTER TABLE "MilestonesOnContracts" ADD CONSTRAINT "MilestonesOnContracts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractsFile" ADD CONSTRAINT "ContractsFile_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
