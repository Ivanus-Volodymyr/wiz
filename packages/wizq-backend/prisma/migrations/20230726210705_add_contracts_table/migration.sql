-- CreateEnum
CREATE TYPE "ContractsType" AS ENUM ('MILESTONE', 'FIXED_RATE', 'HOURLY');

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "contractId" VARCHAR(7),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "projectId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "start_date" VARCHAR(255) NOT NULL,
    "end_date" VARCHAR(255) NOT NULL,
    "authorId" VARCHAR(255) NOT NULL,
    "contract_type" "ContractsType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
