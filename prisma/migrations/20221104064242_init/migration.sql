-- CreateTable
CREATE TABLE `user` (
    `uuid` VARCHAR(255) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_uuid_key`(`uuid`),
    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `facebook` VARCHAR(255) NULL,
    `instagram` VARCHAR(255) NULL,
    `github` VARCHAR(255) NULL,
    `linkedin` VARCHAR(255) NULL,
    `twitter` VARCHAR(255) NULL,
    `discord` VARCHAR(255) NULL,
    `whatsapp` VARCHAR(255) NULL,

    UNIQUE INDEX `social_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `social` ADD CONSTRAINT `social_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
