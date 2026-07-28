-- AlterTable
ALTER TABLE "Photo"
ADD COLUMN     "lutUrl" TEXT,
ADD COLUMN     "lutFileName" TEXT,
ADD COLUMN     "lutFormat" TEXT,
ADD COLUMN     "lutFileSize" INTEGER,
ADD COLUMN     "lutName" TEXT,
ADD COLUMN     "lutVersion" TEXT,
ADD COLUMN     "lutDescription" TEXT,
ADD COLUMN     "editingSoftware" TEXT,
ADD COLUMN     "cameraProfile" TEXT,
ADD COLUMN     "allowDownload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "uploadedAt" TIMESTAMP(3);
