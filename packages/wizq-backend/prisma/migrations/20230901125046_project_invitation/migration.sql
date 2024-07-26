/*
  Warnings:

  - You are about to drop the column `designerId` on the `ProjectInvitation` table. All the data in the column will be lost.
  - You are about to drop the `Designers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationOnDesigner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectInvitationId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `ProjectInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "projectInvitationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_projectInvitationId_key" ON "Notification"("projectInvitationId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectInvitationId_fkey" FOREIGN KEY ("projectInvitationId") REFERENCES "ProjectInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
