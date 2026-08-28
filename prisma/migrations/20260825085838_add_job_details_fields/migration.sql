-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ON_SITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "compensationNote" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "vacancyCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "workMode" "WorkMode" NOT NULL DEFAULT 'ON_SITE';
