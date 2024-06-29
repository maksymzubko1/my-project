/*
  Warnings:

  - You are about to drop the column `link` on the `Mixin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mixin" DROP COLUMN "link",
ADD COLUMN     "linkForImage" TEXT,
ADD COLUMN     "linkForText" TEXT;
