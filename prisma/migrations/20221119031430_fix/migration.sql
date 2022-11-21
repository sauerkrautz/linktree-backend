-- DropIndex
DROP INDEX `refreshToken_id_idx` ON `refreshtoken`;

-- CreateIndex
CREATE INDEX `refreshToken_userId_idx` ON `refreshToken`(`userId`);
