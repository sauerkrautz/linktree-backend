/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `refreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `refreshToken_userId_fkey`;

-- DropIndex
DROP INDEX `user_uuid_id_idx` ON `user`;

-- CreateIndex
CREATE UNIQUE INDEX `refreshToken_userId_key` ON `refreshToken`(`userId`);

-- CreateIndex
CREATE INDEX `user_id_idx` ON `user`(`id`);

-- AddForeignKey
ALTER TABLE `refreshToken` ADD CONSTRAINT `refreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
