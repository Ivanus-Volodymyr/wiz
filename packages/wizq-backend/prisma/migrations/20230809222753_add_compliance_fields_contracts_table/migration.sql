-- CreateEnum
CREATE TYPE "NoticePeriodUnit" AS ENUM ('DAYS', 'MONTH');

-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "notice_period" DOUBLE PRECISION,
ADD COLUMN     "period_unit" "NoticePeriodUnit",
ADD COLUMN     "termination_date" TEXT;

-- CreateTable
CREATE TABLE "ContractsFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,

    CONSTRAINT "ContractsFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractsFile" ADD CONSTRAINT "ContractsFile_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
