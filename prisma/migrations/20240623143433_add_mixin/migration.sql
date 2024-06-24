/*
  Warnings:

  - You are about to drop the `Embed` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MixinType" AS ENUM ('IMAGE', 'TEXT', 'POST');

-- CreateEnum
CREATE TYPE "DisplayOn" AS ENUM ('LIST', 'SEARCH', 'BOTH');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('MAIN', 'TAG_FILTER');

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_postId_fkey";

-- DropTable
DROP TABLE "Embed";

-- DropEnum
DROP TYPE "EmbedType";

-- CreateTable
CREATE TABLE "Mixin" (
    "id" TEXT NOT NULL,
    "type" "MixinType" NOT NULL,
    "text" TEXT,
    "link" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "displayOn" "DisplayOn" NOT NULL,
    "pageType" "PageType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "regex" TEXT,
    "imageId" TEXT,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mixin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mixin" ADD CONSTRAINT "Mixin_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mixin" ADD CONSTRAINT "Mixin_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
