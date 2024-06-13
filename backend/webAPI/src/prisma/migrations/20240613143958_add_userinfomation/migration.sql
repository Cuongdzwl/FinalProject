/*
  Warnings:

  - You are about to drop the column `name_normalize` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameNormalize]` on the table `AuthenticationProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameNormalize` to the `AuthenticationProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AuthenticationProvider_name_normalize_key";

-- AlterTable
ALTER TABLE "AuthenticationProvider" DROP COLUMN "name_normalize",
ADD COLUMN     "nameNormalize" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserInformation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "firstName" VARCHAR(25),
    "lastName" VARCHAR(25),
    "dob" TIMESTAMP(3),
    "bio" VARCHAR(2000),
    "avatar" TEXT DEFAULT 'https://www.gravatar.com/avatar/',
    "isMale" BOOLEAN,
    "phone" VARCHAR(15),
    "phoneverified" BOOLEAN DEFAULT false,
    "address" VARCHAR(200),
    "city" VARCHAR(50),
    "country" VARCHAR(50),

    CONSTRAINT "UserInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "OTP" TEXT,
    "OTPKey" TEXT,
    "resetPasswordToken" TEXT,

    CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInformation_userId_key" ON "UserInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_userId_key" ON "UserAuthentication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_nameNormalize_key" ON "AuthenticationProvider"("nameNormalize");

-- AddForeignKey
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
