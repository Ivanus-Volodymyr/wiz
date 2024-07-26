-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "InvoiceCycleEnds" AS ENUM ('DAY_26_MONTH', 'DAY_27_MONTH', 'DAY_28_MONTH', 'DAY_29_MONTH', 'DAY_30_MONTH', 'LAST_DAY_MONTH');

-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "contract_amount" DOUBLE PRECISION,
ADD COLUMN     "hourly_rate" DOUBLE PRECISION,
ADD COLUMN     "invoice_cycle_ends" "InvoiceCycleEnds",
ADD COLUMN     "payment_amount" DOUBLE PRECISION,
ADD COLUMN     "payment_due_date" TEXT,
ADD COLUMN     "payment_first_day" TEXT,
ADD COLUMN     "payment_frequency" "PaymentFrequency",
ADD COLUMN     "payment_rate" DOUBLE PRECISION,
ADD COLUMN     "weekly_limit" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "MilestonesOnContracts" (
    "id" TEXT NOT NULL,
    "contractId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilestonesOnContracts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MilestonesOnContracts" ADD CONSTRAINT "MilestonesOnContracts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
