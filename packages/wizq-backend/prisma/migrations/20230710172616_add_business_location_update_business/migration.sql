/*
  Warnings:

  - You are about to alter the column `authorId` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `CategoriesOnBusinesses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `businessId` on the `CategoriesOnBusinesses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `categoryId` on the `CategoriesOnBusinesses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `ServicesOnBusinesses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `businessId` on the `ServicesOnBusinesses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `serviceId` on the `ServicesOnBusinesses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnBusinesses" DROP CONSTRAINT "CategoriesOnBusinesses_businessId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnBusinesses" DROP CONSTRAINT "CategoriesOnBusinesses_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesOnBusinesses" DROP CONSTRAINT "ServicesOnBusinesses_businessId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesOnBusinesses" DROP CONSTRAINT "ServicesOnBusinesses_serviceId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "like_location" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "authorId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "license" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CategoriesOnBusinesses" DROP CONSTRAINT "CategoriesOnBusinesses_pkey",
ALTER COLUMN "businessId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "categoryId" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "CategoriesOnBusinesses_pkey" PRIMARY KEY ("businessId", "categoryId");

-- AlterTable
ALTER TABLE "Services" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "ServicesOnBusinesses" DROP CONSTRAINT "ServicesOnBusinesses_pkey",
ALTER COLUMN "businessId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "serviceId" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "ServicesOnBusinesses_pkey" PRIMARY KEY ("businessId", "serviceId");

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "businessId" VARCHAR(255) NOT NULL,
    "country" VARCHAR(45) NOT NULL,
    "state" VARCHAR(45) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "zipcode" VARCHAR(45) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnBusinesses" ADD CONSTRAINT "CategoriesOnBusinesses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnBusinesses" ADD CONSTRAINT "CategoriesOnBusinesses_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnBusinesses" ADD CONSTRAINT "ServicesOnBusinesses_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnBusinesses" ADD CONSTRAINT "ServicesOnBusinesses_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
