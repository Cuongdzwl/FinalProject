/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastOnline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserToken" ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_refresh_token_key" ON "UserToken"("refresh_token");
