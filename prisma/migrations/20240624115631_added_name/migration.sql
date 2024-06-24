/*
  Warnings:

  - Added the required column `name` to the `Mixin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mixin" ADD COLUMN     "name" TEXT NOT NULL;
