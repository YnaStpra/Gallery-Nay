-- AlterTable
ALTER TABLE "Photo"
ADD COLUMN IF NOT EXISTS "metadata" JSONB;
