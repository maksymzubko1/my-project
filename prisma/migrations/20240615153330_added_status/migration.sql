/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('DEFAULT', 'HIDDEN', 'DELETED', 'DRAFTED');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isDeleted",
ADD COLUMN     "status" "PostType" NOT NULL DEFAULT 'DEFAULT';
