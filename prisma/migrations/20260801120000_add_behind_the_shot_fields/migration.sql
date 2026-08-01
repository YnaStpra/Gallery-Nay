-- AlterTable
ALTER TABLE "Photo"
ADD COLUMN IF NOT EXISTS "shootingConditions" TEXT,
ADD COLUMN IF NOT EXISTS "shootingChallenges" TEXT,
ADD COLUMN IF NOT EXISTS "waitingTime" TEXT,
ADD COLUMN IF NOT EXISTS "interestingFacts" TEXT,
ADD COLUMN IF NOT EXISTS "behindTheShot" TEXT;
