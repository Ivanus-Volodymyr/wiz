-- DropForeignKey
ALTER TABLE "ProjectFileOnBusiness" DROP CONSTRAINT "ProjectFileOnBusiness_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectFileOnBusiness" ADD CONSTRAINT "ProjectFileOnBusiness_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BusinessProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
