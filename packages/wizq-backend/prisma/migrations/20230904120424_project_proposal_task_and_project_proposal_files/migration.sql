-- CreateTable
CREATE TABLE "ProjectProposalsTask" (
    "id" TEXT NOT NULL,
    "task_item" TEXT NOT NULL,
    "task_description" TEXT,
    "estimated_price" INTEGER NOT NULL,
    "projectProposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProposalsTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProposalsFile" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" INTEGER,
    "projectProposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProposalsFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectProposalsTask" ADD CONSTRAINT "ProjectProposalsTask_projectProposalId_fkey" FOREIGN KEY ("projectProposalId") REFERENCES "ProjectProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProposalsFile" ADD CONSTRAINT "ProjectProposalsFile_projectProposalId_fkey" FOREIGN KEY ("projectProposalId") REFERENCES "ProjectProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
