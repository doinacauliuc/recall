-- CreateTable
CREATE TABLE `Chat` (
    `chat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_title` VARCHAR(191) NOT NULL,
    `last_opened` DATETIME(3) NOT NULL,
    `messages` JSON NOT NULL,

    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
