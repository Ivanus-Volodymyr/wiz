/*
  Warnings:

  - The primary key for the `TestEntity` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TestEntity" DROP CONSTRAINT "TestEntity_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestEntity_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestEntity_id_seq";
