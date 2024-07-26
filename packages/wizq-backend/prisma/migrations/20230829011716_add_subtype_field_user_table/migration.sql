-- CreateEnum
CREATE TYPE "UserSubType" AS ENUM ('PROVIDER', 'DESIGNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subType" "UserSubType" NOT NULL DEFAULT 'PROVIDER';
