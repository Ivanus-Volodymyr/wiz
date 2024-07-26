-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('HOME_OWNER', 'SERVICE_PROVIDER');

-- DropForeignKey
ALTER TABLE "CategoriesOnProjects" DROP CONSTRAINT "CategoriesOnProjects_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnProjects" DROP CONSTRAINT "CategoriesOnProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectOnSkills" DROP CONSTRAINT "ProjectOnSkills_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectOnSkills" DROP CONSTRAINT "ProjectOnSkills_skillId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "max_budget" TEXT,
ADD COLUMN     "min_budget" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType";

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectOnSkills" ADD CONSTRAINT "ProjectOnSkills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOnSkills" ADD CONSTRAINT "ProjectOnSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnProjects" ADD CONSTRAINT "CategoriesOnProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnProjects" ADD CONSTRAINT "CategoriesOnProjects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
