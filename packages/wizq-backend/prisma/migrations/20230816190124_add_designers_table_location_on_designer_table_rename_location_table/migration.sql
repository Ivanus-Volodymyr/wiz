/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_businessId_fkey";

-- DropTable
DROP TABLE "Location";

-- CreateTable
CREATE TABLE "LocationOnBusiness" (
    "id" TEXT NOT NULL,
    "businessId" VARCHAR(255) NOT NULL,
    "country" VARCHAR(45) NOT NULL,
    "state" VARCHAR(45) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "zipcode" VARCHAR(45) NOT NULL,

    CONSTRAINT "LocationOnBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designers" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "earned" DOUBLE PRECISION NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Designers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationOnDesigner" (
    "id" TEXT NOT NULL,
    "designerId" VARCHAR(255) NOT NULL,
    "country" VARCHAR(45) NOT NULL,
    "state" VARCHAR(45) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "zipcode" VARCHAR(45) NOT NULL,

    CONSTRAINT "LocationOnDesigner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationOnBusiness" ADD CONSTRAINT "LocationOnBusiness_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationOnDesigner" ADD CONSTRAINT "LocationOnDesigner_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "Designers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
