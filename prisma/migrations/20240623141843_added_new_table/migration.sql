/*
  Warnings:

  - You are about to drop the column `postId` on the `Media` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmbedType" AS ENUM ('IMAGE', 'TEXT', 'POST');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_postId_fkey";

-- DropIndex
DROP INDEX "Media_postId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "Embed" (
    "id" TEXT NOT NULL,
    "type" "EmbedType" NOT NULL,
    "text" TEXT,
    "url" TEXT,
    "imageId" TEXT,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
