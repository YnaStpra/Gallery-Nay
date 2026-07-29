-- AlterTable
ALTER TABLE "Photo"
ADD COLUMN     "originalImageUrl" TEXT,
ADD COLUMN     "originalPublicId" TEXT,
ADD COLUMN     "originalWidth" INTEGER,
ADD COLUMN     "originalHeight" INTEGER,
ADD COLUMN     "originalFileSize" INTEGER,
ADD COLUMN     "originalFileType" TEXT;
