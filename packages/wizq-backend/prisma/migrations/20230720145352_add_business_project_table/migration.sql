-- CreateTable
CREATE TABLE "BusinessProject" (
    "id" TEXT NOT NULL,
    "businessId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryOnBusinessProject" (
    "projectId" VARCHAR(255) NOT NULL,
    "categoryId" VARCHAR(255) NOT NULL,

    CONSTRAINT "CategoryOnBusinessProject_pkey" PRIMARY KEY ("projectId","categoryId")
);

-- CreateTable
CREATE TABLE "ProjectFileOnBusiness" (
    "id" TEXT NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "fileUrl" VARCHAR(255) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFileOnBusiness_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessProject" ADD CONSTRAINT "BusinessProject_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnBusinessProject" ADD CONSTRAINT "CategoryOnBusinessProject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnBusinessProject" ADD CONSTRAINT "CategoryOnBusinessProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BusinessProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFileOnBusiness" ADD CONSTRAINT "ProjectFileOnBusiness_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BusinessProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
