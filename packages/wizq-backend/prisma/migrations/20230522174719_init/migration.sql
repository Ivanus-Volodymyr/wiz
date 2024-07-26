-- CreateTable
CREATE TABLE "TestEntity" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL DEFAULT 'testEntity',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "TestEntity_pkey" PRIMARY KEY ("id")
);
