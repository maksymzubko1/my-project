/*
  Warnings:

  - The values [DELETED] on the enum `PostType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('DEFAULT', 'HIDDEN', 'DRAFTED');
ALTER TABLE "Post" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "status" TYPE "PostType_new" USING ("status"::text::"PostType_new");
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "PostType_old";
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'DEFAULT';
COMMIT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
