/*
  Warnings:

  - You are about to drop the column `userReceivedId` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `userReceivedId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "userReceivedId" TEXT NOT NULL,
ADD COLUMN     "userSendId" TEXT;

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "userReceivedId";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userSendId_fkey" FOREIGN KEY ("userSendId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
