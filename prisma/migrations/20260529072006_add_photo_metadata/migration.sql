/*
  Warnings:

  - Added the required column `updatedAt` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "altText" TEXT,
ADD COLUMN     "aperture" TEXT,
ADD COLUMN     "blurDataUrl" TEXT,
ADD COLUMN     "camera" TEXT,
ADD COLUMN     "collection" TEXT,
ADD COLUMN     "colorProfile" TEXT,
ADD COLUMN     "copyright" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dominantColor" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "focalLength" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "isDownloadable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iso" INTEGER,
ADD COLUMN     "lens" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shutterSpeed" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "takenAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "width" INTEGER;
