-- AlterTable
ALTER TABLE "Mixin" ALTER COLUMN "displayOn" DROP NOT NULL,
ALTER COLUMN "pageType" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MixinSettings" (
    "id" TEXT NOT NULL,
    "mixinPerList" INTEGER NOT NULL DEFAULT 3,
    "mixinPerSearch" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "MixinSettings_pkey" PRIMARY KEY ("id")
);
