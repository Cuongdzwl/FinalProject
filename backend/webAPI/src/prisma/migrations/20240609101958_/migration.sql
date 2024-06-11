/*
  Warnings:

  - You are about to drop the column `token` on the `UserToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserToken_token_key";

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "token",
ADD COLUMN     "access_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_access_token_key" ON "UserToken"("access_token");
