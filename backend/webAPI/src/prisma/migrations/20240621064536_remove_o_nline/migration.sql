/*
  Warnings:

  - You are about to drop the column `isOnline` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `OTP` on the `UserAuthentication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnline";

-- AlterTable
ALTER TABLE "UserAuthentication" DROP COLUMN "OTP",
ADD COLUMN     "LastVerifiedOTP" TEXT;

-- AddForeignKey
ALTER TABLE "UserInformation" ADD CONSTRAINT "UserInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
