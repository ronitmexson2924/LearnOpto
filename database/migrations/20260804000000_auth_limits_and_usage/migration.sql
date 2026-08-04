-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "dailySearchCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailySearchDate" TIMESTAMP(3),
ADD COLUMN     "totalGeminiRequests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFailedLoginAt" TIMESTAMP(3);
