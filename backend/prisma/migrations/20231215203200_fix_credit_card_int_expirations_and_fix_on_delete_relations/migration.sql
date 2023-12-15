/*
  Warnings:

  - Changed the type of `expirationMonth` on the `credit_cards` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expirationYear` on the `credit_cards` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "credit_cards" DROP CONSTRAINT "credit_cards_userId_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_userId_fkey";

-- AlterTable
ALTER TABLE "credit_cards" DROP COLUMN "expirationMonth",
ADD COLUMN     "expirationMonth" SMALLINT NOT NULL,
DROP COLUMN "expirationYear",
ADD COLUMN     "expirationYear" SMALLINT NOT NULL;

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
