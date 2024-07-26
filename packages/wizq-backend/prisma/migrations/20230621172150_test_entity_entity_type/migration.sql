/*
  Warnings:

  - The `entityType` column on the `TestEntity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TestEntity" DROP COLUMN "entityType",
ADD COLUMN     "entityType" "EntityType" NOT NULL DEFAULT 'TEST_ENTITY';
