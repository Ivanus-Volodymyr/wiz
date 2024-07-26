/*
  Warnings:

  - A unique constraint covering the columns `[projectProposalId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "projectProposalId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "stage" INTEGER,
ADD COLUMN     "status" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_projectProposalId_key" ON "Notification"("projectProposalId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectProposalId_fkey" FOREIGN KEY ("projectProposalId") REFERENCES "ProjectProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
